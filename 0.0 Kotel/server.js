import express from 'express';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import moment from 'moment';

const app = express();
const port = 3000;

app.use(express.static('public')); // složka s HTML a JS --logy bych mel umistit
app.use(express.json());

const db = new sqlite3.Database('./boiler_database.db');

//.headers on
//.mode column

//GET TXT LOGS
app.get('/logs', (req, res) => {
  //res.send('server called');
  const logBoiler = fs.readFileSync('./log.txt', 'utf8').split('\n').slice(-10);

  res.send(logBoiler);
});

// INSERT FEED TIME INTO DB
app.post('/feed', (req, res) => {
  const amount = req.body.amount ?? 1; // výchozí množství

  db.run(
    "INSERT INTO feeding_log (amount, feeded_at) VALUES (?, datetime('now', 'localtime'))",
    [amount],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error writing into db.');
      }

      console.log(`Record added: ${amount}`);
      res.send({ success: true });
    }
  );
});

//READ LAST FEED TIME
app.get('/feed/last', (req, res) => {
  db.get(
    'SELECT * FROM feeding_log ORDER BY id DESC LIMIT 1',
    [],
    (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error during reading DB');
      }

      res.json(row);
    }
  );
});

//READ AVERAGE DAILY AMOUNT
app.get('/feed/avg', (req, res) => {
  db.all(
    'SELECT substr(feeded_at,1,10) as feeded_at, SUM(amount) as amount FROM feeding_log GROUP BY substr(feeded_at,1,10)',
    [],
    (err, data) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error during reading DB');
      }

      data.forEach((datum, i) => {
        if (i > 0) {
          const daysBetween = moment(datum.feeded_at, 'YYYY-MM-DD').diff(
            data[i - 1].feeded_at,
            'days'
          );
          const avgDailyConsum =
            Math.round((datum.amount / daysBetween) * 100) / 100;

          datum.days_between = daysBetween;
          datum.avg_daily_consum = avgDailyConsum;
        }
      });

      const calculatedDays = data.filter(
        item => item.avg_daily_consum !== undefined
      );
      const avgOverAll =
        calculatedDays.reduce((sum, acc) => {
          {
            return sum + acc.avg_daily_consum;
          }
        }, 0) / calculatedDays.length;
      console.log(avgOverAll);

      res.json(avgOverAll);
    }
  );
});

//READ BOILER_STATUS_LOG
app.get('/status_log', (req, res) => {
  db.all(
    'SELECT logged_at, status FROM boiler_status_log ORDER BY id DESC',
    [],
    (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error during reading DB');
      }

      res.json(row);
    }
  );
});

//READ BOILER_STATUS_LOG
app.get('/status_log', (req, res) => {
  db.all(
    'SELECT logged_at, status FROM boiler_status_log ORDER BY id DESC',
    [],
    (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error during reading DB');
      }

      res.json(row);
    }
  );
});

//READ BOLIER_PARAMETERS
app.get('/params/read', (req, res) => {
  db.all('SELECT id, value FROM boiler_parameters', [], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Error during reading DB');
    }

    res.json(row);
  });
});

// UPDATE BOLIER_PARAMETERS IN DB
app.post('/params/write', (req, res) => {
  const id = req.body.id;
  const value = req.body.value;
  const exisitngIDs = ['open_interval', 'check_interval'];

  if (!exisitngIDs.includes(id)) {
    return res.status(400).send('Invalid ID');
  }

  if (!Number.isInteger(Number(value)) || value === 0) {
    return res.status(400).send('Invalid value: must be an integer.');
  }

  db.run(
    'UPDATE boiler_parameters SET value = ? WHERE id = ?',
    [value, id],
    function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).send('Error writing into db.');
      }

      console.log(`Record added for ${id}: ${value}`);
      res.send({ success: true });
    }
  );
});

//PORT
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});

process.on('exit', () => {
  db.close();
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
