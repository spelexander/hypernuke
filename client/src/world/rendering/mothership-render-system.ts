import { colors } from "./colors";
import { drawCircle, drawRect } from "./primitives";
import { defineQuery } from "bitecs";
import {
  asVec2,
  Mothership,
  Position,
  Size,
  Velocity,
  Visible,
} from "../components";
import { World } from "../world";
import { topLeft } from "../camera";
import { vec2 } from "gl-matrix";

const mothershipRenderQuery = defineQuery([Mothership, Size, Visible]);

export const mothershipRenderSystem = (world: World) => {
  const entities = mothershipRenderQuery(world);
  const { renderingContext } = world;
  const { context } = renderingContext;

  context.strokeStyle = colors.primary;

  entities.forEach((entityId) => {
    const centerPoint = world.camera.toScreenPosition(
      asVec2(Position, entityId)
    );
    const size = world.camera.toScreenScale(asVec2(Size, entityId));
    const topLeftPoint = topLeft(centerPoint, size);

    const renderSize = vec2.fromValues(20, 20);
    drawCircle(centerPoint, vec2.fromValues(2, 2), context);
    drawRect(topLeft(centerPoint, renderSize), renderSize, context);
    drawRect(
      topLeft(centerPoint, vec2.scale(renderSize, renderSize, 0.5)),
      vec2.fromValues(20, 20),
      context
    );
    const velocity = Math.hypot(Velocity.x[entityId], Velocity.y[entityId]);
    // context.font = "10px Anonymous Pro";
    context.fillStyle = colors.primary;
    context.fillText(
      `${velocity ? "V->" : "V"}:${velocity.toFixed(2)}C`,
      topLeftPoint[0] - 15,
      centerPoint[1] + 25
    );
  });

  context.restore();

  return world;
};
