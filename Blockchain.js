const SHA256 = require('crypto-js/sha256');
const request = require('request');
  var postData = {
    hr: 120 // replace this hr by the arduino's variable.
  }
  
  var url = 'https://wt1fwf.messaging.internetofthings.ibmcloud.com:443/api/v0002/device/types/iot-sensor/devices/test-1/events/hr'
  var auth = "Basic " + new Buffer("use-token-auth:123456789").toString("base64");
  var options = {
    method: 'post',
    body: postData,
    json: true,
    url: url,
    headers : {
        "Authorization" : auth
    }
  }
  request(options, function (err, res, body) {
    if (err) {
      console.error('error posting json: ', err)
      throw err
    }
    var headers = res.headers
    var statusCode = res.statusCode
    
    console.log('headers: ', headers)
    console.log('statusCode: ', statusCode)
    console.log('body: ', body)
  })

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    getIndex() {
        return this.index;
    }

    calculateHash(){
        return SHA256 (this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain  = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block (0, "09/07/2017", "Genesis Block", "0");
    }
    getLatestBlock (){
        return this.chain[this.chain.length-1];
    }

    addBlock (newBlock){
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let DataCoin = new Blockchain();
DataCoin.addBlock(new Block(1, "10/07/2017", {hr: 60})); 
DataCoin.addBlock(new Block(2, "17/09/2017",{ hr: 150}));

for (block of DataCoin.chain) {
    if (block.data.hr) {
        console.log("HR: " + block.data.hr + " - Mood: " + ((block.data.hr >= 60 && block.data.hr <= 90) ? "Unhealthy" : "Healthy"))
    }
}