//prepare canvas
const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

//resize canvas
canvas.width = 1000; //Math.min(window.innerHeight, window.innerWidth);
canvas.height = 1000; //Math.min(window.innerHeight, window.innerWidth);

//levels
const walls = [
  new Line(new Vector(0, 0), new Vector(0, canvas.height)),
  new Line(
    new Vector(canvas.width, 0),
    new Vector(canvas.width, canvas.height)
  ),
  /*new Line(
    new Vector(0, canvas.height),
    new Vector(canvas.width, canvas.height)
  ),*/
  new Line(new Vector(0, 0), new Vector(canvas.width, 0)),
];

const levels = [
  new Level(
    new BrickManager(
      [new Ball(new Vector(canvas.width / 2, 300), 10, new Vector(0, 10))],
      1000 / 10,
      1000 / 20,
      [
        [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      ],
      [...walls]
    ),
    [new Slider(new Vector(0, 900), new Vector(1000, 900), 300, 50, 0.01)]
  ),
  new Level(
    new BrickManager(
      [
        new Ball(new Vector(canvas.width / 2, 300), 10, new Vector(0, 10)),
        new Ball(new Vector(canvas.width / 2, 600), 10, new Vector(0, 10)),
      ],
      1000 / 10,
      1000 / 20,
      [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
      ],
      [...walls]
    ),
    [new Slider(new Vector(0, 900), new Vector(1000, 900), 300, 50, 0.01)]
  ),
  new Level(
    new BrickManager(
      [
        new Ball(new Vector(canvas.width / 2, 300), 10, new Vector(0, 10)),
        new Ball(new Vector(canvas.width / 2, 600), 10, new Vector(0, 10)),
      ],
      1000 / 10,
      1000 / 20,
      [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
      ],
      [...walls]
    ),
    [new Slider(new Vector(0, 900), new Vector(1000, 900), 300, 50, 0.01)]
  ),
  new Level( // /^\
    new BrickManager(
      [new Ball(new Vector(canvas.width / 2, 200), 5, new Vector(0, 5))],
      1000 / 20,
      1000 / 40,
      [[], [], [], [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]],
      [
        ...walls,
        new Polygon([
          new Vector(0, 0),
          new Vector((1000 / 20) * 7, (1000 / 40) * 4),
          new Vector(0, canvas.height),
        ]),
        new Polygon([
          new Vector(canvas.width, 0),
          new Vector((1000 / 20) * 13, (1000 / 40) * 4),
          new Vector(canvas.width, canvas.height),
        ]),
      ]
    ),
    [new Slider(new Vector(0, 900), new Vector(1000, 900), 50, 10, 0.006)]
  ),
  new Level(
    new BrickManager(
      [
        new Ball(new Vector(canvas.width / 2, 550), 10, new Vector(0, 10)),
        new Ball(new Vector(canvas.width / 2, 600), 10, new Vector(0, 10)),
      ],
      1000 / 10,
      1000 / 20,
      [
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
      ],
      [
        ...walls,
        new Polygon([
          new Vector(0, 0),
          new Vector(100 * 4, 50 * 6),
          new Vector(0, 50 * 4),
        ]),
        new Polygon([
          new Vector(canvas.width, 0),
          new Vector(canvas.width - 100 * 4, 50 * 6),
          new Vector(canvas.width, 50 * 4),
        ]),
        new Polygon([
          new Vector(100 * 4, 50 * 4),
          new Vector(100 * 6, 50 * 4),
          new Vector(100 * 5, 50 * 6),
        ]),
      ]
    ),
    [new Slider(new Vector(0, 900), new Vector(1000, 900), 300, 50, 0.01)]
  ),
  new Level(
    new BrickManager(
      [new Ball(new Vector(canvas.width / 2 + 10, 50), 10, new Vector(-5, 5))],
      1000 / 10,
      1000 / 20,
      [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
      ]
    ),
    [
      new Slider(new Vector(10, 10), new Vector(10, 990), 300, 50, 0.01),
      new Slider(new Vector(10, 990), new Vector(990, 990), 300, 50, 0.01),
      new Slider(new Vector(990, 10), new Vector(10, 10), 300, 50, 0.01),
      new Slider(new Vector(990, 990), new Vector(990, 10), 300, 50, 0.01),
    ]
  ),
  new Level(
    new BrickManager(
      [new Ball(new Vector(canvas.width / 2 + 10, 100), 10, new Vector(-2, 2))],
      1000 / 10,
      1000 / 20,
      [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
        [0, 0, 0, 2, 3, 3, 2, 0, 0, 0],
        [0, 0, 0, 2, 3, 3, 2, 0, 0, 0],
        [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
      ]
    ),
    [
      new Slider(new Vector(500, 10), new Vector(990, 700), 300, 50, 0.01),
      new Slider(new Vector(990, 700), new Vector(10, 700), 300, 50, 0.01),
      new Slider(new Vector(500, 10), new Vector(10, 700), 300, 50, 0.01),
    ]
  ),
];
//levels

const game = new GameManager(levels);
game.currentLevel = 6;
game.start();
