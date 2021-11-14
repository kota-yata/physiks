// Using arc cosine formula
const calcDegree = (sideX: number, sideY: number) => {
  const oppositeSide = Math.sqrt(sideX ** 2 + sideY ** 2);
  const cos = (sideX ** 2 + oppositeSide ** 2 - sideY ** 2) / (2 * sideX * oppositeSide);
  const degree = Math.acos(cos) * (180 / Math.PI);
  return degree;
};

const SIN_90 = Math.sin(90 / (180 / Math.PI));

const calcSide = (degree: number, longestSide: number) => {
  let orthant: 1 | 2 | 3 | 4;
  let degreeAsTriangle: number;
  const positiveDegree = degree < 0 ? 360 + degree : degree;
  if (positiveDegree < 90) {
    orthant = 1;
    degreeAsTriangle = degree;
  } else if (positiveDegree < 180) {
    orthant = 2;
    degreeAsTriangle = 180 - degree;
  } else if (positiveDegree < 270) {
    orthant = 3;
    degreeAsTriangle = 270 - degree;
  } else {
    orthant = 4;
    degreeAsTriangle = 360 - degree;
  }
  const radian = degreeAsTriangle / (180 / Math.PI);
  const sin = Math.sin(radian);
  const y = orthant === 3 || orthant === 4 ? longestSide * sin / SIN_90 : -(longestSide * sin / SIN_90);
  const x = orthant === 2 || orthant === 3 ? -(Math.sqrt(longestSide ** 2 - y ** 2)) : Math.sqrt(longestSide ** 2 - y ** 2);
  return { x, y };
};

const addSpeed = (speedX: number, speedY: number) => {
  const newSpeed = [speedX + speedX / 30, speedY + speedY / 30];
  return newSpeed;
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
  keys: { ArrowLeft: boolean, ArrowRight: boolean };
  // Score
  score: number;
  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = canvasEl;
    this.context = canvasEl.getContext('2d');
    this.context.fillStyle = '#ffffff';
    this.rectWidth = 100;
    this.rectHeight = 100;
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
    this.score = 0;
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
  collide(): boolean {
    if (this.arcY + this.arcSpeedY > this.canvas.height - this.arcRadius) return false;
    // Both horizontal and vertical wall bouncing
    if (this.arcX + this.arcSpeedX > this.canvas.width - this.arcRadius || this.arcX + this.arcSpeedX < this.arcRadius) {
      this.arcSpeedX = -this.arcSpeedX;
      [this.arcSpeedX, this.arcSpeedY] = addSpeed(this.arcSpeedX, this.arcSpeedY);
      return true;
    }
    if (this.arcY + this.arcSpeedY < this.arcRadius) {
      this.arcSpeedY = -this.arcSpeedY;
      [this.arcSpeedX, this.arcSpeedY] = addSpeed(this.arcSpeedX, this.arcSpeedY);
      return true;
    };
    // Collision with rect
    const rectCenter = {
      x: this.rectX + this.rectWidth / 2,
      y: this.rectY + this.rectHeight / 2
    };
    const circleDistance = {
      x: this.arcX - rectCenter.x,
      y: this.arcY - rectCenter.y
    };
    if (Math.abs(circleDistance.x) > (this.rectWidth / 2 + this.arcRadius) || Math.abs(circleDistance.y) > (this.rectHeight / 2 + this.arcRadius)) return true;
    if (Math.abs(circleDistance.x) <= this.rectWidth / 2) {
      this.arcSpeedY = -this.arcSpeedY;
      this.score += 10;
      return true;
    };
    if (Math.abs(circleDistance.y) <= this.rectHeight / 2) {
      this.arcSpeedX = -this.arcSpeedX;
      this.score += 10;
      return true;
    };
    // Exception (each corner)
    const coordinateDiff = {
      fromRect: {
        x: circleDistance.x >= 0 ? circleDistance.x - this.rectWidth / 2 : circleDistance.x + this.rectWidth / 2,
        y: circleDistance.y >= 0 ? circleDistance.y - this.rectHeight / 2 : circleDistance.y - this.rectHeight / 2
      },
      fromPrevious: {
        x: -this.arcSpeedX,
        y: -this.arcSpeedY
      }
    };
    const degreeToRect = calcDegree(coordinateDiff.fromRect.x, coordinateDiff.fromRect.y);
    const degreeFromPrevious = calcDegree(coordinateDiff.fromPrevious.x, coordinateDiff.fromPrevious.y);
    const distanceFromPrevious = Math.sqrt(coordinateDiff.fromPrevious.x ** 2 + coordinateDiff.fromPrevious.y ** 2);
    const bouncingDegree = degreeToRect - (degreeFromPrevious - degreeToRect);
    this.score += Math.round(bouncingDegree);
    const bouncingSpeed = calcSide(bouncingDegree, distanceFromPrevious);
    // WIP
    this.arcSpeedX = bouncingSpeed.x;
    this.arcSpeedY = bouncingSpeed.y;
    return true;
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
