import {
  addComponent,
  ComponentType,
  defineComponent,
  ISchema,
  Types,
} from "bitecs";
import { vec2 } from "gl-matrix";
import { World } from "./world";

const IntVector = { x: Types.i32, y: Types.i32 };
const IntVector2 = { x: Types.i32, y: Types.i32 }; // entity id, connection type

const Vector = { x: Types.f32 };
const Vector2 = { x: Types.f32, y: Types.f32 };
const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };

const Tag = {};
const Enum = {
  type: Types.ui8,
};

export const Visible = defineComponent(Tag);
export const Probe = defineComponent(Tag);
export const Mothership = defineComponent(Tag);
export const Planet = defineComponent(Tag);

export const Waypoint = defineComponent(Vector2);
export const Origin = defineComponent(Vector2);

export const Health = defineComponent(IntVector);
export const Fuel = defineComponent(IntVector);

// connections hack
export const ConnectedEntity = defineComponent(IntVector2);
export const ConnectedEntity2 = defineComponent(IntVector2);
export const ConnectedEntity3 = defineComponent(IntVector2);
export const ConnectedEntity4 = defineComponent(IntVector2);
export const ConnectedEntity5 = defineComponent(IntVector2);

export type ConnectedComponent =
  | typeof ConnectedEntity
  | typeof ConnectedEntity2
  | typeof ConnectedEntity3
  | typeof ConnectedEntity4
  | typeof ConnectedEntity5;

export const CONNECTION_COMPONENT_ARRAY = [
  ConnectedEntity,
  ConnectedEntity2,
  ConnectedEntity3,
  ConnectedEntity4,
  ConnectedEntity5,
];
export const addReclaimConnection = (
  world: World,
  connection: number,
  entity1: number,
  entity2: number
) => {
  if (connection >= CONNECTION_COMPONENT_ARRAY.length) {
    return false;
  }
  const component = CONNECTION_COMPONENT_ARRAY[connection];

  addComponent(world, component, entity1);
  component.x[entity1] = entity2;
  component.y[entity1] = ConnectedEntityType.reclaim;

  return true;
};

export enum ConnectedEntityType {
  extraction = 0,
  reclaim = 1,
}

export const Acceleration = defineComponent(Vector); // Force
export const Position = defineComponent(Vector3);
export const Velocity = defineComponent(Vector3);
export const Size = defineComponent(Vector2);
export const asVec2 = (
  component: typeof Position | typeof Velocity | typeof Size,
  entityId: number
) => vec2.fromValues(component.x[entityId], component.y[entityId]);

export const Mass = defineComponent(Vector);
export const Fixture = defineComponent(Enum);
export enum FixtureTypeMap {
  dynamic = 0,
  static = 1,
  inert = 2,
  inertstatic = 3,
}
