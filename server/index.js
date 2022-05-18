/*const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');



// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());
const wallet = 3;
const balances = {};
console.log(balances[1]);
for(let i=1;i<=wallet;i++){

    const key = ec.genKeyPair();
    const privateKey = key.getPrivate().toString(16);
    const publicKey = key.getPublic().encode('hex');
    const address = publicKey.slice(-40);
    const balance = Math.floor((Math.random() * 50) + 50);
    balances[address] = balance;

    var msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
    var signature = key.sign(msgHash);
    var derSign = signature.toDER();
    console.log(key.verify(msgHash, derSign));

    console.log(`Wallet: ${i}`);
    console.log(`PrivateKey: ${privateKey}`);
    console.log(`Address: ${address}`);
    console.log(`Balance: ${balance}`);
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, privateKey} = req.body;
  const msgHash = SHA256(JSON.stringify({ sender, recipient, amount})).toString();
  const recoveredPublicKey = ec.recoverPubKey(msgHash, privateKey, 1); 
  console.log(recoveredPublicKey);

  if(balances[recoveredPublicKey]) {
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
  }else{
  console.log("Address not found");

  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});*/

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const SHA256 = require('crypto-js/sha256');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const key = ec.genKeyPair();


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

const walletAccount = 4;
const balances = {};


//console.log(publicKey);

for (let i = 1; i < walletAccount; i++) {
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate().toString(16);
  const publicKey = key.getPublic().encode('hex');
  
  const address = publicKey.slice(-40);
  console.log(`(${i})`);
  console.log(`Address : ${address}`);
  console.log(`Private Key : ${privateKey}`);
  

  //console.log(balances);
  const balance = i * 100;
  balances[address] = balance;
  console.log(`Balance : ${balance}`);
  
  

}


// const balances = {
//   "1": 100,
//   "2": 50,
//   "3": 75,
// }

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => { //get data from the client
  const {senderAddress, signature, recipient, amount, recid} = req.body
  const message = {amount: amount}
  const msgHash = SHA256(message).words;
  const publicKey = ec.recoverPubKey(msgHash, signature, recid);
  
  //console.log(publicKey);
  //const key1 = ec.keyFromPublic(publicKey);
  const pKey = publicKey.encode("hex").slice(-40);
  //console.log(key1.verify(msgHash, signature));

  if (pKey === senderAddress) {
    balances[senderAddress] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
  }
  res.send({ balance: balances[senderAddress] }); //res: response
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});