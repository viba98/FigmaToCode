const { htmlMain } = require('./html/htmlMain'); // Adjusted import path

const mockNode = {
  "name": "Frame 1430102510",
  "type": "FRAME",
  "scrollBehavior": "SCROLLS",
  "children": [
    {
      "name": "Frame 1430102511",
      "type": "FRAME",
      "scrollBehavior": "SCROLLS",
      "children": [
        {
          "name": "red",
          "type": "RECTANGLE",
          "scrollBehavior": "SCROLLS",
          "blendMode": "PASS_THROUGH",
          "fills": [
            {
              "blendMode": "NORMAL",
              "type": "SOLID",
              "color": {
                "r": 1,
                "g": 0,
                "b": 0,
                "a": 1
              }
            }
          ],
          "strokes": [],
          "strokeWeight": 1,
          "strokeAlign": "INSIDE",
          "absoluteBoundingBox": {
            "x": -3500,
            "y": 1300,
            "width": 58,
            "height": 67
          },
          "absoluteRenderBounds": {
            "x": -3500,
            "y": 1300,
            "width": 58,
            "height": 67
          },
          "constraints": {
            "vertical": "TOP",
            "horizontal": "LEFT"
          },
          "layoutAlign": "INHERIT",
          "layoutGrow": 0,
          "layoutSizingHorizontal": "FIXED",
          "layoutSizingVertical": "FIXED",
          "effects": [],
          "interactions": []
        },
        {
          "name": "blue",
          "type": "RECTANGLE",
          "scrollBehavior": "SCROLLS",
          "blendMode": "PASS_THROUGH",
          "fills": [
            {
              "blendMode": "NORMAL",
              "type": "SOLID",
              "color": {
                "r": 0,
                "g": 0.18,
                "b": 1,
                "a": 1
              }
            }
          ],
          "strokes": [],
          "strokeWeight": 1,
          "strokeAlign": "INSIDE",
          "absoluteBoundingBox": {
            "x": -3400,
            "y": 1300,
            "width": 58,
            "height": 67
          },
          "absoluteRenderBounds": {
            "x": -3400,
            "y": 1300,
            "width": 58,
            "height": 67
          },
          "constraints": {
            "vertical": "TOP",
            "horizontal": "LEFT"
          },
          "layoutAlign": "INHERIT",
          "layoutGrow": 0,
          "layoutSizingHorizontal": "FIXED",
          "layoutSizingVertical": "FIXED",
          "effects": [],
          "interactions": []
        }
      ],
      "blendMode": "PASS_THROUGH",
      "clipsContent": false,
      "background": [],
      "fills": [],
      "strokes": [],
      "strokeWeight": 1,
      "strokeAlign": "INSIDE",
      "backgroundColor": {
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 0
      },
      "layoutMode": "HORIZONTAL",
      "counterAxisAlignItems": "CENTER",
      "layoutWrap": "NO_WRAP",
      "absoluteBoundingBox": {
        "x": -3500,
        "y": 1300,
        "width": 120,
        "height": 67
      },
      "absoluteRenderBounds": {
        "x": -3500,
        "y": 1300,
        "width": 120,
        "height": 67
      },
      "constraints": {
        "vertical": "TOP",
        "horizontal": "LEFT"
      },
      "layoutSizingHorizontal": "HUG",
      "layoutSizingVertical": "HUG",
      "effects": [],
      "interactions": []
    }
  ],
  "blendMode": "PASS_THROUGH",
  "clipsContent": true,
  "background": [
    {
      "blendMode": "NORMAL",
      "type": "SOLID",
      "color": {
        "r": 1,
        "g": 1,
        "b": 1,
        "a": 1
      }
    }
  ],
  "fills": [
    {
      "blendMode": "NORMAL",
      "type": "SOLID",
      "color": {
        "r": 1,
        "g": 1,
        "b": 1,
        "a": 1
      }
    }
  ],
  "strokes": [],
  "strokeWeight": 1,
  "strokeAlign": "INSIDE",
  "backgroundColor": {
    "r": 1,
    "g": 1,
    "b": 1,
    "a": 1
  },
  "absoluteBoundingBox": {
    "x": -3500,
    "y": 1200,
    "width": 140,
    "height": 170
  },
  "absoluteRenderBounds": {
    "x": -3500,
    "y": 1200,
    "width": 140,
    "height": 170
  },
  "constraints": {
    "vertical": "TOP",
    "horizontal": "LEFT"
  },
  "effects": [],
  "interactions": []
};

global.figma = {
  currentPage: {
    selection: [
      mockNode
    ]
  }
}

const settings = {
  framework: "HTML",
  jsx: false,
  optimizeLayout: false,
  showLayerNames: false,
  inlineStyle: true,
  responsiveRoot: false,
  flutterGenerationMode: "snippet",
  swiftUIGenerationMode: "snippet",
  roundTailwindValues: false,
  roundTailwindColors: false,
  customTailwindColors: false,
};

(async () => {
  try {
    const result = await htmlMain([mockNode], settings);
    console.log("Generated HTML:", result);
  } catch (error) {
    console.error("Error generating HTML:", error);
  }
})();
