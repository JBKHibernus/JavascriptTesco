
import express from 'express'
import fs from 'fs';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

app.use(express.static('public')); // složka s HTML a JS --logy bych mel umistit
app.use(express.json());

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
  const db = new sqlite3.Database('./boiler_database.db');

  db.run("INSERT INTO feeding_log (amount, feeded_at) VALUES (?, datetime('now', 'localtime'))", [amount], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error writing into db.");
    }

    console.log(`Record added: ${amount}`);
    res.send({ success: true });
  });

  db.close();
});

//READ LAST FEED TIME
app.get('/last-feed', (req, res) => {
  const db = new sqlite3.Database('./boiler_database.db');

  db.get("SELECT * FROM feeding_log ORDER BY id DESC LIMIT 1", [], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error during reading DB");
    }

    res.json(row); 
  });

  db.close();
});


//PORT
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});