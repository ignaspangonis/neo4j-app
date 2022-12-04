import { Integer } from 'neo4j-driver'

type Label = 'City' | 'Plane'

export type Entity<T extends string[]> = {
  [P in T[number]]: {
    elementId: string
    identity: Integer
    labels: Label[]
    properties: {
      name: string
    }
  }
}
