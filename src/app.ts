import * as api from './data/api'
import { logBlue } from './utils/console'
import { transformRecords } from './data/transformers/response'

main()

async function main() {
  try {
    await api.clearDatabase()
    await api.createData()
    await api.createInMemoryTable()

    // 1. Find entities by property (e.g. find person by personal code, find bank account by number).

    await executeAndLog(
      "1. Get all airlines with prefix 'Airline-'",
      `MATCH (airline:Airline) WHERE airline.name CONTAINS 'Airline-' RETURN airline.name as airlineName`
    )

    await executeAndLog(
      "1.1. Get airline 'Airline-A'",
      `MATCH (airline:Airline) WHERE airline.name = 'Airline-A' RETURN airline`
    )

    // 2. Find entities by connection (e.g. bank accounts belonging to a person, bank cards linked to the accounts of a specific person).

    await executeAndLog(
      "2. Find airline stops for airline 'Airline-B'",

      `MATCH (airline:Airline {name: 'Airline-B'}) -[:FLIES_TO]-> (city)
      RETURN city.name as cityName`
    )

    await executeAndLog(
      "2.1. Find all airlines that fly to 'Antalya'",

      `MATCH (airline:Airline) -[:FLIES_TO]-> (city:City {name: 'Antalya'})
      RETURN airline.name as airlineName`
    )

    await executeAndLog(
      '2.2. Find airlines that fly to Antalya and have a flight to Istanbul',

      `MATCH (airline:Airline) -[:FLIES_TO]-> (city:City {name: 'Antalya'})
      WITH airline
      MATCH (airline) -[:FLIES_TO]-> (city:City {name: 'Boston'})
      RETURN airline.name as airlineName`
    )

    // 3. Find entities linked by deep relationships (eg friends of friends, all roads between Vilnius and Klaipėda; all buses that can go from stop X to stop Y).

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

    // 4. Find the shortest path by evaluating the weights (e.g. finding the shortest path between Vilnius and Klaipėda; finding the cheapest way to convert from currency X to currency Y, when the conversion information of all banks is available and the optimal way can be performed in several steps).
    // 5. Data aggregation

    await executeAndLog(
      '4 and 5. Find cheapest flight from Antalya to Cairo',

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

    await executeAndLog(
      '5. Find shortest flight from Antalya to Cairo',

      `MATCH (start:City{name:'Antalya'}), (end:City{name:'Cairo'}),
        flights = allShortestPaths((start) -[:FLIGHT]-> (end))
      RETURN start.name AS start, end.name AS end,
        apoc.coll.sum([rel in relationships(flights) | rel.price]) as price,
        [node IN nodes(flights) | node.name] AS cityNames
      ORDER BY price ASC`
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
  integerProperties?: T
) => {
  logBlue(description)

  const records = await api.getRecords(query)
  const transformedRecords = transformRecords(records, integerProperties)

  console.log(JSON.stringify(transformedRecords, null, 2))
}
