import {CONNECT_WALLET, DISCONNECT_WALLET} from '../../constants/ActionTypes';

import {PeraWalletConnect} from '@perawallet/connect';
import MyAlgoConnect from '@randlabs/myalgo-connect';

let defaultState = null;

if (localStorage.walletconnect) {
  defaultState = {
    address: JSON.parse(localStorage.walletconnect).accounts[0],
  };
} else if (localStorage.getItem('myAlgoAddress') !== null) {
  defaultState = {
    address: localStorage.getItem('myAlgoAddress'),
  };
}

export const connect = (state = defaultState, action) => {
  switch (action.type) {
    case CONNECT_WALLET:
      return {
        ...state,
        address: action.address,
      };
    case DISCONNECT_WALLET:
      walletConnect.disconnect();
      localStorage.removeItem('myAlgoAddress');
      localStorage.removeItem('walletconnect');
      return {
        ...state,
        address: null,
      };
    default:
      return state;
  }
};

export const walletConnect = new PeraWalletConnect();

walletConnect.reconnectSession().then(() => {
  // Setup the disconnect event listener
  walletConnect.connector?.on('disconnect', () => {
    walletConnect.disconnect();
    localStorage.removeItem('walletconnect');
  });
});

export const myAlgoWallet = new MyAlgoConnect();
