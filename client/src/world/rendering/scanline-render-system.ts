import { World } from "../world";
import { colors } from "./colors";
import { RenderContext } from "../world";

export const drawScanLines = ({
  screenHeight,
  screenWidth,
  context,
}: RenderContext) => {
  let i = (screenHeight / 4) >> 0;

  context.globalAlpha = 0.05;
  context.lineWidth = 1;

  // reverse for perf
  for (i; i > -1; --i) {
    context.beginPath();
    context.moveTo(0, i * 4);
    context.lineTo(screenWidth, i * 4);
    context.strokeStyle = Math.random() > 0.0001 ? colors.subtle : colors.white;
    context.stroke();
    context.closePath();
  }

  context.globalAlpha = 1;
};

export const scanlineRenderSystem = (world: World) => {
  const { renderingContext } = world;

  drawScanLines(renderingContext);

  return world;
};
