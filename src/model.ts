export type Level = {
  gateLines: GateLine[]
  end: number
  squareSpeed: number
  gateSpeed: number
}

export type GateLine = {
  gates: Gate[]
  position: number
}

export type Gate = {
  operation: Operation
  magnitude: number
  displayed?: Phaser.Physics.Matter.Sprite
  text?: Phaser.GameObjects.Text
  weight?: number // proportion of the square which passed by the gate
};

export enum Operation {
  Multiplication = "×",
  Division = "÷",
  Addition = "+",
  Substraction = "-",
  Power = "^",
  Root = "root", // TODO
  // Exponentiation,
  // Logarithm
}
