import { distance } from "utils";

export class Ripple {
  public x: number;
  public y: number;
  public radius: number;
  public maxRadius: number;
  public speed: number;
  public stageWidth: any;
  public stageHeight: any;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;
    this.maxRadius = 0;
    this.speed = 20;
  }

  resize = (stageWidth: number, stageHeight: number): void => {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
  };

  start = (x: number, y: number): void => {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = this.getMax(x, y);
  };

  animate = (ctx: any): void => {
    if (this.radius < this.maxRadius) {
      this.radius += this.speed;
    }

    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.fill();
  };

  getMax(x: number, y: number): number {
    const c1 = distance(0, 0, x, y);
    const c2 = distance(this.stageWidth, 0, this.x, this.y);
    const c3 = distance(0, this.stageHeight, this.x, this.y);
    const c4 = distance(this.stageWidth, this.stageHeight, this.x, this.y);

    return Math.max(c1, c2, c3, c4);
  }
}
