import { colors } from "./colors";
import { defineQuery } from "bitecs";
import {
  asVec2,
  ConnectedEntity2,
  ConnectedEntity3,
  ConnectedEntity4,
  ConnectedEntity5,
  ConnectedEntityType,
  ConnectedComponent,
  Position,
  Visible,
  CONNECTION_COMPONENT_ARRAY,
  ConnectedEntity,
} from "../components";
import { World } from "../world";

const connectionRenderQuery = defineQuery([Position, ConnectedEntity, Visible]);
const connectionRenderQuery2 = defineQuery([
  Position,
  ConnectedEntity2,
  Visible,
]);
const connectionRenderQuery3 = defineQuery([
  Position,
  ConnectedEntity3,
  Visible,
]);
const connectionRenderQuery4 = defineQuery([
  Position,
  ConnectedEntity4,
  Visible,
]);
const connectionRenderQuery5 = defineQuery([
  Position,
  ConnectedEntity5,
  Visible,
]);

const renderConnection = (
  world: World,
  component: ConnectedComponent,
  entityId: number
) => {
  const { context } = world.renderingContext;

  const [entityX, entityY] = world.camera.toScreenPosition(
    asVec2(Position, entityId)
  );
  const [destX, destY] = world.camera.toScreenPosition(
    asVec2(Position, component.x[entityId])
  );

  const type: ConnectedEntityType = component.y[entityId];
  switch (type) {
    case ConnectedEntityType.extraction:
      context.lineWidth = Math.random() * 3;
      break;
    case ConnectedEntityType.reclaim:
      context.setLineDash([2, 3]);
      context.lineWidth = 1;
      break;
  }

  context.strokeStyle = colors.primary;
  context.beginPath();
  context.moveTo(entityX, entityY);
  context.lineTo(destX, destY);
  if (Math.random() > 0.3) context.stroke();
  context.closePath();
  context.lineWidth = 1;
  context.setLineDash([]);
};

export const connectionRenderSystem = (world: World) => {
  const { renderingContext } = world;
  const { context } = renderingContext;

  // setup
  context.strokeStyle = colors.primary;
  context.setLineDash([]);

  connectionRenderQuery(world).forEach((entityId) => {
    renderConnection(world, CONNECTION_COMPONENT_ARRAY[0], entityId);
  });
  connectionRenderQuery2(world).forEach((entityId) => {
    renderConnection(world, CONNECTION_COMPONENT_ARRAY[1], entityId);
  });
  connectionRenderQuery3(world).forEach((entityId) => {
    renderConnection(world, CONNECTION_COMPONENT_ARRAY[2], entityId);
  });
  connectionRenderQuery4(world).forEach((entityId) => {
    renderConnection(world, CONNECTION_COMPONENT_ARRAY[3], entityId);
  });
  connectionRenderQuery5(world).forEach((entityId) => {
    renderConnection(world, CONNECTION_COMPONENT_ARRAY[4], entityId);
  });

  context.restore();

  return world;
};
