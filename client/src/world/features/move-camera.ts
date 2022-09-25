import { World } from "../world";
import { vec2 } from "gl-matrix";

const translationState: {
  originTranslation: null | vec2;
} = {
  originTranslation: null,
};

export const setMoveCamera = (world: World) => {
  // zooming using wheel
  world.input.onWheel((delta) => {
    world.command.send("moveCamera", {
      translation: world.camera.translation,
      scale: world.camera.scale + delta,
    });
  });

  // navigating with middle mouse
  world.input.onDrag((button, delta) => {
    if (!world.input.pointerDown) {
      return;
    }

    // middle mouse
    if (button === 1) {
      let originTranslation = world.input.dragState.get("originTranslation");
      if (!originTranslation) {
        originTranslation = world.camera.translation;
        world.input.dragState.set("originTranslation", originTranslation);
      }

      const translation = vec2.subtract(
        vec2.create(),
        originTranslation,
        delta
      );

      world.command.send("moveCamera", {
        translation,
        scale: world.camera.scale,
      });
    }
  });

  // navigating with keys
  world.input.onKeyPress((key) => {
    const [moveDeltaX, moveDeltaY] = vec2.divide(
      vec2.create(),
      world.camera.worldViewport,
      vec2.fromValues(6, 6)
    );

    let deltaX = 0;
    let deltaY = 0;
    if (key === "w") {
      deltaY -= moveDeltaY;
    }

    if (key === "s") {
      deltaY += moveDeltaY;
    }

    if (key === "d") {
      deltaX += moveDeltaX;
    }

    if (key === "a") {
      deltaX -= moveDeltaX;
    }

    world.command.send("moveCamera", {
      translation: vec2.add(
        vec2.create(),
        vec2.fromValues(deltaX, deltaY),
        world.camera.translation
      ),
      scale: world.camera.scale,
    });
  });

  world.command.onCommand<{ translation: vec2; scale: number }>(
    "moveCamera",
    ({ translation, scale }) => {
      world.camera.translateCamera(translation);
      world.camera.scaleCamera(scale);
    }
  );
};
