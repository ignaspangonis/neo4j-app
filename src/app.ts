import * as api from './data/api'
import { logBlue } from './utils/console'
import { transformRecords } from './data/transformers/response'

main()

async function main() {
  try {
    await api.clearDatabase()
    await api.createData()
    await api.createInMemoryTable()

    await executeAndLog(
      "1. Get all airlines with prefix 'Airline-'",
      `MATCH (airline:Airline) WHERE airline.name CONTAINS 'Airline-' RETURN airline.name as airlineName`,
      ['airlineName']
    )

    await executeAndLog(
      "2. Find airline stops for airline 'Airline-B'",
      `MATCH (airline:Airline {name: 'Airline-B'}) -[:FLIES_TO]-> (city)
      RETURN city.name as cityName`,
      ['cityName']
    )

    await executeAndLog(
      "2.1. Find all airlines that fly to 'Antalya'",
      `MATCH (airline:Airline) -[:FLIES_TO]-> (city:City {name: 'Antalya'})
      RETURN airline.name as airlineName`,
      ['airlineName']
    )

    await executeAndLog(
      '2.2. Find airlines that fly to Antalya and have a flight to Istanbul',
      `MATCH (airline:Airline) -[:FLIES_TO]-> (city:City {name: 'Antalya'})
      WITH airline
      MATCH (airline) -[:FLIES_TO]-> (city:City {name: 'Boston'})
      RETURN airline.name as airlineName`,
      ['airlineName']
    )

    await executeAndLog(
      '3. Find all flights from Antalya to Cairo',
      `MATCH cities = (start:City {name:'Antalya'}) -[:FLIGHT *..2]-> (finish:City {name:'Cairo'})
      RETURN
        size(relationships(cities)) AS numHops,
        [node IN nodes(cities) | node.name] AS cityNames,
        [r IN relationships(cities) | r.price] AS prices,
        apoc.coll.sum([r IN relationships(cities) | r.price]) AS totalPrice
      ORDER BY numHops, totalPrice`
    )

    await executeAndLog(
      '4. Find cheapest flight from Antalya to Cairo',

      `MATCH (start:City {name:'Antalya'}), (finish:City {name:'Cairo'})
      CALL gds.shortestPath.dijkstra.stream('myGraph', {
        sourceNode: start,
        targetNode: finish,
        relationshipWeightProperty: 'price'
      })
      YIELD index, totalCost, costs, nodeIds, path
      RETURN
        totalCost,
        costs,
        [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS nodeNames,
        size(nodeIds) as nodeCount,
        nodes(path) as path`
    )
  } catch (error) {
    console.error(error)
  } finally {
    await api.closeSession()
  }
}

const executeAndLog = async <T extends string[]>(
  description: string,
  query: string,
  properties?: T
) => {
  logBlue(description)

  const records = await api.getRecords(query)
  const transformedRecords = transformRecords(records, properties)

  console.log(JSON.stringify(transformedRecords, null, 2))
}
