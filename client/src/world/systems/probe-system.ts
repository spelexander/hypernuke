import {
  addComponent,
  defineQuery,
  removeComponent,
  removeEntity,
} from "bitecs";
import {
  asVec2,
  ConnectedEntity,
  ConnectedEntityType,
  Fuel,
  Mass,
  Planet,
  Position,
  Probe,
} from "../components";
import { World } from "../world";
import { vec2 } from "gl-matrix";
import { pointIntersects } from "../math/coordinates";

const probeQuery = defineQuery([Probe, Position]);
const planetQuery = defineQuery([Planet, Position, Mass]);

const EXTRACTION_AMOUNT = 100;
const EXTRACTION_DISTANCE = 1000;

export const probeSystem = (world: World) => {
  const {
    time: { delta },
    tick,
  } = world;

  // do a few times a second
  if (tick % 20 !== 0) {
    return world;
  }

  const probes = probeQuery(world);

  for (let i = 0; i < probes.length; i++) {
    const probeEntityId = probes[i];
    const probePosition = asVec2(Position, probeEntityId);

    // capacity is full
    if (Fuel.x[probeEntityId] >= Fuel.y[probeEntityId]) {
      removeComponent(world, ConnectedEntity, probeEntityId);
      continue;
    }

    const topLeft = vec2.subtract(
      vec2.create(),
      probePosition,
      vec2.fromValues(EXTRACTION_DISTANCE, EXTRACTION_DISTANCE)
    );
    const bottomRight = vec2.add(
      vec2.create(),
      probePosition,
      vec2.fromValues(EXTRACTION_DISTANCE, EXTRACTION_DISTANCE)
    );

    let proximityModifier = 0;

    // other nearby probes
    for (let p = 0; p < probes.length; p++) {
      const otherProbeEntityId = probes[p];
      const otherProbePosition = asVec2(Position, otherProbeEntityId);

      // nearby probe add the modifier
      if (pointIntersects(topLeft, bottomRight, otherProbePosition)) {
        proximityModifier++;
      }
    }

    const planets = planetQuery(world);
    for (let j = 0; j < planets.length; j++) {
      const planetEntityId = planets[j];

      const position = asVec2(Position, planetEntityId);

      if (pointIntersects(topLeft, bottomRight, position)) {
        // close enough to extract! Only one planet at a time
        addComponent(world, ConnectedEntity, probeEntityId);
        ConnectedEntity.x[probeEntityId] = planetEntityId;
        ConnectedEntity.y[probeEntityId] = ConnectedEntityType.extraction;

        const massExtracted =
          delta * EXTRACTION_AMOUNT + proximityModifier * EXTRACTION_AMOUNT;

        const planetaryMass = Mass.x[planetEntityId];

        if (planetaryMass < 1000) {
          // planet is dead!
          removeEntity(world, planetEntityId);
        } else {
          Mass.x[planetEntityId] -= massExtracted;
          Fuel.x[probeEntityId] += massExtracted;
        }

        return world;
      }
    }

    // no connections
    removeComponent(world, ConnectedEntity, probeEntityId);
  }
  return world;
};
