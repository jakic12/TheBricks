class SoundManager {
  constructor() {}
}

class EventHandler {
  constructor() {
    this.events = {};
  }

  addEventListener(name, call) {
    if (this.events[name]) {
      this.events[name].push(call);
    } else {
      this.events[name] = [call];
    }
  }

  /**
   * Adds event listener with id, if id is the same, nothing happens
   * @param {String} name
   * @param {String} id
   * @param {Function} call
   */
  addEventListenerWithId(name, id, call) {
    call.id = id;
    if (this.events[name].filter((e) => e.id === id).length === 0)
      if (this.events[name]) {
        this.events[name].push(call);
      } else {
        this.events[name] = [call];
      }
  }

  dispatchEvent(name, ...params) {
    if (this.events[name]) this.events[name].forEach((f) => f(...params));
  }
}

class Line {
  constructor(p1, p2, bound = true) {
    this.type = "line";
    this.b = p2.x - p1.x;
    this.a = p1.y - p2.y;
    this.c = p1.x * p2.y - p2.x * p1.y;

    this.p1 = p1;
    this.p2 = p2;

    this.bound = bound;
  }

  copy() {
    return new Line(this.p1.copy(), this.p2.copy(), this.bound);
  }

  distanceTo(p1) {
    return Math.abs(
      (this.a * p1.x + this.b * p1.y + this.c) /
        Math.sqrt(this.a ** 2 + this.b ** 2)
    );
  }

  nonAbsDistanceTo(p1) {
    return (
      (this.a * p1.x + this.b * p1.y + this.c) /
      Math.sqrt(this.a ** 2 + this.b ** 2)
    );
  }

  getAngleBetween(line) {
    return Math.acos(
      (this.a * line.a + this.b * line.b) /
        (Math.sqrt(this.a ** 2 + this.b ** 2) *
          Math.sqrt(line.a ** 2 + line.b ** 2))
    );
  }

  getAngle() {
    return Math.acos(this.b / Math.sqrt(this.a ** 2 + this.b ** 2));
  }

  getNormalVector() {
    return new Vector(this.a, this.b).getUnitVector();
  }

  draw(ctx, color = "black") {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
  }

  length() {
    return this.p1.pointDistanceTo(this.p2);
  }
}

class Polygon {
  constructor(points) {
    this.type = "polygon";
    this.boundingLines = [];
    this.points = points;
    for (let i = 0; i < points.length; i++) {
      this.boundingLines.push(
        new Line(points[i], points[(i + 1) % points.length])
      );
    }
  }

  draw(ctx, color = "black") {
    this.boundingLines.forEach((l) => l.draw(ctx, color));
  }

  copy() {
    return new Polygon(this.points.map((p) => p.copy()));
  }
}

class Slider {
  constructor(
    p1,
    p2,
    w,
    h = 10,
    sliderSpeed,
    sliderBounceK = 10,
    position = 0.5
  ) {
    this.position = position;
    this.type = "slider";
    this.baseLine = new Line(p1, p2);
    this.sliderBounceK = sliderBounceK;
    this.sliderSpeed = sliderSpeed;

    this.w = w;
    this.h = h;
    this.updateSliderRect();
  }

  copy() {
    return new Slider(
      this.baseLine.p1.copy(),
      this.baseLine.p2.copy(),
      this.w,
      this.h,
      this.sliderSpeed,
      this.sliderBounceK,
      this.position
    );
  }

  setPosition(k) {
    this.position = k;
    this.updateSliderRect();
  }

  updateSliderRect() {
    const center = this.getPositionCenter();
    const angle = this.baseLine.getAngle();
    const upperCenter = new Vector(
      center.x + (Math.cos(angle) * this.w) / 2,
      center.y + (Math.sin(angle) * this.w) / 2
    );
    const lowerCenter = new Vector(
      center.x - (Math.cos(angle) * this.w) / 2,
      center.y - (Math.sin(angle) * this.w) / 2
    );
    this.sliderRect = new Polygon([
      new Vector(
        upperCenter.x + (Math.cos(angle + Math.PI / 4) * this.h) / 2,
        upperCenter.y + (Math.sin(angle + Math.PI / 4) * this.h) / 2
      ),
      new Vector(
        upperCenter.x + (Math.cos(angle - Math.PI / 4) * this.h) / 2,
        upperCenter.y + (Math.sin(angle - Math.PI / 4) * this.h) / 2
      ),
      new Vector(
        lowerCenter.x + (Math.cos(angle - Math.PI / 4) * this.h) / 2,
        lowerCenter.y + (Math.sin(angle - Math.PI / 4) * this.h) / 2
      ),
      new Vector(
        lowerCenter.x + (Math.cos(angle + Math.PI / 4) * this.h) / 2,
        lowerCenter.y + (Math.sin(angle + Math.PI / 4) * this.h) / 2
      ),
    ]);
  }

  getPositionCenter() {
    return new Vector(
      this.baseLine.p1.x * this.position +
        this.baseLine.p2.x * (1 - this.position),
      this.baseLine.p1.y * this.position +
        this.baseLine.p2.y * (1 - this.position)
    );
  }

  draw(ctx, color = "black") {
    this.sliderRect.draw(ctx, color);
  }

  drawWithLine(ctx, color = "black") {
    this.draw(ctx, color);
    this.baseLine.draw(ctx, color);
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(coeff) {
    return new Vector(this.x * coeff, this.y * coeff);
  }

  getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  getUnitVector() {
    const mag = this.getMagnitude();
    return new Vector(this.x / mag, this.y / mag);
  }

  pointDistanceTo(point2) {
    return Math.sqrt((point2.x - this.x) ** 2 + (point2.y - this.y) ** 2);
  }

  add(vec2) {
    return new Vector(this.x + vec2.x, this.y + vec2.y);
  }
}

class Brick {
  constructor(points, lives, colorScheme = [`#323232`, `#ff1e56`, `#ffac41`]) {
    this.type = "brick";
    this.hitBox = new Polygon(points);
    this.lives = lives;
    this.colorScheme = colorScheme;
    this.points = points;
  }

  copy() {
    return new Brick(
      this.points.map((p) => p.copy()),
      this.lives,
      JSON.parse(JSON.stringify(this.colorScheme))
    );
  }

  draw(ctx, color = "black") {
    this.hitBox.draw(ctx, color);
    ctx.fillStyle = this.colorScheme[this.lives - 1];
    ctx.fillRect(
      this.hitBox.boundingLines[0].p1.x,
      this.hitBox.boundingLines[0].p1.y,
      this.hitBox.boundingLines[0].p2.x - this.hitBox.boundingLines[0].p1.x,
      this.hitBox.boundingLines[1].p2.y - this.hitBox.boundingLines[1].p1.y
    );
  }
}

class Ball extends EventHandler {
  constructor(point, r, speedVector = new Vector(0, 0)) {
    super();
    this.pos = point;
    this.r = r;

    this.speed = speedVector;
    this.internalBounceMark = false;

    this.addEventListener("lineCollision", () => {
      this.internalBounceMark = true;
    });
  }

  copy() {
    return new Ball(this.pos.copy(), this.r, this.speed.copy());
  }

  moveInternal() {
    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;
  }

  intersectWithLine(line, mark, sliderBounceK) {
    const distance = line.distanceTo(this.pos);
    const center = new Vector(
      (line.p1.x + line.p2.x) / 2,
      (line.p1.y + line.p2.y) / 2
    );
    const maximumAllowed = Math.sqrt(line.length() ** 2 + this.r ** 2) + 2;
    if (
      distance <= this.r &&
      (line.bound
        ? maximumAllowed >= this.pos.pointDistanceTo(line.p1) &&
          maximumAllowed >= this.pos.pointDistanceTo(line.p2)
        : true)
    ) {
      if (!this.bounced || this.bounced !== line) {
        this.bounced = line;

        if (mark) {
          line[mark] = true;
        }

        let wMultiplier = 0;
        if (sliderBounceK) {
          wMultiplier =
            (center.pointDistanceTo(this.pos) / maximumAllowed) * sliderBounceK;
        }
        const n = line.getNormalVector();
        const u = n.multiply(this.speed.dot(n));
        let w = this.speed.subtract(u);
        if (sliderBounceK) {
          w = w.add(
            this.pos.subtract(center).getUnitVector().multiply(wMultiplier)
          );
        }
        if (sliderBounceK) {
          this.speed = w
            .subtract(u)
            .getUnitVector()
            .multiply(this.speed.getMagnitude());
        } else {
          this.speed = w.subtract(u);
        }

        this.dispatchEvent("lineCollision", line);
      }
    } else {
      if (mark) {
        line[mark] = false;
      }
      if (this.bounced && this.bounced === line) {
        this.bounced = undefined;
      }
    }
  }

  intersectWithPolygon(polygon, mark, sliderBounceK) {
    polygon.boundingLines.forEach((l) =>
      this.intersectWithLine(l, mark, sliderBounceK)
    );
    if (mark) {
      polygon[mark] = false;
      for (let i = 0; i < polygon.boundingLines.length; i++) {
        if (polygon.boundingLines[i][mark]) {
          polygon[mark] = true;
          break;
        }
      }
    }
  }

  intersectWithBrick(brick, mark = true) {
    this.intersectWithPolygon(brick.hitBox, mark);
    if (brick.hitBox[mark]) {
      //debugger;
    }
    if (brick.hitBox[mark] && !brick.dontReduceLives) {
      brick.lives--;
      brick.dontReduceLives = true;
    } else if (!brick.hitBox[mark]) {
      brick.dontReduceLives = false;
    }
  }

  intersect(object, mark) {
    this.internalBounceMark = false;
    switch (object.type) {
      case "polygon":
        this.intersectWithPolygon(object, mark);
        break;
      case "line":
        this.intersectWithLine(object, mark);
        break;
      case "slider":
        this.intersectWithPolygon(
          object.sliderRect,
          mark,
          object.sliderBounceK
        );
        break;
      case "brick":
        this.intersectWithBrick(object);
        break;
    }

    if (this.internalBounceMark) {
      this.dispatchEvent("collision", object);
      this.dispatchEvent(`${object.type}Collision`, object);
    }
  }

  draw(ctx, color = "black") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

class BrickManager {
  constructor(balls, brickW, brickH, brickMap, otherObjects = []) {
    this.balls = balls;
    balls.forEach((b) =>
      b.addEventListener("collision", () => {
        this.dispatchEvent(new Event("collision"));
      })
    );

    this.brickW = brickW;
    this.brickH = brickH;
    this.brickMap = brickMap;
    this.bricks = [];
    brickMap.forEach((row, y) => {
      row.forEach((_b, x) => {
        if (_b)
          this.bricks.push(
            new Brick(
              [
                new Vector(brickW * x, brickH * y),
                new Vector(brickW * (x + 1), brickH * y),
                new Vector(brickW * (x + 1), brickH * (y + 1)),
                new Vector(brickW * x, brickH * (y + 1)),
              ],
              _b
            )
          );
      });
    });

    this.otherObjects = otherObjects;
  }

  copy() {
    return new BrickManager(
      this.balls.map((b) => b.copy()),
      this.brickW,
      this.brickH,
      JSON.parse(JSON.stringify(this.brickMap)),
      this.otherObjects.map((oo) => oo.copy())
    );
  }

  draw(ctx, color = "black") {
    this.bricks.forEach((b) => b.draw(ctx, color));
    this.balls.forEach((b) => b.draw(ctx, color));
    this.otherObjects.forEach((oo) => oo.draw(ctx, color));
  }

  intersect() {
    const mark = "gotHit";
    this.balls.forEach((b) => {
      this.bricks.forEach((brick) => {
        b.intersect(brick, mark);
      });

      this.otherObjects.forEach((oo) => {
        b.intersect(oo);
      });
    });

    this.bricks = this.bricks.filter((b) => b.lives > 0);
  }

  moveBalls() {
    this.balls.forEach((b) => {
      b.moveInternal();
    });
  }

  gameLoop(ctx, color = "black") {
    this.intersect();
    this.moveBalls();
    this.draw(ctx, color);
  }
}

const animationInterval = (callback) => {
  callback();
  requestAnimationFrame(() => animationInterval(callback));
};

class GameManager {
  constructor(levels) {
    this.levels = levels;
    this.combinedAttempts = 0;
    this.levels.forEach(
      (l) =>
        (l.onEnd = (att) => {
          this.currentLevel++;
          this.combinedAttempts += att;
        })
    );
    this.currentLevel = 0;
  }

  start() {
    //game loop
    animationInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.levels[this.currentLevel].gameLoop(ctx);
      if (this.leftPressed) {
        this.levels[this.currentLevel].moveSliders(1);
      }
      if (this.rightPressed) {
        this.levels[this.currentLevel].moveSliders(-1);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.leftPressed = true;
      }

      if (e.key === "ArrowRight") {
        this.rightPressed = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft") {
        this.leftPressed = false;
      }

      if (e.key === "ArrowRight") {
        this.rightPressed = false;
      }
    });
  }
}

class Level {
  constructor(brickManager, sliders, onEnd = () => {}) {
    brickManager.otherObjects.push(...sliders);
    this.brickManager = brickManager;
    this.sliders = sliders;
    this.attempts = 0;
    this.start = brickManager.copy();
    this.onEnd = onEnd;
  }

  gameLoop(ctx, color = "black") {
    this.brickManager.gameLoop(ctx, color);

    this.brickManager.balls = this.brickManager.balls.filter(
      (ball) =>
        !(
          ball.pos.x < -ball.r / 2 ||
          ball.pos.x > ctx.canvas.width + ball.r / 2 ||
          ball.pos.y < -ball.r / 2 ||
          ball.pos.y > ctx.canvas.height + ball.r / 2
        )
    );

    if (this.brickManager.balls.length === 0) {
      this.attempts++;
      this.brickManager = this.start.copy();
      this.sliders = this.brickManager.otherObjects.filter(
        (oo) => oo.type === "slider"
      );
    }

    if (this.brickManager.bricks.length === 0) {
      this.won = true;
      if (this.onEnd) {
        this.onEnd(this.attempts);
      }
    }
  }

  moveSliders(dk) {
    this.sliders.forEach((s) =>
      s.setPosition(
        Math.min(1, Math.max(0, s.position + (s.sliderSpeed || 0.001) * dk))
      )
    );
  }
}

toDegreesStr = (x) => `${(x / Math.PI) * 180}°`;
printAngles = (...angles) => {
  console.log(...angles.map((a) => toDegreesStr(a)));
};
