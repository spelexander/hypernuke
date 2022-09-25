import { vec2 } from "gl-matrix";

export const DEFAULT_VIEWPORT_SIZE = 50_000;

/**
 * World coordinates:
 *
 * Middle out (infinite in x and y)
 * [ -1 ---- 0,0 ---- +1 ]
 *
 * Top left to bottom right
 * [ 0,0 ---- 1,1 ---- +2 ]
 *
 */
export interface Camera {
  scale: number;
  translation: vec2;
  worldViewport: vec2;
  toWorldPosition: (vec: vec2) => vec2;
  toScreenPosition: (vec: vec2) => vec2;
  toWorldScale: (vec: vec2) => vec2;
  toScreenScale: (vec: vec2) => vec2;
  translateCamera: (vec: vec2) => void;
  scaleCamera: (vec: number) => void;
}

const MAX_SCALE = 100;
const MIN_SCALE = 0.1;

const DEFAULT_VIEWPORT = vec2.fromValues(
  DEFAULT_VIEWPORT_SIZE,
  DEFAULT_VIEWPORT_SIZE / 1.5
);

export class MovableCamera implements Camera {
  public scale: number = 1;
  public worldViewport: vec2 = DEFAULT_VIEWPORT;
  public translation: vec2 = vec2.fromValues(0, 0);

  private pixelsPerUnit!: vec2;
  private centerScreenPos!: vec2;

  public constructor(private resolution: vec2) {
    this.init();
  }

  private init() {
    const viewport = vec2.scale(vec2.create(), DEFAULT_VIEWPORT, this.scale);
    this.worldViewport = viewport;
    this.pixelsPerUnit = vec2.divide(vec2.create(), this.resolution, viewport);
    const halfView = vec2.divide(
      vec2.create(),
      viewport,
      vec2.fromValues(2, 2)
    );
    this.centerScreenPos = vec2.multiply(
      vec2.create(),
      halfView,
      this.pixelsPerUnit
    );
  }

  public toScreenPosition = (worldCoords: vec2) => {
    const units = vec2.subtract(worldCoords, worldCoords, this.translation);
    const pixels = vec2.multiply(units, units, this.pixelsPerUnit);
    return vec2.add(pixels, pixels, this.centerScreenPos);
  };

  public toWorldPosition = (screenCoords: vec2) => {
    let withoutCenter = vec2.subtract(
      vec2.create(),
      screenCoords,
      this.centerScreenPos
    );
    const units = vec2.divide(withoutCenter, withoutCenter, this.pixelsPerUnit);
    return vec2.add(units, units, this.translation);
  };

  public toScreenScale = (worldSize: vec2) => {
    return vec2.multiply(vec2.create(), worldSize, this.pixelsPerUnit);
  };

  public toWorldScale = (screenSize: vec2) => {
    return vec2.divide(vec2.create(), screenSize, this.pixelsPerUnit);
  };

  public translateCamera = (translation: vec2) => {
    this.translation = translation;
  };

  public scaleCamera = (scale: number) => {
    if (scale > MAX_SCALE) {
      this.scale = MAX_SCALE;
    } else if (scale < MIN_SCALE) {
      this.scale = MIN_SCALE;
    } else {
      this.scale = scale;
    }

    this.init();
  };
}

export const topLeft = (position: vec2, size: vec2) => {
  const result = vec2.divide(vec2.create(), size, vec2.fromValues(2, 2));
  return vec2.subtract(result, position, result);
};
