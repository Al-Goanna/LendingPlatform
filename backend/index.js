const express = require('express');
const {body, validationResult} = require('express-validator');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const winston = require('winston');
const expressWinston = require('express-winston');

const {Client} = require('pg');

require('dotenv').config();

const algosdk = require('algosdk');

const CREATOR_ADDRESS = 'YUAXSAN5A2VYNW55XWSE4Z4LUFVZMGDOP5W3IMB7Z4D5VBWHVWAVACNMOU';

const NODE_ADDRESS = process.env.MAINNET_NODE_ADDRESS;
const NODE_TOKEN = process.env.MAINNET_NODE_TOKEN;
const ALGOD_ADDRESS = process.env.MAINNET_ALGOD_ADDRESS;
const ALGOD_PORT = process.env.MAINNET_ALGOD_PORT;

const algodClient = new algosdk.Algodv2(
    NODE_TOKEN, ALGOD_ADDRESS, ALGOD_PORT,
);

const fs = require('fs');

const app = express();
const port = process.env.APP_PORT;
const axios = require('axios').default;

const pgClient = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pgClient.connect();

const corsOptions = {
  origin: [process.env.WEB_HOST, 'https://d23qbf89nbyeei.cloudfront.net', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
};

/**
* Async Wrapper
* @param {Function} fn Function to wrap for express
* @return {Promise} Resolved promise for async function
*/
function asyncWrapper(fn) {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
      return res.sendStatus(400);
    }
    return Promise.resolve(fn(req, res))
        .then((result) => result)
        .catch((err) => next(err));
  };
}

/**
* Encode ByteArray into Base64
* @param {byte[]} input ByteArray to convert to Base64
* @return {string} Base64 encoded ByteArray
*/
// function base64Encode(input) {
//   return Buffer.from(input.reduce((str, byte) => str + String.fromCharCode(byte))).toString('base64');
// }

/**
* Decode Base64 into ByteArray
* @param {string} input Base64 to convert to ByteArray
* @return {byte[]} ByteArray from Base64 string
*/
function base64Decode(input) {
  return new Uint8Array(atob(input).split('').reduce((arr, chr) => arr.concat([chr.charCodeAt(0)]), []));
}

async function getParams(req, res) {
  const params = await algodClient.getTransactionParams().do();

  return res.status(200).send(JSON.stringify(params));
}

async function getAssetsByCollection(req, res) {
  try {
    const account = await axios.get(NODE_ADDRESS + `v2/accounts/${req.body.public_key}`,
        {
          headers: {
            'X-Algo-API-Token': NODE_TOKEN,
          },
        });

    let ownedNfts = [];

    for (const asset of account.data.assets.filter((asset) => asset.amount > 0)) {
      const nft = await pgClient.query(
          `SELECT nfts.id, nfts.name, nfts.unit_name, nfts.image, nfts.collection, nfts.traits,
          nfts.rarity_score, nfts.rank
          FROM nfts
          WHERE nfts.id = $1`,
          [asset['asset-id']],
      ).then((res) => res.rows[0]);
      if (nft) {
        nft.amount = asset.amount;
        ownedNfts.push(nft);
      }
    }

    // Group by collection
    ownedNfts = ownedNfts.reduce(function(item, x) {
      if (!item[x.collection]) {
        item[x.collection] = [];
      }
      item[x.collection].push(x);
      return item;
    }, {});

    ownedNfts = Object.keys(ownedNfts).sort().reduce(
        (obj, key) => {
          obj[key] = ownedNfts[key];
          return obj;
        },
        {},
    );

    return res.status(200).send(ownedNfts);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function createLoan(req, res) {
  const approvalCompiled = fs.readFileSync('./public/approval.compiled', 'utf8');
  const clearCompiled = fs.readFileSync('./public/clear.compiled', 'utf8');

  const account = algosdk.mnemonicToSecretKey(process.env.KEY);
  const params = await algodClient.getTransactionParams().do();

  const createAppTransaction = algosdk.makeApplicationCreateTxnFromObject({
    suggestedParams: {
      ...params,
    },
    from: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(approvalCompiled, 'base64')),
    clearProgram: new Uint8Array(Buffer.from(clearCompiled, 'base64')),
    numGlobalInts: 6,
    numGlobalByteSlices: 2,
    numLocalInts: 0,
    numLocalByteSlices: 0,
  });

  const signedCreateAppTransaction = algosdk.signTransaction(createAppTransaction, account.sk);

  const sentCreateApplicationTransaction = await algodClient.sendRawTransaction(signedCreateAppTransaction.blob).do();
  const createApplicationResult = await algosdk.waitForConfirmation(
      algodClient, sentCreateApplicationTransaction.txId, 3);

  await pgClient.query('INSERT INTO listings (app_id, date) VALUES ($1, $2)',
      [
        createApplicationResult['application-index'],
        new Date().toISOString(),
      ]);

  const paymentTransaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams: {
      ...params,
    },
    from: account.addr,
    to: algosdk.getApplicationAddress(parseInt(createApplicationResult['application-index'])),
    amount: 1200000,
  });

  // Calculate APY at 30%
  const loanAmount = 1;
  const paybackPrice = loanAmount + (loanAmount * (parseInt(req.query.loanLength)/31536000) * 1.3);

  const appArgs = [
    new Uint8Array(Buffer.from('setup')),
    algosdk.encodeUint64(algosdk.algosToMicroalgos(paybackPrice)),
    algosdk.encodeUint64(parseInt(req.query.loanLength)),
  ];

  const setupTransaction = algosdk.makeApplicationNoOpTxnFromObject({
    suggestedParams: {
      ...params,
    },
    from: account.addr,
    appIndex: parseInt(createApplicationResult['application-index']),
    appArgs: appArgs,
    foreignAssets: [parseInt(req.query.nftId)],
  });

  setupTransaction.fee = 2000;

  const txnsToGroup = [paymentTransaction, setupTransaction];

  const groupID = algosdk.computeGroupID(txnsToGroup);
  for (let i = 0; i < txnsToGroup.length; i++) txnsToGroup[i].group = groupID;

  const signedPayment = algosdk.signTransaction(paymentTransaction, account.sk);
  const signedSetup = algosdk.signTransaction(setupTransaction, account.sk);

  const sentSetupTransaction = await algodClient.sendRawTransaction([
    signedPayment.blob,
    signedSetup.blob,
  ]).do();

  await algosdk.waitForConfirmation(algodClient, sentSetupTransaction.txId, 3);

  return res.status(200).send({
    app_id: createApplicationResult['application-index'].toString(),
  });
}

async function lend(req, res) {
  try {
    const transactionsToSend = [];

    for (transaction of req.body.lend_transactions) {
      transactionsToSend.push(base64Decode(transaction));
    }

    const listTransactions = await algodClient.sendRawTransaction(transactionsToSend).do();
    await algosdk.waitForConfirmation(algodClient, listTransactions.txId, 3);

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function pay(req, res) {
  try {
    const transactionsToSend = [];

    for (transaction of req.body.pay_transactions) {
      transactionsToSend.push(base64Decode(transaction));
    }

    const unlistTransactions = await algodClient.sendRawTransaction(transactionsToSend).do();
    await algosdk.waitForConfirmation(algodClient, unlistTransactions.txId, 3);

    const account = algosdk.mnemonicToSecretKey(process.env.KEY);
    const params = await algodClient.getTransactionParams().do();

    const appArgs = [
      new Uint8Array(Buffer.from('claim_debt')),
    ];

    const claimDebtTransaction = algosdk.makeApplicationNoOpTxnFromObject({
      suggestedParams: {
        ...params,
      },
      from: account.addr,
      appIndex: algosdk.decodeSignedTransaction(transactionsToSend[1]).txn.appIndex,
      appArgs: appArgs,
    });

    claimDebtTransaction.fee = 2000;

    const signedClaim = algosdk.signTransaction(claimDebtTransaction, account.sk);
    await algodClient.sendRawTransaction(signedClaim.blob).do();

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function partialPay(req, res) {
  try {
    const transactionsToSend = [];

    for (transaction of req.body.partial_pay_transactions) {
      transactionsToSend.push(base64Decode(transaction));
    }

    const unlistTransactions = await algodClient.sendRawTransaction(transactionsToSend).do();
    await algosdk.waitForConfirmation(algodClient, unlistTransactions.txId, 3);

    return res.sendStatus(200);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function getLoans(req, res) {
  const approvalCompiled = fs.readFileSync('./public/approval.compiled', 'utf8');
  try {
    const accountInfo = await algodClient.accountInformation(CREATOR_ADDRESS).do();
    const lendingContracts = accountInfo['created-apps'].filter((app) => {
      return algosdk.encodeAddress(Uint8Array.from(atob(app.params['global-state']?.find((state) => {
        return state.key === 'Z2xvYmFsX2xlbmRfYWRkcmVzcw==';
      })?.value.bytes), (c) => c.charCodeAt(0))) === req.query.public_key &&
        app.params['approval-program'] === approvalCompiled &&
        app.params['global-state']?.find((state) => {
          return state.key === 'Z2xvYmFsX2xlbmRfc3RhdHVz';
        })?.value.bytes === 'bGVudA==';
    });

    for (const [index, contract] of lendingContracts.entries()) {
      const nftId = contract.params['global-state'].find((state) => {
        return state.key === 'Z2xvYmFsX2xlbmRfYXNzZXQ=';
      }).value.uint;
      const nft = await pgClient.query(
          `SELECT nfts.id, nfts.name, nfts.unit_name, nfts.image, nfts.collection, nfts.traits,
          nfts.rarity_score, nfts.rank
          FROM nfts
          WHERE nfts.id = $1`,
          [nftId],
      ).then((res) => res.rows[0]);
      lendingContracts[index] = {
        ...contract,
        ...nft,
        app_id: contract.id,
      };
    }

    lendingContracts.forEach(async (contract, index, array) => {

    });

    return res.status(200).send(lendingContracts);
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

async function getCollection(req, res) {
  const collection = await pgClient.query(
      `SELECT collections.name, collections.description, collections.preview, collections.banner, collections.creator, 
      collections.visible, socials.website, socials.discord, socials.twitter, socials.instagram, socials.telegram
      FROM collections
      LEFT JOIN socials ON collections.name = socials.collection 
      WHERE collections.name = $1
      AND collections.visible = true`,
      [req.query.name],
  ).then((res) => res.rows[0]);

  return res.status(200).send(collection);
}

async function getAlgo(req, res) {
  const accountInfo = await algodClient.accountInformation(req.query.public_key).do();
  return res.status(200).send(algosdk.microalgosToAlgos(accountInfo.amount).toString());
}

async function deleteApp(appId) {
  const account = algosdk.mnemonicToSecretKey(process.env.KEY);
  const params = await algodClient.getTransactionParams().do();

  const deleteAppTransaction = algosdk.makeApplicationDeleteTxnFromObject({
    suggestedParams: {
      ...params,
    },
    from: account.addr,
    appIndex: appId,
  });

  const signedDeleteAppTransaction = algosdk.signTransaction(deleteAppTransaction, account.sk);

  try {
    const sentDeleteApplicationTransaction = await algodClient.sendRawTransaction(
        signedDeleteAppTransaction.blob,
    ).do();
    await algosdk.waitForConfirmation(algodClient, sentDeleteApplicationTransaction.txId, 3);
  } catch {
    console.error('Application Already Deleted');
  }
}

app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(cors(corsOptions));

app.use(expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
    new winston.transports.File({
      level: 'warn',
      filename: 'logs/error.log',
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'logs/error.log',
    }),
  ],
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
  ),
  meta: false,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
  ignoreRoute: function(req, res) {
    return false;
  },
}));

app.get('/getParams',
    asyncWrapper(getParams));

app.post('/getAssetsByCollection',
    body('public_key').isLength({min: 58, max: 58}),
    asyncWrapper(getAssetsByCollection));

app.get('/createLoan',
    asyncWrapper(createLoan));

app.post('/lend',
    body('lend_transactions').isBase64(),
    asyncWrapper(lend));

app.post('/pay',
    body('pay_transactions').isBase64(),
    asyncWrapper(pay));

app.post('/partialPay',
    body('partial_pay_transactions').isBase64(),
    asyncWrapper(partialPay));

app.get('/getLoans',
    asyncWrapper(getLoans));

app.get('/getCollection',
    asyncWrapper(getCollection));

app.get('/getAlgo',
    asyncWrapper(getAlgo));

app.listen(port, () => console.log(`Al Goanna API Started on port ${port}`));
