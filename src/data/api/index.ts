import neo4j from 'neo4j-driver'

import initialData from '../mocks/initial-data'
import { GRAPH_NAME } from '../../constants/graph'
import type { Entity } from '../../types/record'

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', '1')
)
const session = driver.session()

export const clearDatabase = async () => {
  await session.run('MATCH (a) -[r]-> () DELETE a, r')
  await session.run('MATCH (a) DELETE a')
  await session.run(`CALL gds.graph.drop("${GRAPH_NAME}", false)`)
}

export const closeSession = async () => {
  await session.close()
  await driver.close()
}

export const createInMemoryTable = () =>
  session.run(`
  CALL gds.graph.project(
    '${GRAPH_NAME}',
    'City',
    'PATH',
    { relationshipProperties: 'price' }
)
    `)

export const createData = () => session.run(initialData)

export const getRecords = async <T extends string[]>(
  query: string
): Promise<Entity<T>[]> => {
  const result = await session.run(query)
  const transformedResult = result.records.map((record) =>
    record.toObject()
  ) as Entity<T>[]

  return transformedResult
}
