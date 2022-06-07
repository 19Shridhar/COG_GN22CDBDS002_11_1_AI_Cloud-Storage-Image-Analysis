var fs = require("fs");

const request = require("request");

var download = (uri, filename, callback)=>{
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

var extensionCheck =(string)=>{
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(string)){
        return false
    }
    else{
        return true
    }
}


module.exports={
    download,
    extensionCheck
}
