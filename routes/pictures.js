var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');

// Or
/* GET pictures listing. */
router.get('/', function(req, res, next) {
  res.render('pictures');
});

router.post('/', function(req, res, next) {
  const file = req.files.file;
  fs.writeFileSync(path.join(__dirname, '../pictures/', file.name), file.data);
  res.end();
});

module.exports = router;