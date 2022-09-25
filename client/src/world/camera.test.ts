import { it, expect } from "vitest";
import { MovableCamera } from "./camera";
import { vec2 } from "gl-matrix";

const resolution = vec2.fromValues(200, 200);
const viewportWorld = vec2.fromValues(20, 20);

it("toScreenScale returns correct size", () => {
  const camera = new MovableCamera(resolution, viewportWorld);
  const value = camera.toScreenScale(vec2.fromValues(5, 5));

  expect(value).toEqual(vec2.fromValues(150, 150));
});

it("toScreenPosition returns correct coordinates 1", () => {
  const camera = new MovableCamera(resolution, viewportWorld);
  const value = camera.toScreenPosition(vec2.fromValues(10, 5));

  expect(value).toEqual(vec2.fromValues(200, 150));
});

it("toScreenPosition returns correct coordinates 2", () => {
  const camera = new MovableCamera(resolution, viewportWorld);
  const value = camera.toScreenPosition(vec2.fromValues(5, -5));

  expect(value).toEqual(vec2.fromValues(150, 50));
});

it("toScreenPosition returns correct coordinates 3", () => {
  const camera = new MovableCamera(resolution, viewportWorld);
  const value = camera.toScreenPosition(vec2.fromValues(-5, -10));

  expect(value).toEqual(vec2.fromValues(50, 0));
});

it("toWorldPosition returns correct coordinates 1", () => {
  const camera = new MovableCamera(resolution, viewportWorld);
  const value = camera.toWorldPosition(vec2.fromValues(150, 100));

  expect(value).toEqual(vec2.fromValues(5, 0));
});

it("toWorldPosition returns correct coordinates 2", () => {
  const camera = new MovableCamera(resolution, viewportWorld);
  const value = camera.toWorldPosition(vec2.fromValues(200, 0));

  expect(value).toEqual(vec2.fromValues(10, -10));
});

it("toWorldPosition returns correct coordinates 3", () => {
  const camera = new MovableCamera(resolution, viewportWorld);
  const value = camera.toWorldPosition(vec2.fromValues(0, 0));

  expect(value).toEqual(vec2.fromValues(-10, -10));
});
