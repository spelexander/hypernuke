import { World } from "../world";
import { vec2 } from "gl-matrix";
import { addComponent, addEntity, hasComponent, removeComponent } from "bitecs";
import {
  Acceleration,
  asVec2,
  ConnectedEntity,
  Fixture,
  FixtureTypeMap,
  Fuel,
  Health,
  Mass,
  Mothership,
  Origin,
  Position,
  Probe,
  Size,
  Velocity,
  Visible,
  Waypoint,
} from "../components";

const PROBE_CREATION_COST = 70_000;

const createProbe = (world: World, position: vec2) => {
  const entityId = addEntity(world);

  addComponent(world, Position, entityId);
  Position.x[entityId] = position[0];
  Position.y[entityId] = position[1];
  Position.z[entityId] = 0;

  addComponent(world, Velocity, entityId);
  Velocity.x[entityId] = 0;
  Velocity.y[entityId] = 0;
  Velocity.z[entityId] = 0;

  addComponent(world, Size, entityId);
  Size.x[entityId] = 1;
  Size.y[entityId] = 1;

  addComponent(world, Visible, entityId);
  addComponent(world, Probe, entityId);

  addComponent(world, Mass, entityId);
  Mass.x[entityId] = 10;

  addComponent(world, Fixture, entityId);
  Fixture.type[entityId] = FixtureTypeMap.dynamic;

  addComponent(world, Health, entityId);
  Health.x[entityId] = 20;

  addComponent(world, Fuel, entityId);
  Fuel.x[entityId] = 0;
  Fuel.y[entityId] = 5000;

  return entityId;
};

const createMotherShip = (world: World, position: vec2) => {
  const entityId = addEntity(world);

  addComponent(world, Position, entityId);
  Position.x[entityId] = position[0];
  Position.y[entityId] = position[1];
  Position.z[entityId] = 0;

  addComponent(world, Velocity, entityId);
  Velocity.x[entityId] = 0;
  Velocity.y[entityId] = 0;
  Velocity.z[entityId] = 0;

  addComponent(world, Size, entityId);
  Size.x[entityId] = 1;
  Size.y[entityId] = 1;

  addComponent(world, Visible, entityId);

  addComponent(world, Mothership, entityId);

  addComponent(world, Acceleration, entityId);
  Acceleration.x[entityId] = 0.01;

  addComponent(world, Mass, entityId);
  Mass.x[entityId] = 100;

  addComponent(world, Fixture, entityId);
  Fixture.type[entityId] = FixtureTypeMap.inertstatic;

  addComponent(world, Health, entityId);
  Health.x[entityId] = 100;

  addComponent(world, Fuel, entityId);
  Fuel.x[entityId] = 100_000;
  Fuel.y[entityId] = 1_000_000;

  return entityId;
};

export const setupShip = (world: World) => {
  const motherShipEntityId = createMotherShip(world, vec2.fromValues(0, 0));

  world.input.onKeyPress((button) => {
    // space button
    if (button === " ") {
      world.command.send("launchProbe");
    }
  });

  world.input.onClick((button, position) => {
    if (button === 0) {
      world.command.send("navigateTo", {
        position,
      });
    }
  });

  world.command.onCommand<{ position: vec2 }>("launchProbe", () => {
    const fuel = Fuel.x[motherShipEntityId];

    if (PROBE_CREATION_COST > fuel) {
      // can't afford creation cost
      return;
    }

    const position = asVec2(Position, motherShipEntityId);
    Fuel.x[motherShipEntityId] = Math.max(fuel - PROBE_CREATION_COST, 0);
    createProbe(world, position);
  });

  world.command.onCommand<{ position: vec2 }>("navigateTo", ({ position }) => {
    if (hasComponent(world, Waypoint, motherShipEntityId)) {
      removeComponent(world, Waypoint, motherShipEntityId);
      removeComponent(world, Origin, motherShipEntityId);
      Velocity.x[motherShipEntityId] = 0;
      Velocity.y[motherShipEntityId] = 0;
      return;
    }

    addComponent(world, Waypoint, motherShipEntityId);
    Waypoint.x[motherShipEntityId] = position[0];
    Waypoint.y[motherShipEntityId] = position[1];

    addComponent(world, Origin, motherShipEntityId);
    Origin.x[motherShipEntityId] = Position.x[motherShipEntityId];
    Origin.y[motherShipEntityId] = Position.y[motherShipEntityId];
  });
};
