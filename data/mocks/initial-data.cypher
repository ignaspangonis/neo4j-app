// Remove all relationships
MATCH (a) -[r] -> () DELETE a, r

// Delete all entities
MATCH (a) DELETE a

// Delete inMemoty table
CALL gds.graph.drop("myGraph", false)

/////////////////////////////////////////////////////////

MERGE (a:City {name: 'A'})
MERGE (b:City {name: 'B'})
MERGE (c:City {name: 'C'})
MERGE (d:City {name: 'D'})
MERGE (e:City {name: 'E'})
MERGE (f:City {name: 'F'})
MERGE (a) -[:PATH {cost: 10}]-> (b)
MERGE (a) -[:PATH {cost: 7}]-> (c)
MERGE (a) -[:PATH {cost: 10}]-> (d)
MERGE (a) -[:PATH {cost: 150}]-> (d)
MERGE (a) -[:PATH {cost: 200}]-> (e)
MERGE (b) -[:PATH {cost: 15}]-> (c)
MERGE (c) -[:PATH {cost: 5}]-> (a)
MERGE (c) -[:PATH {cost: 150}]-> (a)
MERGE (d) -[:PATH {cost: 8}]-> (a)
MERGE (d) -[:PATH {cost: 10}]-> (e)
MERGE (e) -[:PATH {cost: 150}]-> (a)
MERGE (e) -[:PATH {cost: 1500}]-> (a)
MERGE (e) -[:PATH {cost: 10}]-> (f)
MERGE (f) -[:PATH {cost: 15}]-> (e)
MERGE (planeA:Plane {name: 'Plane-A'})
MERGE (planeB:Plane {name: 'Plane-B'})
MERGE (planeC:Plane {name: 'Plane-C'})
MERGE (planeD:Plane {name: 'Plane-D'})
MERGE (planeA) -[:STOPS_AT]-> (a)
MERGE (planeA) -[:STOPS_AT]-> (b)
MERGE (planeA) -[:STOPS_AT]-> (c)
MERGE (planeB) -[:STOPS_AT]-> (a)
MERGE (planeB) -[:STOPS_AT]-> (c)
MERGE (planeB) -[:STOPS_AT]-> (d)
MERGE (planeC) -[:STOPS_AT]-> (a)
MERGE (planeC) -[:STOPS_AT]-> (d)
MERGE (planeC) -[:STOPS_AT]-> (e)
MERGE (planeD) -[:STOPS_AT]-> (a)
MERGE (planeD) -[:STOPS_AT]-> (e)
MERGE (planeD) -[:STOPS_AT]-> (f)

// Create inMemory table
CALL gds.graph.project(
    'myGraph',
    'City',
    'PATH',
    { relationshipProperties: 'cost' }
)

/////////////////////////////////////////////////////////

// 0. Show database content
MATCH (n) RETURN n

// 1. Find planeses by name
MATCH (plane:Plane {name:'Plane-A'})
RETURN plane

// 2. Find planeses by partial name
MATCH (plane:Plane) WHERE plane.name CONTAINS 'Plane-'
RETURN plane

// 3. Find plane stops for a plane 'Plane-B'
MATCH cities = (plane:Plane {name: 'Plane-B'}) -[:STOPS_AT]- (city)
RETURN cities, city.name as cityName

// 4. Find planeses to get from city 'A' to city 'F'
MATCH (start:City {name:'C'}), (finish:City {name:'F'})
MATCH paths = allShortestPaths((start) -[:STOPS_AT*]- (finish))
RETURN paths,
  [node IN nodes(paths) | CASE
    WHEN node:City THEN 'City ' + node.name
    WHEN node:Plane THEN 'Plane ' + node.name
    ELSE '' END] AS nodeNames

// 5. Find stops from city to city with max number of hops
MATCH cities = (start:City {name:'A'}) -[road:PATH *..3]-> (finish:City {name:'F'})
RETURN cities,
  size(relationships(cities)) AS numHops,
  [node IN nodes(cities) | node.name] AS cityNames,
  [r IN relationships(cities) | r.cost] AS costs,
  apoc.coll.sum([r IN relationships(cities) | r.cost]) AS totalCost
ORDER BY numHops, totalCost

// 6. Find cheapest path from city to city
MATCH (start:City {name: 'B'}), (finish:City {name: 'F'})
CALL gds.shortestPath.dijkstra.stream('myGraph', {
  sourceNode: start,
  targetNode: finish,
  relationshipWeightProperty: 'cost' // REMOVE THIS FOR UNWEIGHTED GRAPH
})
YIELD index, totalCost, costs, nodeIds, path
RETURN
  totalCost,
  costs,
  [nodeId IN nodeIds | gds.util.asNode(nodeId).name] AS nodeNames,
  size(nodeIds) as nodeCount,
  nodes(path) as path

// 7. Find shortest path from city to city







## 2.4. Surasti trumpiausia kelią MIN/MAX kaina
# shortest path -> 230
# largest path  -> 375

MATCH
(start:City{name:'B'}),
(end:City{name:'F'}),
paths = allShortestPaths((start) -[:PATH*]-> (end))
RETURN paths, REDUCE(sum = 0, road IN RELATIONSHIPS(paths) | sum + road.cost) AS cost, [node IN nodes(paths) | node.name] AS cityNames
ORDER BY cost ASC

OR

MATCH (start:City{name:'B'}), (end:City{name:'F'}),
  paths = allShortestPaths((start) -[:PATH*]-> (end))
RETURN paths,
  apoc.coll.sum([rel in relationships(paths) | rel.cost]) as cost,
  [node IN nodes(paths) | node.name] AS cityNames
ORDER BY cost ASC

-------







match (n:Plane)
where
return n
