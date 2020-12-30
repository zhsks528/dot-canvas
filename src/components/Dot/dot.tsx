export class Dot {
  public targetRadius: number;
  public radiusV: number;
  public pixelSizeHalf: number;

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
    this.targetRadius = radius;
    this.radius = 0;
    this.radiusV = 0;
    this.pixelSize = pixelSize;
    this.pixelSizeHalf = pixelSize / 2;
    this.red = red;
    this.green = green;
    this.blue = blue;
  }
}
