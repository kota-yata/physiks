// Using arc cosine formula
const calcDegree = (sideX: number, sideY: number) => {
  const oppositeSide = Math.sqrt(sideX ** 2 + sideY ** 2);
  const cos = (sideX ** 2 + oppositeSide ** 2 - sideY ** 2) / (2 * sideX * oppositeSide);
  const degree = Math.acos(cos) * (180 / Math.PI);
  return degree;
};

const calcSide = (degree: number, longestSide: number) => {
  const radian = degree / (180 / Math.PI);
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  const x = longestSide * cos;
  const y = longestSide * sin;
  return { x, y };
};

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
  arcDistance: number;
  // Circle coordinate of previous frame
  arcPreviousX: number;
  arcPreviousY: number;
  keys: { ArrowLeft: boolean, ArrowRight: boolean }
  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = canvasEl;
    this.context = canvasEl.getContext('2d');
    this.context.fillStyle = '#ffffff';
    this.rectWidth = 100;
    this.rectHeight = 10;
    this.rectX = canvasEl.width * 0.5 - this.rectWidth / 2;
    this.rectY = canvasEl.height * 0.9;
    this.rectSpeed = 15;
    this.arcRadius = this.arcX = this.arcY = 25;
    this.arcSpeedX = this.arcSpeedY = 7;
    this.arcPreviousX = this.arcPreviousY = 0;
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
  }
  collide(): void {
    // Both horizontal and vertical wall bouncing
    if (this.arcX + this.arcSpeedX > this.canvas.width - this.arcRadius || this.arcX + this.arcSpeedX < this.arcRadius) this.arcSpeedX = -this.arcSpeedX;
    if (this.arcY + this.arcSpeedY > this.canvas.height - this.arcRadius || this.arcY + this.arcSpeedY < this.arcRadius) this.arcSpeedY = -this.arcSpeedY;
    // Collision with rect
    const rectCenter = {
      x: this.rectX + this.rectWidth / 2,
      y: this.rectY + this.rectHeight / 2
    };
    const circleDistance = {
      x: Math.abs(this.arcX - rectCenter.x),
      y: Math.abs(this.arcY - rectCenter.y)
    };
    if (circleDistance.x > (this.rectWidth / 2 + this.arcRadius) || circleDistance.y > (this.rectHeight / 2 + this.arcRadius)) return;
    if (circleDistance.x <= this.rectWidth / 2) {
      this.arcSpeedY = -this.arcSpeedY;
      return;
    };
    if (circleDistance.y <= this.rectHeight / 2) {
      this.arcSpeedX = -this.arcSpeedX;
      return;
    };
    // Exception (each corner)
    const coordinateDiff = {
      fromRect: {
        x: (circleDistance.x - this.rectWidth / 2) / 2,
        y: circleDistance.y - this.rectHeight / 2
      },
      fromPrevious: {
        x: Math.abs(this.arcX - this.arcPreviousX),
        y: Math.abs(this.arcY - this.arcPreviousY)
      }
    };
    const digreeToRect = calcDegree(coordinateDiff.fromRect.x, coordinateDiff.fromRect.y);
    const digreeFromPrevious = calcDegree(coordinateDiff.fromPrevious.x, coordinateDiff.fromPrevious.y);
    const distanceFromPrevious = Math.sqrt(coordinateDiff.fromPrevious.x ** 2 + coordinateDiff.fromPrevious.y ** 2);
    const bouncingDegree = digreeToRect - (digreeFromPrevious - digreeToRect);
    const bouncingSpeed = calcSide(bouncingDegree, distanceFromPrevious);
    console.log('x', this.arcSpeedX, bouncingSpeed.x);
    console.log('y', this.arcSpeedY, bouncingSpeed.y);
    // WIP
    this.arcSpeedX = bouncingSpeed.x;
    this.arcSpeedY = bouncingSpeed.y;
  }
  move(): void {
    // Move rectangle if keydown
    if (this.keys.ArrowLeft && this.rectX > 0) this.rectX -= this.rectSpeed;
    if (this.keys.ArrowRight && this.rectX < this.canvas.width - this.rectWidth) this.rectX += this.rectSpeed;
    // Assign current coordinate to the previous
    this.arcPreviousX = this.arcX;
    this.arcPreviousY = this.arcY;
    // Add power to circle
    this.arcX += this.arcSpeedX;
    this.arcY += this.arcSpeedY;
  }
}
