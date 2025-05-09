import { rgbTo8hex } from "../../common/color";
import {
  generateWidgetCode,
  numberToFixedString,
} from "../../common/numToAutoFixed";
import { indentStringFlutter } from "../../common/indentString";

// TODO Document it can't do flutter shadows.
export const flutterShadow = (node: SceneNode): string => {
  let propBoxShadow = "";
  if ("effects" in node && node.effects?.length > 0) {
    const visibleEffects: Array<Effect> = node.effects.filter((d) => d.visible);

    if (visibleEffects.length > 0) {
      let boxShadow = "";

      visibleEffects.forEach((effect: Effect) => {
        if (effect.type === "DROP_SHADOW") {
          //|| effect.type === "INNER_SHADOW"
          boxShadow += generateWidgetCode("BoxShadow", {
            color: `Color(0x${rgbTo8hex(
              effect.color,
              effect.color.a,
            ).toUpperCase()})`,
            blurRadius: numberToFixedString(effect.radius),
            offset: `Offset(${numberToFixedString(effect.offset.x)}, ${numberToFixedString(
              effect.offset.y,
            )})`,
            spreadRadius: effect.spread
              ? numberToFixedString(effect.spread)
              : "0",
          });
        }
      });

      if (boxShadow) {
        propBoxShadow = `[\n${indentStringFlutter(boxShadow)}\n]`;
      }
    }
  }
  return propBoxShadow;
};
