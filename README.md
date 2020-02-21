# _MLB2K19-API_ aims to help casual fans not make fools of themselves by saying that Derek Jeter is still playing in MLB to friends for example (uses Sean Lahman's database accurate up till end of 2019 season). This is the backend part in the works.

endpoints _'/pitching/player'_ and _'/batting/player'_ are what the frontend currently fetches right now in order to get pitching and batting stats of a player queried for respectively.

## Technologies Used

- Postgres as SQL/relational database (loaded latest baseball data (comma-delimited version) from http://www.seanlahman.com/baseball-archive/statistics/ into a postgresdb)
- Node and Express for the backend server
- knex.js module in order to communicate between Postgres and Express server

## Improvements to be Made

- deployment
- possibly use aws relational db
