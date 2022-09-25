import { colors } from "./colors";
import { defineQuery } from "bitecs";
import { asVec2, Origin, Position, Visible, Waypoint } from "../components";
import { World } from "../world";
import { drawCircle } from "./primitives";
import { vec2 } from "gl-matrix";
import { TARGET_ZONE } from "../systems/propulsion-system";

const waypointQuery = defineQuery([Position, Origin, Waypoint, Visible]);

export const waypointRenderSystem = (world: World) => {
  const entities = waypointQuery(world);
  const { renderingContext } = world;
  const { context } = renderingContext;

  context.strokeStyle = colors.primary;

  entities.forEach((entityId) => {
    const [entityX, entityY] = world.camera.toScreenPosition(
      asVec2(Position, entityId)
    );
    const [destX, destY] = world.camera.toScreenPosition(
      asVec2(Waypoint, entityId)
    );
    const [originX, originY] = world.camera.toScreenPosition(
      asVec2(Origin, entityId)
    );

    context.strokeStyle = colors.primary;

    const circleSize = vec2.fromValues(4, 5);
    drawCircle(vec2.fromValues(destX, destY), circleSize, context);
    drawCircle(vec2.fromValues(originX, originY), circleSize, context);
    context.setLineDash([3, 3]);
    drawCircle(
      vec2.fromValues(destX, destY),
      vec2.add(
        vec2.create(),
        world.camera.toScreenScale(vec2.fromValues(TARGET_ZONE, TARGET_ZONE)),
        vec2.fromValues(50, 50)
      ),
      context
    );

    context.setLineDash([]);
    context.beginPath();
    context.moveTo(originX, originY);
    context.lineTo(entityX, entityY);
    if (Math.random() > 0.1) context.stroke();
    context.beginPath();
    context.setLineDash([4, 5]);
    context.moveTo(entityX, entityY);
    context.lineTo(destX, destY);
    if (Math.random() > 0.1) context.stroke();
    context.closePath();
  });

  context.setLineDash([]);
  context.restore();

  return world;
};
