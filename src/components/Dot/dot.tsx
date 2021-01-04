const PI2: number = Math.PI * 2;
const BOUNCE: number = 0.82;

export class Dot {
  targetRadius: number;
  radiusV: number;
  pixelSizeHalf: number;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public pixelSize: number,
    public red: number,
    public green: number,
    public blue: number
  ) {
    this.x = x;
    this.y = y;
    this.pixelSize = pixelSize;
    this.pixelSizeHalf = pixelSize / 2;
    this.red = red;
    this.green = green;
    this.blue = blue;

    this.targetRadius = radius;
    this.radius = 0;
    this.radiusV = 0;
  }

  animate = (ctx: CanvasRenderingContext2D): void => {
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.fillRect(
      this.x - this.pixelSizeHalf,
      this.y - this.pixelSizeHalf,
      this.pixelSize,
      this.pixelSize
    );

    const accel: number = (this.targetRadius - this.radius) / 2;
    this.radiusV += accel;
    this.radiusV *= BOUNCE;
    this.radius += this.radiusV;

    ctx.beginPath();
    ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
    ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
    ctx.fill();
  };

  reset = (): void => {
    this.radius = 0;
    this.radiusV = 0;
  };
}
