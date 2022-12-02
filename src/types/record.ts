import { Integer } from 'neo4j-driver'

type Label = 'City' | 'Plane'

export type Record<T extends string> = {
  [P in T]: {
    elementId: string
    identity: Integer
    labels: Label[]
    properties: {
      name: string
    }
  }
}
