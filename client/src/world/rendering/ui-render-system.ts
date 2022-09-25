import { colors } from "./colors";
import { defineQuery } from "bitecs";
import {
  asVec2,
  Fuel,
  Health,
  Mothership,
  Origin,
  Position,
  Visible,
  Waypoint,
} from "../components";
import { World } from "../world";
import { drawCircle } from "./primitives";
import { vec2 } from "gl-matrix";
import { TARGET_ZONE } from "../systems/propulsion-system";

const motherShipQuery = defineQuery([Mothership]);

/**
 * Make work for multiple ships
 * @param world
 */
export const uiRenderSystem = (world: World) => {
  const [entityId] = motherShipQuery(world);

  const { renderingContext } = world;
  const { context } = renderingContext;

  const fuel = Fuel.x[entityId];
  const health = Health.x[entityId];

  context.strokeStyle = colors.primary;
  context.font = "24px Anonymous Pro";

  let x = 10;
  let y = world.renderingContext.screenHeight - 30;
  const rowWidth = 210;
  const rowHeight = 20;
  const rowgap = 5;

  const render = Math.random() > 0.2;

  render &&
    context.fillText(
      `HYPER MASS -- ${(fuel + Math.random()).toFixed(1)}`,
      x + 2,
      y + 17,
      rowWidth
    );

  context.fillStyle = colors.primary;

  y -= rowHeight + rowgap;

  render && context.strokeRect(x, y, rowWidth, rowHeight);

  const fuelCapacity = Fuel.x[entityId] / Fuel.y[entityId];
  render &&
    context.fillRect(
      x + 4,
      y + 4,
      Math.max(rowWidth * fuelCapacity - 8, 0),
      rowHeight - 8
    );
  context.fillStyle = "#39FF14";
  render &&
    context.fillRect(Math.max(rowWidth * 0.8, 0), y - 4, 4, rowHeight + 8);

  context.restore();
  context.font = "10px sans-serif";

  return world;
};
