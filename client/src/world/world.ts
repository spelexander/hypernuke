import { createWorld, pipe, IWorld } from "bitecs";
import { vec2 } from "gl-matrix";
import { Camera, MovableCamera } from "./camera";
import { scanlineRenderSystem } from "./rendering/scanline-render-system";
import { colors } from "./rendering/colors";
import { movementSystem } from "./systems/movement-system";
import { timeSystem } from "./systems/time-system";
import { gravitySystem } from "./systems/gravity-system";
import { InputStateMachine, inputSystem } from "./input/input-system";
import { Commands, commandSystem } from "./command";
import { setupShip } from "./features/ship";
import { setupCluster } from "./features/planets";
import { setMoveCamera } from "./features/move-camera";
import { propulsionSystem } from "./systems/propulsion-system";
import { waypointRenderSystem } from "./rendering/waypoint-render-system";
import { mothershipRenderSystem } from "./rendering/mothership-render-system";
import { probeRenderSystem } from "./rendering/probe-render-system";
import { planetRenderSystem } from "./rendering/planet-render-system";
import { connectionRenderSystem } from "./rendering/connection-render-system";
import { probeSystem } from "./systems/probe-system";
import { causalitySystem } from "./systems/causality-system";
import { motherShipSystem } from "./systems/mothership-system";
import { uiRenderSystem } from "./rendering/ui-render-system";

export interface World extends IWorld {
  time: { delta: number; elapsed: number; then: DOMHighResTimeStamp };
  renderingContext: RenderContext;
  camera: Camera;
  tick: number;
  input: InputStateMachine;
  command: Commands;
}

export interface RenderContext {
  screenHeight: number;
  screenWidth: number;
  context: CanvasRenderingContext2D;
}

export interface WorldContext {
  renderingContext: CanvasRenderingContext2D;
  killSwitch: { dead: boolean };
  element: Window;
}

const pipeline = pipe(
  // core
  timeSystem,
  inputSystem,
  commandSystem,
  // spacetime capabilities
  gravitySystem,
  propulsionSystem,
  causalitySystem,
  movementSystem,
  // game features
  probeSystem,
  motherShipSystem,
  // renderers
  scanlineRenderSystem,
  planetRenderSystem,
  probeRenderSystem,
  mothershipRenderSystem,
  waypointRenderSystem,
  connectionRenderSystem,
  uiRenderSystem
);

export const startWorld = (context: WorldContext) => {
  // render setup stuff
  context.renderingContext.imageSmoothingEnabled = false;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const world: World = createWorld();
  world.time = { delta: 0, elapsed: 0, then: performance.now() };
  world.tick = 0;
  world.renderingContext = {
    context: context.renderingContext,
    screenWidth,
    screenHeight,
  };
  world.camera = new MovableCamera(vec2.fromValues(screenWidth, screenHeight));
  world.input = new InputStateMachine(context.element, world.camera);
  world.command = new Commands();

  // Setup capabilities
  setupShip(world);
  setupCluster(world);
  setMoveCamera(world);

  const loop = () => {
    if (context.killSwitch.dead) {
      // bail out
      return;
    }

    // clear canvas
    context.renderingContext.fillStyle = colors.white;
    context.renderingContext.globalAlpha = 0.4;
    context.renderingContext.fillRect(0, 0, screenWidth, screenHeight);
    context.renderingContext.globalAlpha = 1;

    pipeline(world);
    world.tick++;
    window.requestAnimationFrame(loop);
  };

  loop();
};
