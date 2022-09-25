import { vec2 } from "gl-matrix";
import { C, G } from "./constants";

export const gravitationalVelocity = (
  position1: vec2,
  mass1: number,
  position2: vec2,
  mass2: number
) => {
  const mass = mass2 + mass1;
  const [diffX, diffY] = vec2.subtract(vec2.create(), position1, position2);
  const force = calculateForce(diffX, diffY, mass, G);
  return calculateVelocity(position1, mass1, position2, force);
};

export const calculateVelocity = (
  position1: vec2,
  mass1: number,
  position2: vec2,
  force: number
) => {
  const [diffX, diffY] = vec2.subtract(vec2.create(), position1, position2);

  // bailout if at same point
  if (force === 0) {
    return vec2.fromValues(0, 0);
  }

  // cosmic speed limit
  const velocity = Math.min(C, force / mass1);

  // distance between the points
  const angle = Math.atan2(diffY, diffX);
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity;

  return vec2.fromValues(-vx, -vy);
};

/**
 * Calculates force on position 1 according to mass and distance to position 2
 *
 * G * Mass / Distance^2
 */
export const calculateForce = (
  distanceX: number,
  distanceY: number,
  mass: number,
  coefficient: number
) => {
  const scalar = coefficient * mass;
  const distance = Math.hypot(distanceX, distanceY);

  if (distance === 0) {
    return 0;
  }

  return scalar / (distance * distance);
};
