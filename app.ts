import * as api from './data/api'
import { logBlue } from './utils/console'

main()

async function main() {
  try {
    await api.clearDatabase()
    await api.createData()
    await api.createInMemoryTable()

    logBlue(`1. Find all nodes:`)
    console.log(await api.getRecords('MATCH (n) RETURN n'))
  } catch (error) {
    console.error(error)
  } finally {
    await api.closeSession()
  }
}
