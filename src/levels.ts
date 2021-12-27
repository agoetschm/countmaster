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
      {
        gates: [
          {
            operation: Model.Operation.Multiplication,
            magnitude: 0
          },
          {
            operation: Model.Operation.Multiplication,
            magnitude: 1
          }
        ],
        position: 700,
      },
      {
        gates: [
          {
            operation: Model.Operation.Multiplication,
            magnitude: 1
          },
          {
            operation: Model.Operation.Multiplication,
            magnitude: 0
          },
          {
            operation: Model.Operation.Multiplication,
            magnitude: 1
          }
        ],
        position: 900,
      },
      {
        gates: [
          {
            operation: Model.Operation.Division,
            magnitude: 2
          },
          {
            operation: Model.Operation.Substraction,
            magnitude: 10
          }
        ],
        position: 1100,
      },
      {
        gates: [
          {
            operation: Model.Operation.Power,
            magnitude: 2
          },
          {
            operation: Model.Operation.Multiplication,
            magnitude: 10
          }
        ],
        position: 1300,
      },
    ],
    squareSpeed: 20,
    gateSpeed: 10,
  }
]