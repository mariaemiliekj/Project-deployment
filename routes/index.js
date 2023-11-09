var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

/* GET home page. */
router.get('/', async function(req, res, next) {
  var params = {
    Bucket: process.env.cyclic-comfortable-toad-vest-us-west-2,
    Delimiter: '/',
    Prefix: 'public/'
  };
  var allObjects = await s3.listObjects(params).promise();
  var keys = allObjects?.Contents.map( x=> x.Key).slice(0,3);
  const pictures = await Promise.all(keys.map(async (key) => {
    let my_file = await s3.getObject({
      Bucket: process.env.cyclic-comfortable-toad-vest-us-west-2,
      Key: key,
    }).promise();
    return {
        src: Buffer.from(my_file.Body).toString('base64'),
        name: key.split("/").pop()
    }
  }))
  res.render('index', { pictures: pictures, title: 'Express' });
});

module.exports = router;