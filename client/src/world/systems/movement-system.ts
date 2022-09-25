import { defineQuery } from "bitecs";
import { Position, Velocity } from "../components";
import { World } from "../world";

const movementQuery = defineQuery([Position, Velocity]);

export const movementSystem = (world: World) => {
  const {
    time: { delta },
  } = world;

  const entities = movementQuery(world);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    Position.x[eid] += Velocity.x[eid] * delta;
    Position.y[eid] += Velocity.y[eid] * delta;
    Position.z[eid] += (Velocity.z[eid] * delta) / 1000;
  }
  return world;
};
