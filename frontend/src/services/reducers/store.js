import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {connectModal, walletConnectModal, loadingModal, lendModal, payModal} from './modal/modal';
import {connect} from './connect/connect';

export default createStore(
    combineReducers({connectModal, walletConnectModal, loadingModal, lendModal, payModal, connect}),
    applyMiddleware(thunk),
);
