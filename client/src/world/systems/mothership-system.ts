import { defineQuery, removeComponent } from "bitecs";
import {
  addReclaimConnection,
  asVec2,
  ConnectedEntity,
  ConnectedEntity2,
  ConnectedEntity3,
  ConnectedEntity4,
  ConnectedEntity5,
  Fuel,
  Mothership,
  Position,
  Probe,
} from "../components";
import { World } from "../world";
import { vec2 } from "gl-matrix";
import { pointIntersects } from "../math/coordinates";

const probeQuery = defineQuery([Probe, Position]);
const motherShipQuery = defineQuery([Mothership, Position]);

const REPORT_DISTANCE = 5000;

const removeConnections = (world: World, entityId: number) => {
  removeComponent(world, ConnectedEntity, entityId);
  removeComponent(world, ConnectedEntity2, entityId);
  removeComponent(world, ConnectedEntity3, entityId);
  removeComponent(world, ConnectedEntity4, entityId);
  removeComponent(world, ConnectedEntity5, entityId);
};

export const motherShipSystem = (world: World) => {
  const {
    time: { delta },
    tick,
  } = world;

  // do twice a second
  if (tick % 30 !== 0) {
    return world;
  }

  const motherShips = motherShipQuery(world);
  const probes = probeQuery(world);

  for (let i = 0; i < motherShips.length; i++) {
    const motherShipEntityId = motherShips[i];
    const probePosition = asVec2(Position, motherShipEntityId);

    // fuel capacity full
    if (Fuel.x[motherShipEntityId] >= Fuel.y[motherShipEntityId]) {
      removeConnections(world, motherShipEntityId);
      continue;
    }

    const topLeft = vec2.subtract(
      vec2.create(),
      probePosition,
      vec2.fromValues(REPORT_DISTANCE, REPORT_DISTANCE)
    );
    const bottomRight = vec2.add(
      vec2.create(),
      probePosition,
      vec2.fromValues(REPORT_DISTANCE, REPORT_DISTANCE)
    );

    let connectionFound = 0;

    // other nearby probes
    for (let p = 0; p < probes.length; p++) {
      const probeEntityId = probes[p];
      const probePosition = asVec2(Position, probeEntityId);

      // reclaim Fuel from probe
      if (pointIntersects(topLeft, bottomRight, probePosition)) {
        const success = addReclaimConnection(
          world,
          connectionFound,
          motherShipEntityId,
          probeEntityId
        );

        if (!success) {
          // too many connections on this ship already
          break;
        }

        Fuel.x[motherShipEntityId] += Fuel.x[probeEntityId];
        Fuel.x[probeEntityId] = 0;

        connectionFound++;
      }
    }

    // no connections
    if (!connectionFound) {
      removeComponent(world, ConnectedEntity, motherShipEntityId);
      removeComponent(world, ConnectedEntity2, motherShipEntityId);
      removeComponent(world, ConnectedEntity3, motherShipEntityId);
      removeComponent(world, ConnectedEntity4, motherShipEntityId);
      removeComponent(world, ConnectedEntity5, motherShipEntityId);
    }
  }
  return world;
};
