import React, { useRef, useEffect, useState } from "react";
import paint from "resources/images/paint.png";
import { Ripple } from "components/Ripple/Ripple";
import { Dot } from "components/Dot/dot";
import { collide } from "utils";
import styled from "styled-components";
import GlobalStyle from "components/globalStyle";

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let tmpCanvas: HTMLCanvasElement;
let tmpCtx: CanvasRenderingContext2D | null;
let dots: Array<any> = [];

interface imgPosType {
  x: number;
  y: number;
  width: number;
  height: number;
}

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tmpCanvasRef = useRef<HTMLCanvasElement>(null);
  const pixelRatio: number = window.devicePixelRatio > 1 ? 2 : 1;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const radius: number = 8;
  const pixelSize: number = 20;

  const imgPos: imgPosType = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  const image = new Image();
  image.src = paint;

  const ripple = new Ripple();

  function resize(): void {
    const stageWidth: number = document.body.clientWidth;
    const stageHeight: number = document.body.clientHeight;

    // 캔버스 크기 설정 ( 웹브라우저의 크기에 따른 )
    canvas.width = stageWidth * pixelRatio;
    canvas.height = stageHeight * pixelRatio;

    // 캔버스 확대 요소
    ctx!.scale(pixelRatio, pixelRatio);

    tmpCanvas.width = stageWidth;
    tmpCanvas.height = stageHeight;

    ripple.resize(stageWidth, stageHeight);

    if (isLoaded) {
      drawImage();
    }
  }

  function drawImage(): void {
    const stageWidth: number = document.body.clientWidth;
    const stageHeight: number = document.body.clientHeight;

    const stageRatio: number = stageWidth / stageHeight;
    const imgRatio: number = image.width / image.height;

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

    tmpCtx!.drawImage(
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

    drawDots();
  }

  function drawDots(): void {
    dots = [];

    const stageWidth: number = document.body.clientWidth;
    const stageHeight: number = document.body.clientHeight;

    const imgData = tmpCtx!.getImageData(0, 0, stageWidth, stageHeight);

    const columns = Math.ceil(stageWidth / pixelSize);
    const rows = Math.ceil(stageHeight / pixelSize);

    for (let i = 0; i < rows; i++) {
      const y = (i + 0.5) * pixelSize;
      const pixelY = Math.max(Math.min(y, stageHeight), 0);

      for (let j = 0; j < columns; j++) {
        const x = (j + 0.5) * pixelSize;
        const pixelX = Math.max(Math.min(x, stageWidth), 0);
        const pixelIndex = (pixelX + pixelY * stageWidth) * 4;

        const red = imgData.data[pixelIndex + 0];
        const green = imgData.data[pixelIndex + 1];
        const blue = imgData.data[pixelIndex + 2];

        const dot = new Dot(x, y, radius, pixelSize, red, green, blue);

        dots.push(dot);
      }
    }
  }

  function animate(): void {
    window.requestAnimationFrame(animate);

    ripple.animate(ctx);

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];

      if (collide(dot.x, dot.y, ripple.x, ripple.y, ripple.radius)) {
        dot.animate(ctx);
      }
    }
  }

  function onClick(event: MouseEvent): void {
    const stageWidth: number = document.body.clientWidth;
    const stageHeight: number = document.body.clientHeight;

    ctx!.clearRect(0, 0, stageWidth, stageHeight);

    for (let i = 0; i < dots.length; i++) {
      dots[i].reset();
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

    ripple.start(event.offsetX, event.offsetY);
  }

  useEffect(() => {
    if (canvasRef.current && tmpCanvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvasRef.current.getContext("2d");

      tmpCanvas = tmpCanvasRef.current;
      tmpCtx = tmpCanvasRef.current.getContext("2d");

      window.addEventListener("resize", resize, false);

      resize();

      image.onload = () => {
        setIsLoaded(true);
        drawImage();
      };

      window.requestAnimationFrame(animate);

      canvas.addEventListener("click", onClick, false);
    }
  });

  return (
    <>
      <GlobalStyle />
      <Canvas ref={canvasRef}></Canvas>
      <Canvas ref={tmpCanvasRef}></Canvas>
    </>
  );
};

export default App;
