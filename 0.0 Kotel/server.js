
import express from 'express'
import fs from 'fs';

const app = express();
const port = 3000;

app.get('/logs', (req, res) => {
    //res.send('server called');
    const logBoiler = fs.readFileSync('./log.txt', 'utf8')
        .split('\n')
        .slice(-10)

    res.send(logBoiler);
});

app.use(express.static('public')); // složka s HTML a JS

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});





// const logBoiler = fs.readFileSync('./log.txt', 'utf8')
//   .split('\n')
//   .slice(-10)

// console.log(logBoiler);
