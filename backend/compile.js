require('dotenv').config();

const algosdk = require('algosdk');
const algodClient = new algosdk.Algodv2(
    process.env.MAINNET_NODE_TOKEN, process.env.MAINNET_ALGOD_ADDRESS, process.env.MAINNET_ALGOD_PORT,
);

const fs = require('fs');
const data = fs.readFileSync('public/approval.teal');

async function compile() {
  const results = await algodClient.compile(data).do();
  console.log(results.result);
}

compile();
