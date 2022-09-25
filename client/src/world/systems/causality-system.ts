import { defineQuery } from "bitecs";
import { Probe, Velocity } from "../components";
import { World } from "../world";
import { C } from "../math/constants";

const causalityQuery = defineQuery([Probe, Velocity]);

const limitVelocity = (velocity: number) => {
  const absoluteVelocity = Math.abs(velocity);
  const newSpeed = Math.min(absoluteVelocity, C);

  return velocity > 0 ? newSpeed : -newSpeed;
};

export const causalitySystem = (world: World) => {
  const entities = causalityQuery(world);

  for (let i = 0; i < entities.length; i++) {
    const eid = entities[i];
    Velocity.x[eid] = limitVelocity(Velocity.x[eid]);
    Velocity.y[eid] = limitVelocity(Velocity.y[eid]);
    Velocity.z[eid] = limitVelocity(Velocity.z[eid]);
  }
  return world;
};
