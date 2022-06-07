const exec = require('child_process').exec;
const request = require('request');


var createStorage=(storageName,callback)=>{
    exec('New-AzStorageAccount -ResourceGroupName "storgae-task-rg" -Name "'+storageName+'" -Location "eastus" -SkuName "Standard_RAGRS" -Kind "StorageV2"',{'shell':'powershell.exe'}, (err, stdout, stderr) => {  
        if (err) {  
          console.error(err);  
          return callback(err,undefined);  
        }
        else{

            return callback(undefined,stdout);
        }
          
      });  
}

var createContainer=(storageName,callback)=>{
    console.log(storageName)
    exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "storgae-task-rg" -Name "'+storageName+'";$Context = $StorageAccount.Context;New-AzStorageContainer -Name "data" -Context $Context -Permission Container',{'shell':'powershell.exe'}, (err, stdout, stderr) => {  
        if (err) {  
          console.error(err);  
          return callback(err,undefined);  
        }
        else{

            return callback(undefined,stdout);
        }
          
      });  
}

var UploadFIle=(storage,file,fname,callback)=>{
    exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "storgae-task-rg" -Name "'+storage+'";$Context = $StorageAccount.Context;$Blob1HT = @{File = "'+file+'" ; Container        = "data";Blob             = "'+fname+'"; Context          = $Context};Set-AzStorageBlobContent @Blob1HT',{'shell':'powershell.exe'}, (err, stdout, stderr) => {  
        if (err) {  
          console.error(err);  
          return callback(err,undefined);  
        }
        else{

            return callback(undefined,stdout);
        }
          
      });  
}

var storageImgOut=(storage,fname,callback)=>{
  exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "storgae-task-rg" -Name "'+storage+
  '";$Context = $StorageAccount.Context;$Blob2HT = @{File = "D:/Cloud-AI/Tasks/imageadultvalid/abc.txt" ; Container= "data";Blob= "'+fname+'.txt"; Context= $Context};Set-AzStorageBlobContent @Blob2HT',
  {'shell':'powershell.exe'}, (err, stdout, stderr) => {  
    if (err) {  
     console.error(err);  
      return callback(err,undefined);  
    }
    else{

        return callback(undefined,stdout);
    }
      
  });  
}

var getlist=(storage,callback)=>{
    exec('$StorageAccount = Get-AzStorageAccount -ResourceGroupName "storgae-task-rg" -Name "'+storage+'";$Context = $StorageAccount.Context;Get-AzStorageBlob -Container "data" -Context $Context ',{'shell':'powershell.exe'}, (err, stdout, stderr) => {  
        if (err) {  
         // console.error(err);  
          return callback(err,undefined);  
        }
        else{

            return callback(undefined,stdout);
        }
          
      });  
}

const imageeval = (url,callback)=>{

  let subscriptionKey = '8701dfd0eb6c4be3b0eeb318a075eafb';
  let endpoint = 'https://imagevalidatetask.cognitiveservices.azure.com/';
  
  var uriBase = endpoint + 'vision/v3.1/analyze';
  
  const imageUrl = url
      ;
  
  // Request parameters.
  const params = {
      'visualFeatures': 'Adult,Faces,Categories,Description',
      'details': '',
      'language': 'en'
  };
  
  const options = {
      uri: uriBase,
      qs: params,
      body: '{"url": ' + '"' + imageUrl + '"}',
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : subscriptionKey
      }
  };
  
    request.post(options, async (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return callback(error,undefined);
      }
      else{
    
        let jsonResponse = JSON.parse(body);
    
        return callback(undefined,jsonResponse)
      }
    
    });
    
  }

module.exports={
  createStorage,
  createContainer,
  UploadFIle,
  getlist,
  imageeval,
  storageImgOut
}

