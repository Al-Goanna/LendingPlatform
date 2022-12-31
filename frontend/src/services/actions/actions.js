import {SHOW_CONNECT_MODAL, SHOW_WALLET_CONNECT_MODAL, CONNECT_WALLET,
  DISCONNECT_WALLET, SHOW_LOADING_MODAL, SHOW_LEND_MODAL, SHOW_PAY_MODAL, HIDE_CONNECT_MODAL,
  HIDE_WALLET_CONNECT_MODAL, HIDE_LOADING_MODAL, HIDE_LEND_MODAL, HIDE_PAY_MODAL} from '../constants/ActionTypes';

export const openConnectModal = () => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_CONNECT_MODAL,
    });
  };
};

export const openWalletConnectModal = () => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_WALLET_CONNECT_MODAL,
    });
  };
};

export const openLoadingModal = () => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_LOADING_MODAL,
    });
  };
};

export const openLendModal = (id, image, name, reload) => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_LEND_MODAL,
      id: id,
      image: image,
      name: name,
      reload: reload,
    });
  };
};

export const openPayModal = (id, loanId, loanAmount, image, name, reload) => {
  return async (dispatch) => {
    dispatch({
      type: SHOW_PAY_MODAL,
      id: id,
      loanId: loanId,
      loanAmount: loanAmount,
      image: image,
      name: name,
      reload: reload,
    });
  };
};

export const closeModal = (id) => {
  return async (dispatch) => {
    switch (id) {
      case SHOW_CONNECT_MODAL:
        dispatch({
          type: HIDE_CONNECT_MODAL,
        });
      case SHOW_WALLET_CONNECT_MODAL:
        dispatch({
          type: HIDE_WALLET_CONNECT_MODAL,
        });
      case SHOW_LOADING_MODAL:
        dispatch({
          type: HIDE_LOADING_MODAL,
        });
      case SHOW_LEND_MODAL:
        dispatch({
          type: HIDE_LEND_MODAL,
        });
      case SHOW_PAY_MODAL:
        dispatch({
          type: HIDE_PAY_MODAL,
        });
    }
  };
};

export const connectWallet = (address) => {
  return async (dispatch) => {
    dispatch({
      type: CONNECT_WALLET,
      address: address,
    });
  };
};

export const disconnectWallet = () => {
  return async (dispatch) => {
    dispatch({
      type: DISCONNECT_WALLET,
    });
  };
};
