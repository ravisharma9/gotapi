var express = require('express');
var app = express();
app.listen(process.env.PORT || 3002);
var appOps = require('./app.js')

app.get('/', function (req, res) {
   res.send("There are two ways to write error-free programs; only the third one works.");
});

app.get('/list', async (req, res) => {
   try {
      let data = await appOps.list()
      if (data.status && data.status.toLowerCase() == "success" && data.data) {
         res.send(data.data);
      } else {
         res.send(data.msg)
      }
   } catch (e) {
      res.status(500)
   }
});

app.get('/count', async (req, res) => {
   try {
      let data = await appOps.count()
      if (data.status && data.status.toLowerCase() == "success" && data.data) {
         res.send({totalBattleCount : data.data.length});
      } else {
         res.send(data.msg)
      }
   } catch (e) {
      res.status(500)
   }
});

app.get('/search', async (req, res) => {
   try {
      console.log(req.query)
      res.send(req.query)
   } catch (e) {
      res.status(500)
   }
});