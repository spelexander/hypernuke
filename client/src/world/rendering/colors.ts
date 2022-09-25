import { RenderContext } from "../world";

export const colors = {
  primary: "blue",
  secondary: "white",
  text: "white",
  subtle: "#262626",
  white: "#f8f8ff",
  black: "black",
};

export const prepareDraw = (context: CanvasRenderingContext2D) => {
  context.strokeStyle = colors.primary;
  context.fillStyle = colors.primary;
  context.globalAlpha = 1;
};

export const beforeRender = (context: RenderContext) => {
  prepareDraw(context.context);
};

export const afterRender = (_context: RenderContext) => {};
