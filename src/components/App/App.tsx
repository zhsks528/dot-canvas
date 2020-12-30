import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import paint from "paint.png";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pixelRatio: number = window.devicePixelRatio > 1 ? 2 : 1;

  const [isLoaded, setIsLoaded] = useState(false);

  const imgPos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  const image = new Image();
  image.src = paint;

  useEffect(() => {
    if (canvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvasRef.current.getContext("2d");

      window.addEventListener("resize", resize, false);

      resize();

      image.onload = () => {
        setIsLoaded(true);
        drawImage();
      };
    }
  });

  const resize = () => {
    const stageWidth = document.body.clientWidth;
    const stageHeight = document.body.clientHeight;

    // 캔버스 크기 설정 ( 웹브라우저의 크기에 따른 )
    canvas.width = stageWidth * pixelRatio;
    canvas.height = stageHeight * pixelRatio;

    // 캔버스 확대 요소
    ctx!.scale(pixelRatio, pixelRatio);

    if (isLoaded) {
      drawImage();
    }
  };

  const drawImage = (): void => {
    const stageWidth = document.body.clientWidth;
    const stageHeight = document.body.clientHeight;

    const stageRatio = stageWidth / stageHeight;
    const imgRatio = image.width / image.height;

    imgPos.width = stageWidth;
    imgPos.height = stageHeight;

    if (imgRatio < stageRatio) {
      imgPos.width = Math.round(image.width * (stageHeight / image.height));

      imgPos.x = Math.round((stageWidth - imgPos.width) / 2);
    } else {
      imgPos.height = Math.round(image.height * (stageWidth / image.width));

      imgPos.y = Math.round((stageHeight - imgPos.height) / 2);
    }

    ctx!.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      imgPos.x,
      imgPos.y,
      imgPos.width,
      imgPos.height
    );
  };
  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default App;
