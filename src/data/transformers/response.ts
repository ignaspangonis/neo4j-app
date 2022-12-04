import { toString } from 'neo4j-driver-core'

import { Entity } from 'types/record'

export const transformRecords = <T extends Array<string>>(
  records: Array<Entity<T>>,
  properties: T
) =>
  records.map((record: any) => {
    const transformedRecord = properties.reduce((acc, property) => {
      const { identity, ...rest } = record[property]

      return {
        ...acc,
        [property]: {
          ...rest,
          identity: toString(identity)
        }
      }
    }, {})

    return transformedRecord
  })
