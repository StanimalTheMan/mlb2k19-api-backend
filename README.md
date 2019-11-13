# *MLB2K18-API* aims to help casual fans not make fools of themselves by saying that Derek Jeter is still playing in MLB to friends for example (uses Sean Lahman's database accurate up till end of 2018 season).  This is the backend part in the works.

endpoints _'/pitching/player'_ and _'/batting/player'_ are what the frontend currently fetches right now in order to get pitching and batting stats of a player queried for respectively.

## technologies currently in use
* Postgres as SQL/relational database
* Node and Express for the backend server
* knex.js module in order to communicate between Postgres and Express server
