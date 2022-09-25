import { colors } from "./colors";
import { drawCircle, drawRect } from "./primitives";
import { defineQuery } from "bitecs";
import { asVec2, Position, Probe, Size, Visible } from "../components";
import { World } from "../world";
import { topLeft } from "../camera";
import { vec2 } from "gl-matrix";

const probeRenderQuery = defineQuery([Probe, Size, Visible]);

export const probeRenderSystem = (world: World) => {
  const entities = probeRenderQuery(world);
  const { renderingContext } = world;
  const { context } = renderingContext;

  context.strokeStyle = colors.primary;

  entities.forEach((entityId) => {
    const centerPoint = world.camera.toScreenPosition(
      asVec2(Position, entityId)
    );
    const size = world.camera.toScreenScale(asVec2(Size, entityId));
    const topLeftPoint = topLeft(centerPoint, size);

    const renderSize = vec2.fromValues(15, 15);
    drawRect(topLeft(centerPoint, renderSize), renderSize, context);
    drawCircle(centerPoint, renderSize, context);
    drawCircle(centerPoint, vec2.fromValues(2, 2), context);
    context.fillStyle = colors.primary;
    context.fillText(
      `${Math.round(centerPoint[0])}:${Math.round(centerPoint[1])}`,
      topLeftPoint[0] - 15,
      centerPoint[1] + 20
    );
  });

  context.restore();

  return world;
};
