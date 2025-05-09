import { numberToFixedString } from "../../common/numToAutoFixed";
import { SwiftUIModifier } from "types";

export const swiftuiShadow = (node: SceneNode): SwiftUIModifier | null => {
  if (!("effects" in node) || node.effects.length === 0) {
    return null;
  }

  const dropShadow: Array<DropShadowEffect> = node.effects.filter(
    (d): d is DropShadowEffect => d.type === "DROP_SHADOW" && d.visible,
  );

  if (dropShadow.length === 0) {
    return null;
  }

  // retrieve first shadow.
  const shadow = dropShadow[0];
  let comp: string[] = [];

  const color = shadow.color;
  // set color when not black with 0.25 of opacity, which is the Figma default. Round the alpha now to avoid rounding issues.
  const a = numberToFixedString(color.a);
  const r = numberToFixedString(color.r);
  const g = numberToFixedString(color.g);
  const b = numberToFixedString(color.b);
  comp.push(`color: Color(red: ${r}, orange: ${g}, blue: ${b}, opacity: ${a})`);
  comp.push(`radius: ${numberToFixedString(shadow.radius)}`);

  const x =
    shadow.offset.x > 0 ? `x: ${numberToFixedString(shadow.offset.x)}` : "";
  const y =
    shadow.offset.y > 0 ? `y: ${numberToFixedString(shadow.offset.y)}` : "";

  // add initial comma since this is an optional paramater and radius must come first.
  if (x && y) {
    comp.push(x, y);
  } else {
    if (x) {
      comp.push(x);
    } else if (y) {
      comp.push(y);
    }
  }

  return ["shadow", comp.join(", ")];
};

export const swiftuiBlur = (node: SceneNode): SwiftUIModifier | null => {
  if (!("effects" in node) || node.effects.length === 0) {
    return null;
  }

  const layerBlur: Array<BlurEffect> = node.effects.filter(
    (d): d is BlurEffect => d.type === "LAYER_BLUR" && d.visible,
  );

  if (layerBlur.length === 0) {
    return null;
  }

  // retrieve first blur.
  const blur = layerBlur[0].radius;
  return ["blur", `radius: ${numberToFixedString(blur)})`];
};
