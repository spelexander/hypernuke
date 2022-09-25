import { World } from "../world";
import { defineQuery, removeComponent } from "bitecs";
import {
  Acceleration,
  asVec2,
  Position,
  Waypoint,
  Velocity,
  Origin,
  Mass,
  Fuel,
} from "../components";
import { vec2 } from "gl-matrix";

export const TARGET_ZONE = 50;

const propulsionQuery = defineQuery([
  Waypoint,
  Origin,
  Acceleration,
  Position,
  Velocity,
  Mass,
  Fuel,
]);

export const propulsionSystem = (world: World) => {
  const entities = propulsionQuery(world);

  for (let i = 0; i < entities.length; i++) {
    const {
      time: { delta },
    } = world;

    const entityId = entities[i];

    const currentPosition = asVec2(Position, entityId);
    const originPosition = asVec2(Origin, entityId);
    const destinationPosition = asVec2(Waypoint, entityId);
    const force = Acceleration.x[entityId];
    const mass = Mass.x[entityId];

    const distanceVec = vec2.subtract(
      vec2.create(),
      destinationPosition,
      originPosition
    );
    const progress = vec2.subtract(
      vec2.create(),
      destinationPosition,
      currentPosition
    );

    const distance = Math.hypot(progress[0], progress[1]);
    const length = Math.hypot(distanceVec[0], distanceVec[1]);
    const remaining = distance / length;

    if (Math.abs(distance) < TARGET_ZONE) {
      // arrival
      Velocity.x[entityId] = 0;
      Velocity.y[entityId] = 0;
      removeComponent(world, Origin, entityId);
      removeComponent(world, Waypoint, entityId);
      continue;
    }

    const acceleration = (force / mass) * delta;
    const a = remaining < 0.5 ? -acceleration : acceleration;

    // subtract energy from stores
    const cost = mass * force * delta;
    const fuel = Fuel.x[entityId];
    if (cost > fuel) {
      continue;
    }

    Fuel.x[entityId] = Math.max(fuel - cost, 0);

    const angle = Math.atan2(distanceVec[1], distanceVec[0]);
    Velocity.x[entityId] += Math.cos(angle) * a;
    Velocity.y[entityId] += Math.sin(angle) * a;
  }

  return world;
};
