var express = require('express');
var app = express();
app.listen(process.env.PORT || 3002);
var appOps = require('./app.js')

app.get('/', function (req, res) {
   res.send("There are two ways to write error-free programs; only the third one works.");
});

app.get('/list', async (req, res) => {
   try {
      let model = await appOps.list()
      if (model.status && model.status.toLowerCase() == "success" && model.data) {
         res.send(model.data);
      } else {
         res.send(model.msg)
      }
   } catch (e) {
      res.status(500)
   }
});

app.get('/count', async (req, res) => {
   try {
      let model = await appOps.count()
      if (model.status && model.status.toLowerCase() == "success" && model.data) {
         res.send({ totalBattleCount: model.data.length });
      } else {
         res.send(model.msg)
      }
   } catch (e) {
      res.status(500)
   }
});

app.get('/search', async (req, res) => {
   try {
      let model = await appOps.search(req.query)
      if (model.status && model.status.toLowerCase() == "success" && model.data) {
         res.send(model.data);
      } else {
         res.send(model.msg)
      }
   } catch (e) {
      res.status(500)
   }
});

app.get('/stats', async (req, res) => {
   try {
      let model = await appOps.stats()
      if (model.status && model.status.toLowerCase() == "success" && model.data) {
         res.send(model.data);
      } else {
         res.send(model.msg)
      }
   } catch (e) {
      res.status(500)
   }
});