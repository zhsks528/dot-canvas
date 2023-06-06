import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import paint from "resources/images/paint.png";
import { Ripple } from "components/ripple";
import { Dot } from "components/dot";
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

const DOT_RADIUS = 8;
const PIXEL_SIZE = 20;

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tmpCanvasRef = useRef<HTMLCanvasElement>(null);
  const pixelRatio: number = window.devicePixelRatio > 1 ? 2 : 1;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const imgPos: imgPosType = useMemo(
    () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }),
    []
  );

  const image = useMemo(() => new Image(), []);
  image.src = paint;

  const ripple = useMemo(() => new Ripple(), []);

  const drawImage = useCallback(() => {
    const { clientWidth, clientHeight } = getDocumentSize();

    const stageRatio: number = clientWidth / clientHeight;
    const imgRatio: number = image.width / image.height;

    imgPos.width = clientWidth;
    imgPos.height = clientHeight;

    if (imgRatio < stageRatio) {
      imgPos.width = Math.round(image.width * (clientHeight / image.height));

      imgPos.x = Math.round((clientWidth - imgPos.width) / 2);
    } else {
      imgPos.height = Math.round(image.height * (clientWidth / image.width));

      imgPos.y = Math.round((clientHeight - imgPos.height) / 2);
    }

    console.log("imgPos", imgPos);

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
  }, [image, imgPos]);

  const drawDots = () => {
    dots = [];

    const { clientWidth, clientHeight } = getDocumentSize();

    const imgData = tmpCtx!.getImageData(0, 0, clientWidth, clientHeight);

    const columns = Math.ceil(clientWidth / PIXEL_SIZE);
    const rows = Math.ceil(clientHeight / PIXEL_SIZE);

    for (let i = 0; i < rows; i++) {
      const y = (i + 0.5) * PIXEL_SIZE;
      const pixelY = Math.max(Math.min(y, clientHeight), 0);

      for (let j = 0; j < columns; j++) {
        const x = (j + 0.5) * PIXEL_SIZE;
        const pixelX = Math.max(Math.min(x, clientWidth), 0);
        const pixelIndex = (pixelX + pixelY * clientWidth) * 4;

        const red = imgData.data[pixelIndex + 0];
        const green = imgData.data[pixelIndex + 1];
        const blue = imgData.data[pixelIndex + 2];

        const dot = new Dot(x, y, DOT_RADIUS, PIXEL_SIZE, red, green, blue);

        dots.push(dot);
      }
    }
  };

  const onClick = useCallback(
    (event: MouseEvent): void => {
      const { clientWidth, clientHeight } = getDocumentSize();

      ctx!.clearRect(0, 0, clientWidth, clientHeight);

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
    },
    [image, imgPos, ripple]
  );

  const resize = useCallback(() => {
    const { clientWidth, clientHeight } = getDocumentSize();

    // 캔버스 크기 설정 ( 웹브라우저의 크기에 따른 )
    canvas.width = clientWidth * pixelRatio;
    canvas.height = clientHeight * pixelRatio;

    // 캔버스 확대 요소
    ctx!.scale(pixelRatio, pixelRatio);

    tmpCanvas.width = clientWidth;
    tmpCanvas.height = clientHeight;

    ripple.resize(clientWidth, clientHeight);

    if (isLoaded) {
      drawImage();
    }
  }, [isLoaded, pixelRatio, ripple, drawImage]);

  useEffect(() => {
    const animate = () => {
      window.requestAnimationFrame(animate);

      ripple.animate(ctx);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (collide(dot.x, dot.y, ripple.x, ripple.y, ripple.radius)) {
          dot.animate(ctx);
        }
      }
    };

    if (canvasRef.current && tmpCanvasRef.current) {
      canvas = canvasRef.current;
      ctx = canvasRef.current.getContext("2d");

      tmpCanvas = tmpCanvasRef.current;
      tmpCtx = tmpCanvasRef.current.getContext("2d");

      resize();

      image.onload = () => {
        setIsLoaded(true);
        drawImage();
      };

      window.requestAnimationFrame(animate);

      window.addEventListener("resize", resize, false);
      canvas.addEventListener("click", onClick, false);

      return () => {
        window.removeEventListener("resize", resize, false);
        canvas.removeEventListener("click", onClick, false);
      };
    }
  }, [image, ripple, drawImage, onClick, resize]);

  return (
    <>
      <GlobalStyle />
      <Canvas ref={canvasRef}></Canvas>
      <Canvas ref={tmpCanvasRef}></Canvas>
    </>
  );
};

export default App;

function getDocumentSize(): { clientWidth: number; clientHeight: number } {
  const { clientWidth, clientHeight } = document.body;

  return { clientWidth, clientHeight };
}
