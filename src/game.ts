import * as Phaser from "phaser"
import * as Model from "./model"
import * as Levels from "./levels"

const gameWidth = 800
const gameHeight = 600
const roadWidth = 400
const gateHeight = 40
const squareScale = 10
const textStyle = { fontFamily: 'Courier, serif', color: '#000', fontSize: '28px' }

const initialScore = 10

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
let cursors: Phaser.Types.Input.Keyboard.CursorKeys


let level: Model.Level = Levels.levels[levelFromUrl(window.location.search)]

const gateSpeed = level.gateSpeed
const squareSpeed = level.squareSpeed

function preload() {
  this.load.image('sky', require("./assets/sky.png"))
  this.load.image('road', require("./assets/road.png"))
  this.load.image('gate_half', require("./assets/gate_half.png"))
  this.load.image('square', require("./assets/square.png"))
}

function create() {
  cursors = this.input.keyboard.createCursorKeys()

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
      displayedGate.setVelocityY(10 * gateSpeed)
      displayedText.setOrigin(0.5)

      gate.displayed = displayedGate
      gate.text = displayedText
      gate.weight = -1 // default value indicating that the gate has not been collected yet
      i += 1
    }
  }
}

function update() {
  let score = initialScore
  let opsText: string = initialScore.toString() + "\n"

  for (let gateLine of level.gateLines) {
    for (let gate of gateLine.gates) {
      // update position of text on gates
      gate.text.x = gate.displayed.x
      gate.text.y = gate.displayed.y

      if (gate.weight == -1) {
        // if reached by the square
        if (gate.displayed.y + gateHeight / 2 >= square.y - square.displayHeight / 2) {
          gate.weight = overlap(square.x, square.displayWidth, gate.displayed.x, gate.displayed.displayWidth)
        }
      }
    }

    score = applyLineOperations(score, gateLine)
    opsText += gateLineOperationsString(gateLine)
  }

  square.displayWidth = Math.sqrt(score) * squareScale
  square.displayHeight = Math.sqrt(score) * squareScale

  collectedOperationsText.setText(opsText)
  scoreText.setText("= " + (Math.round(score * 100) / 100).toString())

  // move square
  if (cursors.left.isDown) {
    square.setVelocityX(-10 * squareSpeed)
  }
  else if (cursors.right.isDown) {
    square.setVelocityX(10 * squareSpeed)
  }
  else {
    square.setVelocityX(0)
  }
  // keep square on road
  if (square.x + square.displayWidth / 2 >= gameWidth / 2 + roadWidth / 2) {
    square.x = gameWidth / 2 + roadWidth / 2 - square.displayWidth / 2
  }
  if (square.x - square.displayWidth / 2 <= gameWidth / 2 - roadWidth / 2) {
    square.x = gameWidth / 2 - roadWidth / 2 + square.displayWidth / 2
  }
}


// return the proportion of A which overlaps with B
// TODO fix the missing overlap due to the space between the gates
function overlap(centerA: number, widthA: number, centerB: number, widthB: number): number {
  let maxLeft = Math.max(centerA - widthA / 2, centerB - widthB / 2)
  let minRight = Math.min(centerA + widthA / 2, centerB + widthB / 2)
  let distanceOverlapping = Math.max(minRight - maxLeft, 0)

  return distanceOverlapping / widthA
}

function applyLineOperations(x: number, gateLine: Model.GateLine): number {
  if (gateLine.gates[0].weight == -1) {
    return x
  } else {
    let result = 0
    for (let gate of gateLine.gates) {
      if (gate.weight > 0) {
        result += applyOperation(x * gate.weight, gate)
      }
    }
    return result
  }
}

function applyOperation(x: number, gate: Model.Gate): number {
  switch (gate.operation) {
    case Model.Operation.Multiplication:
      return x * gate.magnitude
    case Model.Operation.Division:
      return x / gate.magnitude
    case Model.Operation.Addition:
      return x + gate.magnitude
    case Model.Operation.Substraction:
      return x - gate.magnitude
    case Model.Operation.Power:
      return Math.pow(x, gate.magnitude)
  }
}

function gateLineOperationsString(gateLine: Model.GateLine): string {
  let enabled: number[] = gateLine.gates.map(g => { if (g.weight > 0) { return 1 } else { return 0 } })
  let sumEnabled = enabled.reduce((a, b) => a + b)

  let result = ""

  if (sumEnabled > 1) {
    result = ""
    for (let gate of gateLine.gates) {
      if (gate.weight > 0) {
        if (result == "")
          result += "+"
        else
          result += " "
        result += " _*" + (Math.round(gate.weight*10)/10).toString() + " " + gate.operation.toString() + " " + gate.magnitude.toString() + "\n"
      }
    }
    result
  } else {
    for (let gate of gateLine.gates) {
      if (gate.weight > 0) {
        result = gate.operation.toString() + " " + gate.magnitude.toString() + "\n"
      }
    }
  }
  return result
}

function levelFromUrl(queryString: string): number {
  const urlParams = new URLSearchParams(queryString)
  const level = urlParams.get("level")
  console.log(+level)
  if (level != "" && +level != NaN) {
    return +level
  } else {
    return 0
  }
}