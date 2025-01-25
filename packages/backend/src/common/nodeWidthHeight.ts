import { Size } from "types";

export const nodeSize = (node: SceneNode, optimizeLayout: boolean): Size => {
  const hasLayout =
    "layoutAlign" in node && node.parent && "layoutMode" in node.parent;

  if (!hasLayout) {
    return { width: node.width, height: node.height };
  }

  const nodeAuto =
    (optimizeLayout && "inferredAutoLayout" in node
      ? node.inferredAutoLayout
      : null) ?? node;

  if ("layoutMode" in nodeAuto && nodeAuto.layoutMode === "NONE") {
    return { width: node.width, height: node.height };
  }

  // const parentLayoutMode = node.parent.layoutMode;
  const layoutMode = node.parent ? node.parent.layoutMode : 'defaultLayoutMode';

  const isWidthFill =
    (layoutMode === "HORIZONTAL" && nodeAuto.layoutGrow === 1) ||
    (layoutMode === "VERTICAL" && nodeAuto.layoutAlign === "STRETCH");
  const isHeightFill =
    (layoutMode === "HORIZONTAL" && nodeAuto.layoutAlign === "STRETCH") ||
    (layoutMode === "VERTICAL" && nodeAuto.layoutGrow === 1);
  const modesSwapped = layoutMode === "HORIZONTAL";
  const primaryAxisMode = modesSwapped
    ? "counterAxisSizingMode"
    : "primaryAxisSizingMode";
  const counterAxisMode = modesSwapped
    ? "primaryAxisSizingMode"
    : "counterAxisSizingMode";

  return {
    width: isWidthFill
      ? "fill"
      : "layoutMode" in nodeAuto && nodeAuto[primaryAxisMode] === "AUTO"
        ? null
        : node.width,
    height: isHeightFill
      ? "fill"
      : "layoutMode" in nodeAuto && nodeAuto[counterAxisMode] === "AUTO"
        ? null
        : node.height,
  };
};
