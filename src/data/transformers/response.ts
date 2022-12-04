import { toString } from 'neo4j-driver-core'

export const transformRecords = <T extends Array<string>>(
  records: Array<Record<string, any>>,
  properties?: T
) => {
  if (!properties) return records

  return records.map((record) => {
    const newRecord = { ...record }

    properties.forEach((property) => {
      const propertyToFormat = newRecord[property]

      if (propertyToFormat) {
        newRecord[property] = toString(propertyToFormat)
      }
    })

    return newRecord
  })
}
