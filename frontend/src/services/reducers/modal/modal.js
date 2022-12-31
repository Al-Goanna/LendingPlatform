import {SHOW_CONNECT_MODAL, SHOW_WALLET_CONNECT_MODAL,
  SHOW_LOADING_MODAL, SHOW_LEND_MODAL, SHOW_PAY_MODAL, HIDE_CONNECT_MODAL, HIDE_WALLET_CONNECT_MODAL,
  HIDE_LOADING_MODAL, HIDE_LEND_MODAL, HIDE_PAY_MODAL} from '../../constants/ActionTypes';

export const connectModal = (state = null, action) => {
  switch (action.type) {
    case SHOW_CONNECT_MODAL:
      return {
        type: action.type,
      };
    case HIDE_CONNECT_MODAL:
      return null;
    default:
      return state;
  }
};

export const walletConnectModal = (state = null, action) => {
  switch (action.type) {
    case SHOW_WALLET_CONNECT_MODAL:
      return {
        type: action.type,
      };
    case HIDE_WALLET_CONNECT_MODAL:
      return null;
    default:
      return state;
  }
};

export const loadingModal = (state = null, action) => {
  switch (action.type) {
    case SHOW_LOADING_MODAL:
      return {
        type: action.type,
      };
    case HIDE_LOADING_MODAL:
      return null;
    default:
      return state;
  }
};

export const lendModal = (state = null, action) => {
  switch (action.type) {
    case SHOW_LEND_MODAL:
      return {
        type: action.type,
        id: action.id,
        image: action.image,
        name: action.name,
        reload: action.reload,
      };
    case HIDE_LEND_MODAL:
      return null;
    default:
      return state;
  }
};

export const payModal = (state = null, action) => {
  switch (action.type) {
    case SHOW_PAY_MODAL:
      return {
        type: action.type,
        id: action.id,
        loanId: action.loanId,
        loanAmount: action.loanAmount,
        image: action.image,
        name: action.name,
        reload: action.reload,
      };
    case HIDE_PAY_MODAL:
      return null;
    default:
      return state;
  }
};
