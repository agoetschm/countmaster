import * as Phaser from "phaser"
import * as Model from "./model"

const gameWidth = 800
const gameHeight = 600
const roadWidth = 400
const gateHeight = 40
const speed: number = 10
const squareScale = 3
const textStyle = { fontFamily: 'Courier, serif', color: '#000', fontSize: '28px' }

const config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

const game: Phaser.Game = new Phaser.Game(config)
let square: Phaser.Physics.Matter.Sprite

let collectedOperationsText: Phaser.GameObjects.Text
let scoreText: Phaser.GameObjects.Text
let initialScore: number = 10

let cursors: Phaser.Types.Input.Keyboard.CursorKeys


let level: Model.Level = {
  gateLines: [
    {
      gates: [
        {
          operation: Model.Operation.Addition,
          magnitude: 2
        }
      ],
      position: 0,
    },
    {
      gates: [
        {
          operation: Model.Operation.Division,
          magnitude: 2
        }
      ],
      position: 200,
    },
    {
      gates: [
        {
          operation: Model.Operation.Multiplication,
          magnitude: 5
        },
        {
          operation: Model.Operation.Addition,
          magnitude: 10
        }
      ],
      position: 400,
    },
  ]
}

function preload() {
  this.load.image('sky', require("./assets/sky.png"))
  this.load.image('road', require("./assets/road.png"))
  this.load.image('gate_half', require("./assets/gate_half.png"))
  this.load.image('square', require("./assets/square.png"))
}

function create() {
  this.add.image(gameWidth / 2, gameHeight / 2, 'sky')
  this.add.image(gameWidth / 2, gameHeight / 2, 'road')

  scoreText = this.add.text(10, gameHeight - 40, "", textStyle)
  collectedOperationsText = this.add.text(10, 10, "", textStyle)

  square = this.physics.add.sprite(gameWidth / 2, gameHeight * 2 / 3, 'square')

  for (let gateLine of level.gateLines) {
    const numOfGates = gateLine.gates.length
    const gateWidth = roadWidth / numOfGates

    let i = 0
    for (let gate of gateLine.gates) {
      let gateXPosition = gameWidth / 2 - roadWidth / 2 + i * gateWidth + 0.5 * gateWidth
      let gateYPosition = - gateLine.position
      let gateOperationText = gate.operation.toString() + " " + gate.magnitude.toString()

      let displayedGate: Phaser.Physics.Matter.Sprite = this.physics.add.sprite(gateXPosition, gateYPosition, "gate_half")
      let displayedText = this.add.text(gateXPosition, gateYPosition, gateOperationText, textStyle)

      displayedGate.displayWidth = gateWidth - 5 // remove a bit to see the separation between the gates
      displayedGate.setVelocityY(10 * speed)
      displayedText.setOrigin(0.5)

      gate.displayed = displayedGate
      gate.text = displayedText
      gate.weight = -1 // default value indicating that the gate has not been collected yet
      i += 1
    }
  }

  cursors = this.input.keyboard.createCursorKeys()
}

function update() {
  // move square
  if (cursors.left.isDown) {
    square.setVelocityX(-50)
  }
  else if (cursors.right.isDown) {
    square.setVelocityX(50)
  }
  else {
    square.setVelocityX(0)
  }


  let score = initialScore
  let opsText: string = ""

  for (let gateLine of level.gateLines) {
    for (let gate of gateLine.gates) {
      // update position of text on gates
      gate.text.x = gate.displayed.x
      gate.text.y = gate.displayed.y


      if (gate.weight == -1) {
        // if reached by the square
        if (gate.displayed.y + gateHeight / 2 >= square.y - square.displayHeight / 2) { 
          if (overlap(square.x, square.displayWidth, gate.displayed.x, gate.displayed.displayWidth)) {
            gate.weight = 1
          } else {
            gate.weight = 0
          }
        }
      }

      if (gate.weight > 0) {
        opsText += gate.operation.toString() + " " + gate.magnitude.toString() + "\n"
        score = applyOperation(score, gate.operation, gate.magnitude)
      }
    }
  }

  collectedOperationsText.setText(opsText)

  scoreText.setText(score.toString())
  square.displayWidth = score * squareScale
  square.displayHeight = score * squareScale
}

function overlap(centerA: number, widthA: number, centerB: number, widthB: number): boolean {
  return (centerA - widthA / 2 <= centerB + widthB / 2 && centerA + widthA / 2 >= centerB - widthB / 2) ||
    (centerA + widthA / 2 >= centerB - widthB / 2 && centerA - widthA / 2 <= centerB + widthB / 2)
}

function applyOperation(x: number, op: Model.Operation, a: number) {
  switch (op) {
    case Model.Operation.Multiplication:
      return x * a
    case Model.Operation.Division:
      return x / a
    case Model.Operation.Addition:
      return x + a
    case Model.Operation.Substraction:
      return x - a
  }
}