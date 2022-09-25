import React, { useEffect, useRef } from "react";
import classes from "./canvas.module.css";
import { startWorld } from "./world";

export const Canvas: React.FC = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let killSwitch = {
      dead: false,
    };

    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.oncontextmenu = function (e) {
      e.preventDefault();
    };
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("unable to get rendering context");
    }

    //Our draw come here
    startWorld({
      element: window,
      renderingContext: context,
      killSwitch,
    });

    return () => {
      killSwitch.dead = true;
    };
  }, [startWorld, canvasRef.current]);

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      className={classes.canvas}
      ref={canvasRef}
      {...props}
    />
  );
};
