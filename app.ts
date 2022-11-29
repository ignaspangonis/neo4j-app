import * as api from './data/api'
import { logBlue } from './utils/console'
import type { Record } from './types/record'

main()

async function main() {
  try {
    await api.clearDatabase()
    await api.createData()
    await api.createInMemoryTable()

    await executeAndLog('1. Get all nodes:', 'MATCH (n) RETURN n', 'n')

    await executeAndLog(
      "2. Get all planes with prefix 'Plane-':",
      "MATCH (p:Plane) WHERE p.name CONTAINS 'Plane-' RETURN p",
      'n'
    )
  } catch (error) {
    console.error(error)
  } finally {
    await api.closeSession()
  }
}

const executeAndLog = async <T extends string>(
  description: string,
  query: string,
  property: T
) => {
  logBlue(description)

  const result = await api.getRecords<T>(query)

  console.log(
    result.map((record) => {
      const { elementId, identity, labels, properties } = record[property]

      return {
        elementId,
        identity: Number(identity),
        labels,
        properties
      }
    })
  )
}
