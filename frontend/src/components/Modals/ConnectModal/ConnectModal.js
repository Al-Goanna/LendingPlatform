import React, {useRef, useCallback, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SHOW_CONNECT_MODAL} from 'Root/services/constants/ActionTypes';

import {closeModal, connectWallet} from 'Root/services/actions/actions';
import {myAlgoWallet, walletConnect}
  from 'Root/services/reducers/connect/connect';

import {Background, ModalWrapper, CloseModalButton, ConnectButtonWrapper,
  ConnectButton, ButtonLogo, ModalHeader} from './ConnectModalElements';
import MyAlgoLogo from 'Root/images/myalgo-wallet.png';
import OfficialAlgoLogo from 'Root/images/pera-wallet.png';

import {shortenAddress} from 'Root/helpers/shortenAddress';

import {disconnectWallet} from 'Root/services/actions/actions';

const ConnectModal = ({connectModal, closeModal, walletConnect, myAlgoWallet,
  address, connectWallet, disconnectWallet}) => {
  /**
  * Connects to MyAlgo and sets address in localstorage.
  */
  async function connectToMyAlgo() {
    try {
      const accounts = await myAlgoWallet.connect({shouldSelectOneAccount: true});
      const addresses = accounts.map((account) => account.address);
      if (addresses) {
        connectWallet(addresses[0]);
        localStorage.setItem('myAlgoAddress', addresses[0]);
        closeModal(SHOW_CONNECT_MODAL);
        window.location.href = '/wallet';
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
  * Connects to WalletConnect.
  */
  async function connectToWalletConnect() {
    closeModal(SHOW_CONNECT_MODAL);
    walletConnect.connect().then((newAccounts) => {
      // Setup the disconnect event listener
      walletConnect.connector?.on('disconnect', disconnect);

      connectWallet(newAccounts[0]);
    }).reject((error) => {
      if (error?.data?.type !== 'CONNECT_MODAL_CLOSED') {
        // log the necessary errors
      }
    });
  }

  /**
  * Disconnects either MyAlgo or WalletConnect wallet.
  */
  function disconnect() {
    disconnectWallet();
  }

  /**
  * Copies the users wallet to the clipboard.
  * @param {string} address Users Wallet Address.
  */
  function copyAddress(address) {
    navigator.clipboard.writeText(address);
    document.querySelector('.connect-button-wrapper p').textContent = 'Copied';
    setTimeout(function() {
      if (document.querySelector('.connect-button-wrapper p')) {
        document.querySelector('.connect-button-wrapper p').textContent = shortenAddress(address, 10);
      }
    }, 1000);
  }

  const modalRef = useRef();

  const closeModalBackground = (e) => {
    if (modalRef.current === e.target) {
      closeModal(SHOW_CONNECT_MODAL);
    }
  };

  const keyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal(SHOW_CONNECT_MODAL);
    }
  }, [closeModal]);

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  });

  if (!connectModal) {
    return null;
  }

  return (
    <>
      { connectModal.type === SHOW_CONNECT_MODAL &&
        <Background ref={modalRef} onClick={closeModalBackground}>
          <ModalWrapper>
            <CloseModalButton onClick={closeModal}/>
            <ModalHeader>
              {!address ? 'Connect Your Wallet' : 'Wallet Connected' }
            </ModalHeader>
            <ConnectButtonWrapper className="row">
              {!address ?
                  <>
                    <div className='col-6 col-sm-5 offset-sm-1'>
                      <ConnectButton onClick={connectToMyAlgo}>
                        <ButtonLogo src={MyAlgoLogo} className="img-fluid"/>
                        <span className="sr-only">MyAlgo Wallet</span>
                      </ConnectButton>
                    </div>
                    <div className='col-6 col-sm-5'>
                      <ConnectButton onClick={connectToWalletConnect}>
                        <ButtonLogo src={OfficialAlgoLogo} className="img-fluid"/>
                        <span className="sr-only">Pera Wallet</span>
                      </ConnectButton>
                    </div>
                  </> :
                  <>
                    <div className='col-12 text-center'>
                      <p onClick={() => {
                        copyAddress(address);
                      }}>
                        {shortenAddress(address)}
                      </p>
                      <ConnectButton className="btn btn-primary" onClick={disconnect}>
                        Disconnect
                      </ConnectButton>
                    </div>
                  </>
              }
            </ConnectButtonWrapper>
          </ModalWrapper>
        </Background>
      }

    </>
  );
};

const mapStateToProps = (state) => ({
  connectModal: state.connectModal,
  walletConnect: walletConnect,
  myAlgoWallet: myAlgoWallet,
  address: state.connect?.address,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: (id) => dispatch(closeModal(id)),
  connectWallet: (address) => dispatch(connectWallet(address)),
  disconnectWallet: () => dispatch(disconnectWallet()),
});

ConnectModal.propTypes = {
  connectModal: PropTypes.object,
  closeModal: PropTypes.func,
  walletConnect: PropTypes.object,
  myAlgoWallet: PropTypes.object,
  address: PropTypes.string,
  connectWallet: PropTypes.func,
  disconnectWallet: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectModal);
