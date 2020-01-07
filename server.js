const express = require('express');
require('dotenv').config()
const knex = require('knex');
const cors = require('cors');

const db = knex({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
  }
});


const app = express();

app.use(cors());

/*
function isEmpty(obj) {
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}
*/

/*
function getFinalActiveData(activeData) {
  const activeFinalData = activeData.map(activeDataEntry => {
    return {'id': activeDataEntry.playerID, 'firstname': activeDataEntry.nameFirst, 'lastname': activeDataEntry.nameLast, 'team': activeDataEntry.teamID};
  });
  return activeFinalData;
}
*/

/*
app.get('/activepitchers', (req, res) => {
  const pitcherIDs = new Set();
  const pitcher2k18ActiveInfo = []; 
  db.select('*').from('Pitching')
    .join('Master', function() {
      this.on('Pitching.playerID', '=', 'Master.playerID')
      .onIn('Pitching.yearID', [2018])
    })
    .then(activePitchersData => {
      const activePitchersFinalData = getFinalActiveData(activePitchersData);
      //
      const activePitchersFinalData = activePitchersData.map(activePitcher => {
        return {'id': activePitcher.playerID, 'firstname': activePitcher.nameFirst, 'lastname': activePitcher.nameLast, 'team': activePitcher.teamID};
      });
      //
      res.json(activePitchersFinalData);
    });
});

app.get('/activebatters', (req, res) => {
  db.select('*').from('Batting')
    .join('Master', function() {
      this.on('Batting.playerID', '=', 'Master.playerID')
      .onIn('Batting.yearID', [2018])
    })
    .then(activeBattersData => {
      const activeBattersFinalData = getFinalActiveData(activeBattersData);
      res.json(activeBattersData);
    });
})

app.get('/isplayeractive', (req, res) => {
  db.select('*').from('Pitching')
    .join('Master', function() {
      this.on('Pitching.playerID', '=', 'Master.playerID')
      .onIn('Pitching.yearID', [2018])
      .onIn('Master.nameFirst', [req.query.firstname])
      .onIn('Master.nameLast', [req.query.lastname])
    })
    .then(activePitcherData => {
      db.select('*').from('Batting')
      .join('Master', function() {
        this.on('Batting.playerID', '=', 'Master.playerID')
        .onIn('Batting.yearID', [2018])
        .onIn('Master.nameFirst', [req.query.firstname])
        .onIn('Master.nameLast', [req.query.lastname])
      })
      .then(activeBatterData => {
        const playerTeamData = new Set();
        for (let activePitcher of activePitcherData) {
          playerTeamData.add(activePitcher.teamID);
        }
        for (let activeBatter of activeBatterData) {
          playerTeamData.add(activeBatter.teamID);
        } 

        switch(playerTeamData.size) {
          case 0:
            res.send(`${req.query.firstname} ${req.query.lastname} did not play in 2018.  You may sound foolish in front of friends either because no such player exists, the player retired, or is inactive as of 2018.`);
            break;
          case 1:
            res.send(`${req.query.firstname} ${req.query.lastname} played for the ${playerTeamData.entries().next().value[0]} in 2018.  You can ask friends how he's doing in MLB today etc. without their saying dude he's not in MLB right now.`);
            break;
          case 2:
            const iterator = playerTeamData.entries();
            let teamString = '';
            for (let entry of iterator) {
              teamString += entry[0]; // 0 or 1 index works because when you loop over Iterator objects, [value, value] is the array for each element of the set
              teamString += ' ';
            }
            const splitTeamString = teamString.split(' '); // e.g. example of a split is ["LAA", "MIA", ""]
            teamString = splitTeamString[0] + ' and ' + splitTeamString[1];
            res.send(`${req.query.firstname} ${req.query.lastname} played for the ${teamString} in 2018`);
            break;
          default:
            res.send(`${req.query.firstname} ${req.query.lastname} played in 2018 for more than 2 teams.  Chances are the average joe does not know him but he is active as of the end of the 2018 season`);
        }
      })
    })
});
*/


app.get('/pitching/player', (req, res) => {
  db.select('*').from('Pitching')
  .join('Master', function() {
    this.on('Pitching.playerID', '=', 'Master.playerID').onIn('Master.nameLast', [req.query.lastname]).onIn('Master.nameFirst', [req.query.firstname])
  })
  .then(pitcherData => {
    // WHIP = round((H + BB)) * 3/IPouts, 2)
      pitcherData.forEach(pitcherDataEntry => {
        pitcherDataEntry.ERA = String((pitcherDataEntry.ERA.toFixed(2)));
        pitcherDataEntry.WHIP = String(((pitcherDataEntry.H + pitcherDataEntry.BB) * 3 / pitcherDataEntry.IPouts).toFixed(2));
      });
      /*
      console.log(pitcherData.length);
      console.log((pitcherData[pitcherData.length - 1].H + pitcherData[pitcherData.length - 1].BB) * 3 / pitcherData[pitcherData.length - 1].IPouts);
      
      res.send(String(((pitcherData[pitcherData.length - 1].H + pitcherData[pitcherData.length - 1].BB) * 3 / pitcherData[pitcherData.length - 1].IPouts).toFixed(2)));
      */
     res.send(pitcherData);
    })

});

app.get('/batting/player', (req, res) => {
  db.select('*').from('Batting')
  .join('Master', function() {
    this.on('Batting.playerID', '=', 'Master.playerID').onIn('Master.nameLast', [req.query.lastname]).onIn('Master.nameFirst', [req.query.firstname])
  })
  .then(batterData => {
      batterData.forEach(batterDataEntry => {
        batterDataEntry.AVG = String((batterDataEntry.H / batterDataEntry.AB).toFixed(3));
        batterDataEntry.OBP = String(((batterDataEntry.H + batterDataEntry.BB + batterDataEntry.HBP) / (batterDataEntry.AB + batterDataEntry.BB + batterDataEntry.HBP + batterDataEntry.SF)).toFixed(3));
      });
      res.send(batterData);
    }
  )
});

app.get('/hof/player', (req, res) => {
  db.select('*').from('HallOfFame')
  .join('Master', function() {
    this.on('HallOfFame.playerID', '=', 'Master.playerID').onIn('Master.nameLast', [req.query.lastname]).onIn('Master.nameFirst', [req.query.firstname])
  })
  .then(hofData => {
    console.log(hofData);
    res.send(hofData);
  })
})
app.listen(3000);