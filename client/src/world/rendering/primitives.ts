import { vec2 } from "gl-matrix";

const doublePI = Math.PI * 2;

export const drawCircle = (
  position: vec2,
  diameter: vec2,
  context: CanvasRenderingContext2D
) => {
  const [x, y] = position;
  const radius = diameter[0] / 2;

  context.beginPath();
  context.lineWidth = Math.random() > 0.2 ? 1 : 0.5;
  context.arc(x, y, radius, 0, 2 * Math.PI);
  if (Math.random() > 0.1) context.stroke();
  context.closePath();
};

export const drawPolygonCircle = (
  position: vec2,
  diameter: vec2,
  rotation: number,
  context: CanvasRenderingContext2D
) => {
  const [x, y] = position;
  const radius = diameter[0] / 2;

  context.beginPath();
  context.lineWidth = Math.random() > 0.2 ? 1 : 0.5;

  const angle = rotation;
  const sides = 13;

  const anglePi = doublePI + angle;
  context.moveTo(
    (x + Math.cos(anglePi) * radius) >> 0,
    (y + Math.sin(anglePi) * radius) >> 0
  );

  for (let j = sides; j > -1; --j) {
    const segment = doublePI * (j / sides) + angle;
    context.lineTo(
      (x + Math.cos(segment) * radius) >> 0,
      (y + Math.sin(segment) * radius) >> 0
    );
  }

  if (Math.random() > 0.1) context.stroke();

  context.closePath();
};

export const drawRect = (
  position: vec2,
  size: vec2,
  context: CanvasRenderingContext2D
) => {
  const [x, y] = position;
  const [width, height] = size;
  context.lineWidth = Math.random() > 0.2 ? 1 : 0.5;
  if (Math.random() > 0.1) context.strokeRect(x, y, width, height);
};
