# Neo4j app

The purpose of this program is to test out capabilities of the most popular graph database - [Neo4J](https://neo4j.com/).

## Task

Write a simple program implementing scope suitable for graph databases.

1. Model at least a few entities with properties.
2. Demonstrate meaningful requests:
    1. Find entities by attribute (eg find a person by personal identification number, find a bank account by number).
    2. Find entities by connection (e.g. bank accounts belonging to a person, bank cards linked to the accounts of a specific person).
    3. Find entities linked by deep ties (eg friends of friends, all roads between Vilnius and Klaipėda; all buses that can go from stop X to stop Y).
    4. Find the shortest path (e.g. find the shortest path between Vilnius and Klaipėda; find the cheapest way to convert from currency X to currency Y, when the conversion information of all banks and the optimal method are available, several steps can be performed).
    5. Aggregate data (e.g. as 4, only to find the path length or conversion price). Don't take the shortest path.

For simplicity, have test data ready. The app should allow you to make queries (say entering city X, city Y and planning a route between them).

## Prerequisites

- Install [node.js](https://nodejs.org/en/)
- Install [neo4j](https://formulae.brew.sh/cask/neo4j): `brew install neo4j`
- Install [neo4j Desktop](https://neo4j.com/download/)
  - Launch **neo4j Desktop** and create a project and a database
  - Install **APOC**, **Graph Data Science Library**, **Neo4j Streams** plugins

## Launch program

1. Launch **neo4J Desktop** and start project server manually.
2. Install npm modules: `npm install`
3. Execute the program: `npm run start`
