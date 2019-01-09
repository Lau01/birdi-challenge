const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');
app.use( cors() );
app.use(express.static(__dirname + '/public'))

const MongoClient = require('mongodb').MongoClient;
let db; // global var to store the db connection object

MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
  if (err) return console.log(err); // return early on error

  db = client.db('ba');
});

// Start server
const server = app.listen(3000, () => {
  console.log('Server listening on port 3000...');
});

const weatherApiKey = process.env.WEATHER_API_KEY
app.get('/weather/:position', (req, res) => { 
  request({
    url: `https://api.darksky.net/forecast/${weatherApiKey}/${req.params.position}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      res.send('Unable to connect')
    } else if (response.statusCode === 404) {
      res.send('Unable to fetch weather');
    } else if (response.statusCode === 200) {
      res.send(body.currently)
    }
  })
})
