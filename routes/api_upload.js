var express = require('express');
var router = express.Router();
var generalResponse = require('../util/general_response');
var AWS = require('aws-sdk');
var uuid = require('../util/uuid');

router.post('/image', function(req,res,next){

  /* example file
  {
    file : {
      size : 35874,
      type : "image/png"
    }
  }
  */

  if( !req.body.file ){ res.json( generalResponse( null,2 ) ); return; }
  var file = req.body.file;

  if( file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg"){
    if( file.size > 2200000 ){
        res.json( generalResponse( null,4 ) ); return;
    }
  }else{
    res.json( generalResponse( null,3 ) ); return;
  }

  var fileName;
  if( file.type == "image/png") { fileName = uuid.generateShort() + uuid.generateShort() + '.png'; }
  else if( file.type == "image/jpeg") { fileName = uuid.generateShort() + uuid.generateShort() + '.jpg'; }
  else if( file.type == "image/jpg") { fileName = uuid.generateShort() + uuid.generateShort() + '.jpg'; }
  else{ res.json( generalResponse( null,5 ) ); return; }

  AWS.config.region = 'eu-west-1';
  AWS.config.accessKeyId = "<your-accessKeyId>";
  AWS.config.secretAccessKey = "<your-secretAccessKey>";

  var bucketName = "<your-bucketName>";
  var s3bucket = new AWS.S3();

  var s3_params = {
        Bucket: bucketName,
        Key: fileName,
        Expires: 60, // expire after 60 mins
        ContentType: file.type,
        ACL: 'public-read',
    };

  s3bucket.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
      console.log(err);
    }
    else{
      var return_data = {
        requestUrl : data,
        imageUrl: 'https://'+ bucketName +'.s3.amazonaws.com/'+ fileName
      };
      res.json( generalResponse( return_data ) );
    }
  });

});

module.exports = router;
