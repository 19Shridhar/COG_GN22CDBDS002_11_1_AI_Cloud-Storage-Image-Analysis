const express = require("express");
const exec = require('child_process').exec;
const {createStorage,createContainer,UploadFIle,getlist,imageeval,storageImgOut}=require('./src/azureStorageFunc.js')
const {download,extensionCheck}=require('./src/func.js')
const app=express()
const path = require("path");
var fs = require("fs");
const port=process.env.PORT || 3000

app.use(express.urlencoded())
app.use(express.json())
console.log(__dirname)

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/html/index.html')
})

app.get('/create',(req,res)=>{
    res.sendFile(__dirname+'/public/html/create.html')
})


app.get('/upload',(req,res)=>{
    res.sendFile(__dirname+'/public/html/upload.html')
})

app.get('/list',(req,res)=>{
    res.sendFile(__dirname+'/public/html/list.html')
})

app.post('/createstorage',(req,res)=>{

    const storage=req.body.nameCreate
  
    
    createStorage(storage,(error,val)=>{
        if (error)
        {
            res.send('STorage could not be created')
        }
        else{
          console.log('STorage created successfully')
      
          createContainer(storage,(error,val)=>{
            if (error)
            {
                console.log('STorage could not be created')
            }
            else{
              res.send({out:'Container created successfully'})
            }
          })
        }
      })


})

app.post('/uploadfile',(req,res)=>{

  const url=req.body.urlUpload
  const storage=req.body.nameUpload
  const filename=req.body.namestoreUpload

  var extension=extensionCheck(url)

  if (extension){

    imageeval(url,(error,value)=>{
      if (value.adult.isAdultContent == true || value.adult.isRacyContent == true || value.adult.isGoryContent == true){
        res.send('Image cannot be uploaded')
    }
    else{
      download(url,"google.png",function () { });
      const imagepath = path.join(__dirname, "/google.png");
      fs.writeFileSync('abc.txt',JSON.stringify(value))

      UploadFIle(storage,imagepath,filename,(error,val)=>{

        if (error){
          res.send('image cannot be uploaded')
        }
        else{
          storageImgOut(storage,filename,(error,val)=>{

            if (error){
              res.send('image cannot be uploaded')
            }
            else{
              console.log('storage')
              res.send('image uploaded successfully')
            }
          })
        }
      })
    }
    })
  }
  else{
    res.send({error:"Invalid file extension please upload valide file"})
  }

  


})


app.post('/listoutput',(req,res)=>{
    const storage=req.body.accnameList

    getlist(storage,(error,val)=>{
        if (error)
        {
          res.send(error)
        }
        else{
          res.send({list: val})
        }
      })
})

app.listen(port,()=>{
    console.log('Server running on port 3000')
})