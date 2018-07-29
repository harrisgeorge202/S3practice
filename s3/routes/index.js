var express = require('express');
var router = express.Router();



var multer  = require('multer'),
    multerS3 = require('multer-s3'),
    fs = require('fs'),
    AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/s', function (req, res) {
  s3.listBuckets({}, function (err, data) {
      if (err) {
          return res.send({ "error": err });
      }
      res.send({ data });
  });
}),


router.post('/', function (req, res) {
  var item = req.body;
  var params = { Bucket: item.bucketName };
  s3.createBucket(params, function (err, data) {
      if (err) {
        console.log("errrrrr", err)
          return res.send({ "error": err });
      }
      res.send({ data });
  });
});




router.post('/s', function (req, res) {  
  var item = req.body;


    console.log("else--------------------->", item.bucketName)
  var upload = multer({
      storage: multerS3({
          s3: s3,
          bucket: item.bucketName,
          metadata: function (req, file, cb) {
    console.log("metaaedfesdgffdrgfdgfdgfdgcg--------------------->", item.bucketName)
            
            if (err) {
              console.log("errrrrr", err)
                return res.send({ "error": err });
            }
              cb(null, { fieldName: file.fieldname });
          },
          
          key: function (req, file, cb) {
              cb(null, Date.now().toString())
          }
      })
  })

})



module.exports = router;
