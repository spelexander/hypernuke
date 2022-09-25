import { colors } from "./colors";
import { drawPolygonCircle } from "./primitives";
import { defineQuery } from "bitecs";
import { asVec2, Mass, Planet, Position, Visible } from "../components";
import { World } from "../world";
import { vec2 } from "gl-matrix";

const planetRenderQuery = defineQuery([Planet, Visible]);

export const planetRenderSystem = (world: World) => {
  const entities = planetRenderQuery(world);
  const { renderingContext } = world;
  const { context } = renderingContext;

  context.strokeStyle = colors.primary;

  entities.forEach((entityId) => {
    const centerPoint = world.camera.toScreenPosition(
      asVec2(Position, entityId)
    );
    const mass = Mass.x[entityId];
    const size = world.camera.toScreenScale(
      vec2.fromValues(mass / 100, mass / 100)
    );

    const rotation = Position.z[entityId];
    drawPolygonCircle(centerPoint, size, rotation, context);
  });

  context.restore();

  return world;
};
