import { defineQuery } from "bitecs";
import {
  asVec2,
  Fixture,
  FixtureTypeMap,
  Mass,
  Position,
  Velocity,
} from "../components";
import { World } from "../world";
import { gravitationalVelocity } from "../math/gravity";
import { vec2 } from "gl-matrix";
import { C } from "../math/constants";

const gravityQuery = defineQuery([Position, Velocity, Mass, Fixture]);

export const gravitySystem = (world: World) => {
  const entities = gravityQuery(world);

  // loop over all entities with mass and compare to each other calculating force
  for (let i = 0; i < entities.length; i++) {
    const entityId1 = entities[i];

    // static entities don't move
    if (
      Fixture.type[entityId1] === FixtureTypeMap.static ||
      Fixture.type[entityId1] === FixtureTypeMap.inertstatic
    ) {
      continue;
    }

    let newVelocity = asVec2(Velocity, entityId1);

    for (let j = 0; j < entities.length; j++) {
      const entityId2 = entities[j];

      // inert object don't attract others
      if (
        Fixture.type[entityId2] === FixtureTypeMap.inert ||
        Fixture.type[entityId2] === FixtureTypeMap.inertstatic
      ) {
        continue;
      }

      // get velocity between the two entities according to Mass
      let velocityVector = gravitationalVelocity(
        asVec2(Position, entityId1),
        Mass.x[entityId1],
        asVec2(Position, entityId2),
        Mass.x[entityId2]
      );

      newVelocity = vec2.add(newVelocity, newVelocity, velocityVector);
    }

    // collect new velocity vectors and apply to entities
    Velocity.x[entityId1] = newVelocity[0];
    Velocity.y[entityId1] = newVelocity[1];
  }

  return world;
};
