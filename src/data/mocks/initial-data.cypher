MERGE (a:City {name: 'Antalya'})
MERGE (b:City {name: 'Boston'})
MERGE (c:City {name: 'Cairo'})
MERGE (d:City {name: 'Dubai'})
MERGE (e:City {name: 'Edinburgh'})
MERGE (f:City {name: 'Frankfurt'})
MERGE (a) -[:FLIGHT {price: 170}]-> (b)
MERGE (a) -[:FLIGHT {price: 1290}]-> (c)
MERGE (a) -[:FLIGHT {price: 290}]-> (c)
MERGE (a) -[:FLIGHT {price: 100}]-> (d)
MERGE (a) -[:FLIGHT {price: 150}]-> (d)
MERGE (a) -[:FLIGHT {price: 200}]-> (e)
MERGE (b) -[:FLIGHT {price: 150}]-> (c)
MERGE (c) -[:FLIGHT {price: 500}]-> (a)
MERGE (c) -[:FLIGHT {price: 150}]-> (a)
MERGE (d) -[:FLIGHT {price: 80}]-> (a)
MERGE (d) -[:FLIGHT {price: 100}]-> (e)
MERGE (e) -[:FLIGHT {price: 150}]-> (a)
MERGE (e) -[:FLIGHT {price: 180}]-> (a)
MERGE (e) -[:FLIGHT {price: 100}]-> (f)
MERGE (f) -[:FLIGHT {price: 150}]-> (e)
MERGE (airlineA:Airline {name: 'Airline-A'})
MERGE (airlineB:Airline {name: 'Airline-B'})
MERGE (airlineC:Airline {name: 'Airline-C'})
MERGE (airlineD:Airline {name: 'Airline-D'})
MERGE (airlineA) -[:FLIES_TO]-> (a)
MERGE (airlineA) -[:FLIES_TO]-> (b)
MERGE (airlineA) -[:FLIES_TO]-> (c)
MERGE (airlineB) -[:FLIES_TO]-> (a)
MERGE (airlineB) -[:FLIES_TO]-> (c)
MERGE (airlineB) -[:FLIES_TO]-> (d)
MERGE (airlineC) -[:FLIES_TO]-> (a)
MERGE (airlineC) -[:FLIES_TO]-> (d)
MERGE (airlineC) -[:FLIES_TO]-> (e)
MERGE (airlineD) -[:FLIES_TO]-> (a)
MERGE (airlineD) -[:FLIES_TO]-> (e)
MERGE (airlineD) -[:FLIES_TO]-> (f)
