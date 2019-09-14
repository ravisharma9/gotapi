var express = require('express');
var app = express();
app.listen(process.env.PORT || 3002);
var db = require('./db.js')

app.get('/', function (req, res) {
   res.send("Hello world!");
});

app.get('/list', async function (req, res) {
   try {
      let data = await db.distinctInCollection({ collection: "battles", key: "location", query: { "location" : { $nin : ["", null] } } })
      if (data.status && data.status.toLowerCase() == "success" && data.data) {
         res.send(data.data);
      } else {
         res.send(data.msg)
      }
   } catch (e) {
      res.send(e);
   }
});


app.get('/count', async function (req, res) {
   try {
      let data = await db.distinctInCollection({ collection: "battles", key: "battle_number", query: { "battle_number" : { $nin : ["", null] } } })
      if (data.status && data.status.toLowerCase() == "success" && data.data) {
         res.send({totalBattleCount : data.data.length});
      } else {
         res.send(data.msg)
      }
   } catch (e) {
      res.send(e);
   }
});