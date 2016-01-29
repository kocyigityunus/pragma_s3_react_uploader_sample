import React from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';

var App = React.createClass({
  getInitialState(){
    return{
      imageUrl : '12414124',
      uploading : false,
      uploadedPercent : 0
    };
  },
  uploadFile(file,signed_request,response_url){
    this.setState({ uploading : true });
    var xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(e){
      if (e.lengthComputable){
        var percentComplete = ( (e.loaded / e.total) * 100 ).toFixed(2);
        this.setState({ uploadedPercent : percentComplete });
      }
    }.bind(this);

    xhr.open("PUT", signed_request);
    xhr.setRequestHeader("Cache-Control", "public,max-age=3600");
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log("file uploaded succesfully");
        this.setState({  imageUrl : response_url, uploading : false });
      }
    }.bind(this);
    xhr.onerror = function() {
      this.setState({ uploading : false });
      toastr.error('Could not upload file. Please try again!');
    }.bind(this);
    xhr.send(file);
  },
  getSignedRequest(file){
    var fileObject = { file : { type : file.type, size : file.size } };
    console.log(fileObject);
    $.ajax({
      url: "/api/upload/image",
      data : JSON.stringify(fileObject),
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      cache: false,
      method : 'POST',
      success: function(data) {
        this.uploadFile( file, data.data.requestUrl, data.data.imageUrl );
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('Error on getting signed request : ',err);
      }.bind(this)
    });
  },
  fileOnChange(e){
    var file = e.target.files[0];
    if( file ){
      if( file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg"){
        if( file.size > 2200000 ){
          console.log("Image is too big! Image must me 2 mb at max!");
        }else{
          console.log("will get signed request!");
          this.getSignedRequest(file);
        }
      }else{
        console.log("Wrong file type! file type must be png, jpg or jpeg!");
      }
    }else{
      console.log("File was null!");
    }
  },
  render(){

    var uploadInfo = <p>Select an image file!</p>;
    if( this.state.uploading ){
      uploadInfo = (<p>Uploading ... %{this.state.uploadedPercent}</p>);
    }

    return (
      <div>
        <img
          style={{ border : '1px solid black' }}
          height={400}
          src={this.state.imageUrl}
          alt=""/>
        <p>.png or .jpg or .jpeg & max 2mb</p>
      <input
          type="file"
          onChange={this.fileOnChange}/>
        {uploadInfo}
      </div>
    );
  }
});

ReactDom.render( <App/>, document.getElementById('container') );
