import { SHAPES } from "../../utils.js";
const { TRIANGLE, SQUARE, DIAMOND, PELOTA } = SHAPES;

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.shapesRecolected = {
      [TRIANGLE]: { count: 0, score: 50 },
      [SQUARE]: { count: 0, score: 40 },
      [DIAMOND]: { count: 0, score: 30 },
      [PELOTA]: { count: 0, score: 100 },
    };
  }

  preload() {
    this.load.image("sky", "./assets/image/sky.png");
    this.load.image("platform", "./assets/image/platform.png");
    this.load.image("ninja", "./assets/image/ninja.png");
    this.load.image(SQUARE, "./assets/image/square.png");
    this.load.image(DIAMOND, "./assets/image/diamond.png");
    this.load.image(TRIANGLE, "./assets/image/triangle.png");
    this.load.image(PELOTA, "./assets/image/pelota.png");
  }

  create() {
    //add background
    this.add.image(400, 300, "sky").setScale(1);

    //add static platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "platform").setScale(2).refreshBody();

    //add shapes
    this.shapesGroup = this.physics.add.group();

    //add player
    this.player = this.physics.add.sprite(100, 450, "ninja");
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, this.shapesGroup);
    this.physics.add.collider(platforms, this.shadesGroup);
    //add event
    this.time.addEvent({
      delay: 1500,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape,
      null,
      this
    );
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-500);
    } else {
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(500);
      } else {
        this.player.setVelocityX(0);
      }
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-250);
    }
  }

  addShape() {
    const randomShape = Phaser.Math.RND.pick([
      "diamond",
      "square",
      "triangle",
      "pelota",
    ]);
    const randomX = Phaser.Math.RND.between(0, 800);
    if (randomShape === "pelota") {
      this.shapesGroup.create(randomX, 0, randomShape).setScale(0.05);
    } else {
      this.shapesGroup.create(randomX, 0, randomShape);
    }
    console.log("shape is added", randomX, randomShape);
  }

  collectShape(player, shape) {
    shape.disableBody(true, true);
    const ShapeName = shape.texture.key;
    this.shapesRecolected[ShapeName].count++;
    console.log(this.shapesRecolected);
  }
}
