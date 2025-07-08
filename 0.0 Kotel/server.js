
import express from 'express'
import fs from 'fs';
import sqlite3 from 'sqlite3';
import moment from 'moment';

const app = express();
const port = 3000;

app.use(express.static('public')); // složka s HTML a JS --logy bych mel umistit
app.use(express.json());

const db = new sqlite3.Database('./boiler_database.db');

//GET TXT LOGS
app.get('/logs', (req, res) => {
    //res.send('server called');
    const logBoiler = fs.readFileSync('./log.txt', 'utf8')
        .split('\n')
        .slice(-10)

    res.send(logBoiler);
});


// INSERT FEED TIME INTO DB
app.post('/feed', (req, res) => {
  const amount = req.body.amount ?? 1; // výchozí množství

  db.run("INSERT INTO feeding_log (amount, feeded_at) VALUES (?, datetime('now', 'localtime'))", [amount], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error writing into db.");
    }

    console.log(`Record added: ${amount}`);
    res.send({ success: true });
  });

});

//READ LAST FEED TIME
app.get('/feed/last', (req, res) => {

  db.get("SELECT * FROM feeding_log ORDER BY id DESC LIMIT 1", [], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error during reading DB");
    }

    res.json(row); 
  });

});


//READ ALL FEEDS TIME and AMOUNTS
//zatim nepouzivano
// app.get('/feed/all', (req, res) => {
//   const db = new sqlite3.Database('./boiler_database.db');

//   db.all("SELECT * FROM feeding_log ORDER BY id DESC", [], (err, row) => {
//     if (err) {
//       console.error(err.message);
//       return res.status(500).send("Error during reading DB");
//     }

//     res.json(row); 
//   });

//   db.close();
// });


app.get('/feed/avg', (req, res) => {

  db.all("SELECT substr(feeded_at,1,10) as feeded_at, SUM(amount) as amount FROM feeding_log GROUP BY substr(feeded_at,1,10)", [], (err, data) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error during reading DB");
    }
    
    data.forEach((datum, i) => {
      if(i > 0) {
        const daysBetween = moment(datum.feeded_at, "YYYY-MM-DD").diff(data[i-1].feeded_at, 'days');
        const avgDailyConsum = Math.round((datum.amount / daysBetween) * 100) / 100;
        
        datum.days_between = daysBetween;
        datum.avg_daily_consum = avgDailyConsum;
      }
    });

    const calculatedDays = data.filter(item => item.avg_daily_consum !== undefined);
    const avgOverAll = calculatedDays.reduce((sum, acc) => {
       {
        return sum + acc.avg_daily_consum;
      };
    }, 0) / calculatedDays.length;
    console.log(avgOverAll);

    res.json(avgOverAll);
  });

});


// const readAllFeeds = function () {
//   const db = new sqlite3.Database('./boiler_database.db');

//   db.all("SELECT substr(feeded_at,1,10) as feeded_at, SUM(amount) as amount FROM feeding_log GROUP BY substr(feeded_at,1,10)", [], (err, data) => {
//     if (err) {
//       console.error(err.message);
//       return res.status(500).send("Error during reading DB");
//     }
//     console.log(data);
    
//     data.forEach((datum, i) => {
//       if(i > 0) {
//         const daysBetween = moment(datum.feeded_at, "YYYY-MM-DD").diff(data[i-1].feeded_at, 'days');
//         const avgDailyConsum = Math.round((datum.amount / daysBetween) * 100) / 100;
        
//         datum.days_between = daysBetween;
//         datum.avg_daily_consum = avgDailyConsum;
//       }
//     });
//     console.log(data);

//     const calculatedDays = data.filter(item => item.avg_daily_consum !== undefined);
//     const avgOverAll = calculatedDays.reduce((sum, acc) => {
//        {
//         return sum + acc.avg_daily_consum;
//       };
//     }, 0) / calculatedDays.length;
//     //console.log(avgOverAll);

//     //res.json(data); 

//     //res.json(final);
    
//   });

//   db.close();

// }

//console.log(readAllFeeds());




//PORT
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});

process.on('exit', () => {db.close()});