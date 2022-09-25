import { vec2 } from "gl-matrix";
import { World } from "../world";
import { Camera } from "../camera";

type OnMouseListener = (button: number, worldCoords: vec2) => void;
type OnMouseMoveListener = (worldCoords: vec2) => void;
type OnKeyPressListener = (key?: string) => void;
type OnWheelListener = (delta: number) => void;
type OnDragListener = (button: number, delta: vec2) => void;

export type Event =
  | {
      type: "keypress";
      key?: string;
    }
  | {
      type: "mousemove";
      position: vec2;
    }
  | {
      type: "click";
      button: number;
      position: vec2;
    }
  | {
      type: "wheel";
      delta: number;
    }
  | {
      type: "drag";
      delta: vec2;
      button: number;
    };

export class InputStateMachine {
  private mousePosition: vec2 = vec2.fromValues(0, 0);
  private events: Event[] = [];

  private clickListeners: OnMouseListener[] = [];
  private moveListeners: OnMouseMoveListener[] = [];
  private keyListeners: OnKeyPressListener[] = [];
  private wheelListeners: OnWheelListener[] = [];
  private dragListeners: OnDragListener[] = [];

  public pointerDown: vec2 | null = null;
  private mouseButton: number | null = null;

  public readonly dragState: Map<string, any> = new Map();

  constructor(rootElement: Window, private readonly camera: Camera) {
    rootElement.addEventListener("keydown", (e) => {
      this.events.push({
        type: "keypress",
        key: e.key,
      });
    });

    rootElement.addEventListener("click", (e) => {
      this.events.push({
        type: "click",
        button: e.button,
        position: vec2.fromValues(e.x, e.y),
      });
    });

    rootElement.addEventListener("wheel", (e) => {
      this.events.push({
        type: "wheel",
        delta: e.deltaY / 1000,
      });
    });

    rootElement.addEventListener("pointerdown", (e) => {
      this.pointerDown = vec2.fromValues(e.x, e.y);
      this.mouseButton = e.button;
    });

    rootElement.addEventListener("pointerup", (e) => {
      this.pointerDown = null;
      this.dragState.clear();
    });

    rootElement.addEventListener("mousemove", (e) => {
      if (this.pointerDown && this.mouseButton !== null) {
        const point = vec2.fromValues(e.x, e.y);
        const diff = vec2.subtract(point, point, this.pointerDown);

        this.events.push({
          type: "drag",
          delta: diff,
          button: this.mouseButton,
        });
      }
    });
  }

  public flush = () => {
    for (const event of this.events) {
      switch (event.type) {
        case "click":
          this.mousePosition = this.camera.toWorldPosition(event.position);
          this.clickListeners.forEach((callback) =>
            callback(event.button, this.mousePosition)
          );
          break;

        case "keypress":
          const key = event.key;
          this.keyListeners.forEach((callback) => callback(key));
          break;

        case "mousemove":
          this.mousePosition = this.camera.toWorldPosition(event.position);
          this.moveListeners.forEach((callback) =>
            callback(this.mousePosition)
          );
          break;

        case "wheel":
          this.wheelListeners.forEach((callback) => callback(event.delta));
          break;

        case "drag":
          this.dragListeners.forEach((callback) =>
            callback(event.button, this.camera.toWorldScale(event.delta))
          );
          break;
      }
    }

    this.events = [];
  };

  public onClick = (callback: OnMouseListener) => {
    this.clickListeners.push(callback);
  };

  public onMove = (callback: OnMouseMoveListener) => {
    this.moveListeners.push(callback);
  };

  public onKeyPress = (callback: OnKeyPressListener) => {
    this.keyListeners.push(callback);
  };

  public onWheel = (callback: OnWheelListener) => {
    this.wheelListeners.push(callback);
  };

  public onDrag = (callback: OnDragListener) => {
    this.dragListeners.push(callback);
  };
}

export const inputSystem = (world: World) => {
  world.input.flush();
  return world;
};
