export class Ops {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  // Rectangle properties
  rectWidth: number;
  rectHeight: number;
  rectX: number;
  rectY: number;
  rectSpeed: number;
  // Circle
  arcRadius: number;
  arcX: number;
  arcY: number;
  arcSpeedX: number;
  arcSpeedY: number;
  keys: { ArrowLeft: boolean, ArrowRight: boolean }
  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = canvasEl;
    this.context = canvasEl.getContext('2d');
    this.context.fillStyle = '#ffffff';
    this.rectWidth = 80;
    this.rectHeight = 10;
    this.rectX = canvasEl.width * 0.5 - this.rectWidth / 2;
    this.rectY = canvasEl.height * 0.9;
    this.rectSpeed = 15;
    this.arcRadius = this.arcX = this.arcY = 25;
    this.arcSpeedX = this.arcSpeedY = 5;
    this.keys = {
      ArrowLeft: false,
      ArrowRight: false,
    };
  }
  draw(): void {
    this.context.beginPath();
    this.context.rect(this.rectX, this.rectY, this.rectWidth, this.rectHeight);
    this.context.fill();
    this.context.beginPath();
    this.context.arc(this.arcX, this.arcY, this.arcRadius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
    this.context.fillStyle = '#ffffff';
  }
  move(): void {
    // Move rectangle if keydown
    if (this.keys.ArrowLeft && this.rectX > 0) this.rectX -= this.rectSpeed;
    if (this.keys.ArrowRight && this.rectX < this.canvas.width - this.rectWidth) this.rectX += this.rectSpeed;
    // Add power to circle only until it bounces on a wall
    this.arcX += this.arcSpeedX;
    this.arcY += this.arcSpeedY;
    // Both horizontal and vertical wall bouncing
    if (this.arcX + this.arcSpeedX > this.canvas.width - this.arcRadius || this.arcX + this.arcSpeedX < this.arcRadius) this.arcSpeedX = -this.arcSpeedX;
    if (this.arcY + this.arcSpeedY > this.canvas.height - this.arcRadius || this.arcY + this.arcSpeedY < this.arcRadius) this.arcSpeedY = -this.arcSpeedY;
    // Collision with rect
    const circleDistance = {
      x: Math.abs(this.arcX - this.rectX),
      y: Math.abs(this.arcY - this.rectY)
    };
    // eslint-disable-next-line no-useless-return
    if (circleDistance.x > (this.rectWidth / 2 + this.arcRadius) || circleDistance.y > (this.rectHeight / 2 + this.arcRadius)) return;
  }
}
