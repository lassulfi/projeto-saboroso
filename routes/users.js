var express = require('express');
var router = express.Router();
var connection = require('./../inc/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM tb_users ORDER BY name", (err, result) => {
    if(err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
