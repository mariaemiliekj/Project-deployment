var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

// Or
/* GET pictures listing. */
router.get('/', async function(req, res, next) {
  var params = {
    Bucket: process.env.cyclic-comfortable-toad-vest-us-west-2,
    Delimiter: '/',
    Prefix: 'public/'
  };

  try {
    var allObjects = await s3.listObjects(params).promise();
    var keys = allObjects?.Contents.map(x => x.Key);

    // Getting the details of each object
    const pictures = await Promise.all(keys.map(async (key) => {
      let my_file = await s3.getObject({
        Bucket: process.env.cyclic-comfortable-toad-vest-us-west-2,
        Key: key,
      }).promise();

      return {
        src: Buffer.from(my_file.Body).toString('base64'),
        name: key.split("/").pop()
      };
    }));

    res.render('pictures', { pictures: pictures });
  } catch (error) {
    console.error("Error fetching pictures:", error);
    res.status(500).send("Error fetching pictures");
  }
});


  router.post('/', async function(req, res, next) {
    const file = req.files.file;
    console.log(req.files);
    await s3.putObject({
      Body: file.data,
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: "public/" + file.name,
    }).promise()
    res.end();
  });

module.exports = router;