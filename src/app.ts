import * as api from './data/api'
import { logBlue } from './utils/console'
import { transformRecords } from './data/transformers/response'

main()

async function main() {
  try {
    await api.clearDatabase()
    await api.createData()
    await api.createInMemoryTable()

    // 1. Surasti esybes pagal savybę (pvz. rasti asmenį pagal asmens kodą, rasti banko sąskaitą pagal numerį).

    await executeAndLog(
      "1. Get all airlines with prefix 'Airline-'",
      `MATCH (airline:Airline) WHERE airline.name CONTAINS 'Airline-' RETURN airline.name as airlineName`
    )

    // 2. Surasti esybes pagal ryšį (pvz. banko sąskaitas priklausančias asmeniui, banko korteles susietas su konkretaus asmens sąskaitomis).

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

    // 3. Surasti esybes susietas giliais sąryšiais (pvz. draugų draugus, visus kelius tarp Vilniaus ir Klaipėdos; visus autobusus kuriais galima nuvažiuoti iš stotelės X į stotelę Y).

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

    // 4. Surasti trumpiausią kelią (pvz. surasti trumpiausią kelią tarp Vilniaus ir Klaipėdos; surasti pigiausią būdą konvertuoti iš valiutos X į valiutą Y, kuomet turima visų bankų konversijos informacija ir optimalus būdas, gali būti atlikti kelis žingsnius).

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

    // 5. Agreguojami duomenys (pvz. kaip 2.4, tik surasti kelio ilgį ar konversijos kainą). Nenaudokite trumpiausio kelio.

    await executeAndLog(
      '5. Find cheapest flight from Antalya to Cairo',

      `MATCH (start:City{name:'Antalya'}), (end:City{name:'Cairo'}),
        flights = allShortestPaths((start) -[:FLIGHT]-> (end))
      RETURN start.name AS start, end.name AS end,
        apoc.coll.sum([rel in relationships(flights) | rel.price]) as price,
        [node IN nodes(flights) | node.name] AS cityNames
      ORDER BY price ASC
      LIMIT 1`
    )

    // 5.1.. Agreguojami duomenys (pvz. kaip 2.4, tik surasti kelio ilgį ar konversijos kainą). Nenaudokite trumpiausio kelio.

    await executeAndLog(
      '5.1. Find cheapest flight from Antalya to Cairo',

      `MATCH (start:City{name:'Antalya'}), (end:City{name:'Cairo'}),
        flights = allShortestPaths((start) -[:FLIGHT*]-> (end))
      RETURN start.name AS start, end.name AS end,
        REDUCE(sum = 0, flight IN RELATIONSHIPS(flights) | sum + flight.price) AS price,
        [node IN nodes(flights) | node.name] AS cityNames
      ORDER BY price ASC
      LIMIT 1`,
      ['price']
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
