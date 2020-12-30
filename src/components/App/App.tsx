import React, { useRef, useEffect, useState } from "react";
import "./App.css";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pixelRatio: number = window.devicePixelRatio > 1 ? 2 : 1;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    canvas = canvasRef.current;
    ctx = canvasRef.current.getContext("2d");

    window.addEventListener("resize", resize, false);

    resize();
  }, []);

  const resize = () => {
    canvas.width = document.body.clientWidth * pixelRatio;
    canvas.height = document.body.clientHeight * pixelRatio;

    // 캔버스 확대 요소
    ctx!.scale(pixelRatio, pixelRatio);
  };

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default App;
