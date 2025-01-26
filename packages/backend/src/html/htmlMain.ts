import { indentString } from "../common/indentString";
import { retrieveTopFill } from "../common/retrieveFill";
import { HtmlTextBuilder } from "./htmlTextBuilder";
import { HtmlDefaultBuilder } from "./htmlDefaultBuilder";
import { htmlAutoLayoutProps } from "./builderImpl/htmlAutoLayout";
import { formatWithJSX } from "../common/parseJSX";
import { commonSortChildrenWhenInferredAutoLayout } from "../common/commonChildrenOrder";
import { addWarning } from "../common/commonConversionWarnings";
import { PluginSettings, HTMLPreview, AltNode, HTMLSettings } from "types";
import { renderAndAttachSVG } from "../altNodes/altNodeUtils";
import { getVisibleNodes } from "../common/nodeVisibility";

const selfClosingTags = ["img"];

export let isPreviewGlobal = false;

let previousExecutionCache: { style: string; text: string }[];

export const htmlMain = async (
  sceneNode: Array<SceneNode>,
  settings: PluginSettings,
  isPreview: boolean = false,
): Promise<string> => {

  isPreviewGlobal = isPreview;
  previousExecutionCache = [];

  let result = await htmlWidgetGenerator(sceneNode, settings);

  // remove the initial \n that is made in Container.
  if (result.length > 0 && result.startsWith("\n")) {
    result = result.slice(1, result.length);
  }

  return result;
};

export const generateHTMLPreview = async (
  nodes: SceneNode[],
  settings: PluginSettings,
  code?: string,
): Promise<HTMLPreview> => {
  const htmlCodeAlreadyGenerated =
    settings.framework === "HTML" && settings.jsx === false && code;
  const htmlCode = htmlCodeAlreadyGenerated
    ? code
    : await htmlMain(
        nodes,
        {
          ...settings,
          jsx: false,
        },
        true,
      );

  return {
    size: {
      width: nodes[0].width,
      height: nodes[0].height,
    },
    content: htmlCode,
  };
};

// todo lint idea: replace BorderRadius.only(topleft: 8, topRight: 8) with BorderRadius.horizontal(8)
const htmlWidgetGenerator = async (
  sceneNode: ReadonlyArray<SceneNode>,
  settings: HTMLSettings,
): Promise<string> => {
  // filter non visible nodes. This is necessary at this step because conversion already happened.
  const promiseOfConvertedCode = getVisibleNodes(sceneNode).map(
    convertNode(settings),
  );
  const code = (await Promise.all(promiseOfConvertedCode)).join("");
  return code;
};

const convertNode = (settings: HTMLSettings) => async (node: SceneNode) => {
  const altNode = await renderAndAttachSVG(node);
  if (altNode.svg) return htmlWrapSVG(altNode, settings);

  switch (node.type) {
    case "RECTANGLE":
    case "ELLIPSE":
      return htmlContainer(node, "", [], settings);
    case "GROUP":
      return htmlGroup(node, settings);
    case "FRAME":
    case "COMPONENT":
    case "INSTANCE":
    case "COMPONENT_SET":
      return htmlFrame(node, settings);
    case "SECTION":
      return htmlSection(node, settings);
    case "TEXT":
      return htmlText(node, settings);
    case "LINE":
      return htmlLine(node, settings);
    case "VECTOR":
      addWarning("VectorNodes are not fully supported in HTML");
      return htmlAsset(node, settings);
    default:
  }
  return "";
};

const htmlWrapSVG = (
  node: AltNode<SceneNode>,
  settings: HTMLSettings,
): string => {
  if (node.svg === "") return "";
  const builder = new HtmlDefaultBuilder(node, settings)
    .addData("svg-wrapper")
    .position();

  return `\n<div${builder.build()}>\n${node.svg ?? ""}</div>`;
};

const htmlGroup = async (
  node: GroupNode,
  settings: HTMLSettings,
): Promise<string> => {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  // also ignore if there are no children inside, which makes no sense
  if (node.width < 0 || node.height <= 0 || node.children.length === 0) {
    return "";
  }

  // this needs to be called after CustomNode because widthHeight depends on it
  const builder = new HtmlDefaultBuilder(node, settings).commonPositionStyles();

  if (builder.styles) {
    const attr = builder.build();

    const generator = await htmlWidgetGenerator(node.children, settings);

    return `\n<div${attr}>${indentString(generator)}\n</div>`;
  }

  return await htmlWidgetGenerator(node.children, settings);
};

// this was split from htmlText to help the UI part, where the style is needed (without <p></p>).
const htmlText = (node: TextNode, settings: HTMLSettings): string => {
  let layoutBuilder = new HtmlTextBuilder(node, settings)
    .commonPositionStyles()
    .textAlign();

  const styledHtml = layoutBuilder.getTextSegments(node.id);
  previousExecutionCache.push(...styledHtml);

  let content = "";
  if (styledHtml.length === 1) {
    layoutBuilder.addStyles(styledHtml[0].style);
    content = styledHtml[0].text;

    const additionalTag =
      styledHtml[0].openTypeFeatures.SUBS === true
        ? "sub"
        : styledHtml[0].openTypeFeatures.SUPS === true
          ? "sup"
          : "";

    if (additionalTag) {
      content = `<${additionalTag}>${content}</${additionalTag}>`;
    }
  } else {
    content = styledHtml
      .map((style) => {
        const tag =
          style.openTypeFeatures.SUBS === true
            ? "sub"
            : style.openTypeFeatures.SUPS === true
              ? "sup"
              : "span";

        return `<${tag} style="${style.style}">${style.text}</${tag}>`;
      })
      .join("");
  }

  return `\n<div${layoutBuilder.build()}>${content}</div>`;
};

const htmlFrame = async (
  node: SceneNode & BaseFrameMixin,
  settings: HTMLSettings,
): Promise<string> => {
  const childrenStr = await htmlWidgetGenerator(
    commonSortChildrenWhenInferredAutoLayout(node, settings.optimizeLayout),
    settings,
  );

  if (node.layoutMode !== "NONE") {
    const rowColumn = htmlAutoLayoutProps(node, node, settings);
    return htmlContainer(node, childrenStr, rowColumn, settings);
  } else {
    if (settings.optimizeLayout && node.inferredAutoLayout !== null) {
      const rowColumn = htmlAutoLayoutProps(
        node,
        node.inferredAutoLayout,
        settings,
      );
      return htmlContainer(node, childrenStr, rowColumn, settings);
    }

    // node.layoutMode === "NONE" && node.children.length > 1
    // children needs to be absolute
    return htmlContainer(node, childrenStr, [], settings);
  }
};

const htmlAsset = async (node: SceneNode, settings: HTMLSettings): Promise<string> => {
  if (!("opacity" in node) || !("layoutAlign" in node) || !("fills" in node)) {
    return "";
  }

  const builder = new HtmlDefaultBuilder(node, settings)
    .commonPositionStyles()
    .commonShapeStyles();

  let tag = "div";
  let src = "";
  if (retrieveTopFill(node.fills)?.type === "IMAGE") {
    console.log('found img 1');
    // addWarning("Image fills are replaced with placeholders");
    if (!("children" in node) || node.children.length === 0) {
      const image = figma.getImageByHash(node.fills[0].imageHash);
      const bytes = await image.getBytesAsync();
      const base64Image = convertBytesToBase64(bytes);
      const imgurUrl = await uploadToImgur(base64Image);
      tag = "img";
      src = ` src="${imgurUrl}"`;
    } else {
      builder.addStyles(
        formatWithJSX(
          "background-image",
          settings.jsx,
          `url(https://via.placeholder.com/${node.width.toFixed(0)}x${node.height.toFixed(0)})`,
        ),
      );
    }
  }

  if (tag === "div") {
    return `\n<div${builder.build()}${src}></div>`;
  }

  return `\n<${tag}${builder.build()}${src} />`;
};

// properties named propSomething always take care of ","
// sometimes a property might not exist, so it doesn't add ","
const htmlContainer = async (
  node: SceneNode &
    SceneNodeMixin &
    BlendMixin &
    LayoutMixin &
    GeometryMixin &
    MinimalBlendMixin,
  children: string,
  additionalStyles: string[] = [],
  settings: HTMLSettings,
): string => {
  // ignore the view when size is zero or less
  // while technically it shouldn't get less than 0, due to rounding errors,
  // it can get to values like: -0.000004196293048153166
  if (node.width < 0 || node.height <= 0) {
    return children;
  }

  const builder = new HtmlDefaultBuilder(node, settings)
    .commonPositionStyles()
    .commonShapeStyles();

  if (builder.styles || additionalStyles) {
    let tag = "div";
    let src = "";
    if (retrieveTopFill(node.fills)?.type === "IMAGE") {
      console.log('found img 2')
      // addWarning("Image fills are replaced with placeholders");
      if (!("children" in node) || node.children.length === 0) {
        const image = figma.getImageByHash(node.fills[0].imageHash)
        const bytes = await image.getBytesAsync()
        const base64Image = convertBytesToBase64(bytes);
        const imgurUrl = await uploadToImgur(base64Image);
        tag = "img";
        src = ` src="${imgurUrl}"`;
      } else {
        builder.addStyles(
          formatWithJSX(
            "background-image",
            settings.jsx,
            `url(https://via.placeholder.com/${node.width.toFixed(
              0,
            )}x${node.height.toFixed(0)})`,
          ),
        );
      }
    }

    const build = builder.build(additionalStyles);

    if (children) {
      return `\n<${tag}${build}${src}>${indentString(children)}\n</${tag}>`;
    } else if (selfClosingTags.includes(tag) || settings.jsx) {
      return `\n<${tag}${build}${src} />`;
    } else {
      return `\n<${tag}${build}${src}></${tag}>`;
    }
  }

  return children;
};

const htmlSection = async (
  node: SectionNode,
  settings: HTMLSettings,
): Promise<string> => {
  const childrenStr = await htmlWidgetGenerator(node.children, settings);
  const builder = new HtmlDefaultBuilder(node, settings)
    .size()
    .position()
    .applyFillsToStyle(node.fills, "background");

  if (childrenStr) {
    return `\n<div${builder.build()}>${indentString(childrenStr)}\n</div>`;
  } else {
    return `\n<div${builder.build()}></div>`;
  }
};

const htmlLine = (node: LineNode, settings: HTMLSettings): string => {
  const builder = new HtmlDefaultBuilder(node, settings)
    .commonPositionStyles()
    .commonShapeStyles();

  return `\n<div${builder.build()}></div>`;
};

export const htmlCodeGenTextStyles = (settings: HTMLSettings) => {
  const result = previousExecutionCache
    .map(
      (style) =>
        `// ${style.text}\n${style.style.split(settings.jsx ? "," : ";").join(";\n")}`,
    )
    .join("\n---\n");

  if (!result) {
    return "// No text styles in this selection";
  }
  return result;
};

// Function to convert bytes to Base64
const convertBytesToBase64 = (bytes: Uint8Array): string => {
  let binaryString = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  
  // Custom Base64 encoding
  const base64String = customBase64Encode(binaryString);
  return 'data:image/png;base64,' + base64String;
};

// Custom Base64 encoding function
const customBase64Encode = (input: string): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';
  let i = 0;

  while (i < input.length) {
    const byte1 = input.charCodeAt(i++) & 0xff;
    const byte2 = input.charCodeAt(i++) & 0xff;
    const byte3 = input.charCodeAt(i++) & 0xff;

    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    const enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
    const enc4 = byte3 & 63;

    if (isNaN(byte2)) {
      output += chars.charAt(enc1) + chars.charAt(enc2) + '==';
    } else if (isNaN(byte3)) {
      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + '=';
    } else {
      output += chars.charAt(enc1) + chars.charAt(enc2) + chars.charAt(enc3) + chars.charAt(enc4);
    }
  }

  return output;
};

// Function to upload image to Imgur
const uploadToImgur = async (base64Image: string): Promise<string> => {
  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      Authorization: `af6c636a65ad090`, // Replace with your Imgur Client ID
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image.split(',')[1], // Get the Base64 string without the data URL prefix
    }),
  });

  const data = await response.json();
  if (data.success) {
    console.log('Image uploaded successfully:', data.data.link);
    return data.data.link;
  } else {
    console.error('Image upload failed:', data);
    throw new Error('Image upload failed');
  }
};