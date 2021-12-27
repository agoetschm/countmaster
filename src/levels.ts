import * as Model from "./model"

export const levels: Model.Level[] = [
  {
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
    ],
    squareSpeed: 10,
    gateSpeed: 10,
  }
]