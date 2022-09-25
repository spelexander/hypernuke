import { World } from "../world";
import { vec2 } from "gl-matrix";
import { addComponent, addEntity } from "bitecs";
import {
  Fixture,
  FixtureTypeMap,
  Mass,
  Mothership,
  Planet,
  Position,
  Size,
  UnitType,
  UnitTypeMap,
  Velocity,
  Visible,
} from "../components";

const createTestPlanet = (world: World, position: vec2, mass: number) => {
  const entityId = addEntity(world);
  addComponent(world, Position, entityId);
  Position.x[entityId] = position[0];
  Position.y[entityId] = position[1];
  Position.z[entityId] = 0;

  addComponent(world, Visible, entityId);
  addComponent(world, Planet, entityId);

  addComponent(world, Velocity, entityId);
  Velocity.x[entityId] =
    Math.random() > 0.5 ? -Math.random() * 0.1 : Math.random() * 0.1;
  Velocity.y[entityId] =
    Math.random() > 0.5 ? -Math.random() * 0.1 : Math.random() * 0.1;
  const velocity = Math.random();
  Velocity.z[entityId] = Math.random() > 0.5 ? -velocity : velocity;

  addComponent(world, Mass, entityId);
  Mass.x[entityId] = mass;

  addComponent(world, Fixture, entityId);
  Fixture.type[entityId] = FixtureTypeMap.static;
};

const seedCount = 25;
const clustering = 8;

const clusterDistanceMin = -3000;
const clusterDistanceMax = 3000;

const massDistribution = 0.3;

const minLowRange = 1000;
const maxLowRange = 30_000;

const minHighRange = 60_000;
const maxHighRange = 150_000;

const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const setupCluster = (world: World) => {
  const viewX = 100_000,
    viewY = 50_000;
  const minX = -(viewX / 2);
  const maxX = viewX / 2;

  const minY = -(viewY / 2);
  const maxY = viewY / 2;

  for (let i = 0; i < seedCount; i++) {
    const localGroupX = randomInRange(minX, maxX);
    const localGroupY = randomInRange(minY, maxY);

    for (let j = 0; j <= clustering; j++) {
      const positionX =
        localGroupX + randomInRange(clusterDistanceMin, clusterDistanceMax);
      const positionY =
        localGroupY + randomInRange(clusterDistanceMin, clusterDistanceMax);
      let mass = 0;

      // high range planet or low range
      if (Math.random() > massDistribution) {
        mass = randomInRange(minHighRange, maxHighRange);
      } else {
        mass = randomInRange(minLowRange, maxLowRange);
      }

      createTestPlanet(world, vec2.fromValues(positionX, positionY), mass);
    }
  }
};
