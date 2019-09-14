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
      if (data.status.toLowerCase() == "success") {
         res.send(data.data);
      } else {
         res.send(data.msg)
      }
   } catch (e) {
      res.send(e);
   }
});