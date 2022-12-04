import { toString } from 'neo4j-driver-core'

export const transformRecords = <T extends Array<string>>(
  records: Array<Record<string, any>>,
  properties?: T
) => {
  if (!properties) return records

  return records.map((record: any) => {
    const newRecord = { ...record }

    properties.forEach((property) => {
      const identity = newRecord[property].identity

      if (identity) {
        newRecord[property].identity = toString(identity)
      }
    })

    return newRecord
  })
}
