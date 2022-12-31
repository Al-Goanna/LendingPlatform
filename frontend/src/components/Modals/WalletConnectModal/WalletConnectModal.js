import React, {useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SHOW_WALLET_CONNECT_MODAL} from 'Root/services/constants/ActionTypes';

import {closeModal} from 'Root/services/actions/actions';

import {Background, ModalWrapper, CloseModalButton,
  ModalHeader, WalletConnectTextWrapper} from './WalletConnectModalElements';

const WalletConnectModal = ({walletConnectModal, closeModal}) => {
  const modalRef = useRef();

  if (!walletConnectModal) {
    return null;
  }

  return (
    <>
      { walletConnectModal.type === SHOW_WALLET_CONNECT_MODAL &&
            <Background ref={modalRef}>
              <ModalWrapper>
                <CloseModalButton onClick={() => closeModal(SHOW_WALLET_CONNECT_MODAL)}/>
                <ModalHeader>
                        Transaction Pending
                </ModalHeader>
                <WalletConnectTextWrapper>
                  <p>Please Check the Pera App To Proceed</p>
                </WalletConnectTextWrapper>
              </ModalWrapper>
            </Background>
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  walletConnectModal: state.walletConnectModal,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: (id) => dispatch(closeModal(id)),
});

WalletConnectModal.propTypes = {
  walletConnectModal: PropTypes.object,
  closeModal: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnectModal);
