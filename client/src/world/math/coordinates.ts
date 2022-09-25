import { vec2 } from "gl-matrix";

export const pointIntersects = (
  [minx, miny]: vec2,
  [maxx, maxy]: vec2,
  [x, y]: vec2
) => {
  return x >= minx && x <= maxx && y >= miny && y <= maxy;
};
