import {closePeraWalletSignTxnToast} from '@perawallet/connect';

import {base64Encode} from 'Root/helpers/base64';

/**
 * Function to sign transactions with MyAlgo or WalletConnect depending on the session/localStorage
 * @param {Object} walletConnect Object that allows the user to interact with WalletConnect
 * @param {Object} myAlgoWallet Object that allows the user to interact with MyAlgo
 * @param {Object[]} transactions Array of transactions to sign
 * @return {Object[]} Array of Base64 encoded signed transactions
 */
export async function signTransactions(walletConnect, myAlgoWallet, transactions) {
  const transactionsToSend = [];
  let signedTransactions;

  if (localStorage.getItem('walletconnect')) {
    const transactionsToSign = transactions.map((txn) => {
      return {
        txn: txn,
        signers: [walletConnect.connector._accounts[0]],
      };
    });
    try {
      const signedTransactions = await walletConnect.signTransaction([transactionsToSign]);
      signedTransactions.forEach((signedTransaction) => {
        transactionsToSend.push(base64Encode(signedTransaction));
      });
    } catch (e) {

    }
    closePeraWalletSignTxnToast();
  } else if (localStorage.getItem('myAlgoAddress')) {
    signedTransactions = await myAlgoWallet.signTransaction(transactions.map((txn) => txn.toByte()));
    signedTransactions.forEach((signedTransaction) => {
      transactionsToSend.push(base64Encode(signedTransaction.blob));
    });
  }
  return transactionsToSend;
}
