/* jshint node: true */
"use strict";
var _ = require('lodash');

var errorCodes = {
  0 : { errorMessage : "error 0" },
  1 : { errorMessage : "error 1" },
  2 : { errorMessage : "file object was null at the request!" },
  3 : { errorMessage : "wrong image type on request! must be jpg jpeg png" },
  4 : { errorMessage : "image file too big! must be 2mb max" },
  5 : { errorMessage : "another image error! sorry!" },
  6 : { errorMessage : "project id is required!!" },
  997 : { errorMessage : "no response found on general response" },
  998 : { errorMessage : "data and error on the general response cant be together." },
  999 : { errorMessage : "general error, look at the extra error definition" }
};

module.exports = function(data,errorCode,extra){

  var generalResponse = {
    data : null,
    error : null,
  };

  if( !data && !errorCode ){
    generalResponse.error = _.assign(
      {errorCode : 999 },
      errorCodes[999],
      {extra : extra ? extra : null }
    );
  }else if( data && errorCode ){
    generalResponse.error = _.assign(
      { errorCode : 998 },
      errorCodes[998],
      {extra : extra ? extra : null }
    );
  }else if( errorCode ){
    generalResponse.error = _.assign(
      { errorCode : errorCode },
      errorCodes[errorCode],
      {extra : extra ? extra : null }
    );
  }else if( data ){
    generalResponse.data = data;
  }else{
    generalResponse.error = _.assign(
      {errorCode : 999 },
      errorCodes[999],
      {extra : null }
    );
  }

  return generalResponse;
};
