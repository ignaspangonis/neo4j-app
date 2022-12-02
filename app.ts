import * as api from './src/data/api'
import { logBlue } from './src/utils/console'

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
      'p'
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
  const transformedResult = result.map((record) => {
    const { identity, ...rest } = record[property]

    return {
      identity: Number(identity),
      ...rest
    }
  })

  console.log(transformedResult)
}
