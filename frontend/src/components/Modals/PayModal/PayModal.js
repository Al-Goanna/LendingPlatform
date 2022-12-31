import React, {useRef, useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SHOW_PAY_MODAL, SHOW_LOADING_MODAL} from 'Root/services/constants/ActionTypes';

import {openLoadingModal, closeModal} from 'Root/services/actions/actions';
import {myAlgoWallet, walletConnect} from 'Root/services/reducers/connect/connect';

import {signTransactions} from 'Root/helpers/signTransactions';

import toast from 'react-hot-toast';

import algosdk from 'algosdk';

import axios from 'axios';

import AlgoImage from 'Root/images/algo.png';

const PayModal = ({address, payModal, closeModal, showLoadingModal, walletConnect, myAlgoWallet}) => {
  if (!payModal) {
    return null;
  }

  const [payAmountIndex, setPayAmountIndex] = useState(5);

  /**
  * Function to pay loan for an NFT that is lent
  * @param {number} nftId
  * @param {number} loanId
  * @param {number} loanAmount
  * @param {number} payAmountIndex pay amount index
  */
  async function pay(nftId, loanId, loanAmount, payAmountIndex) {
    let payAmount;
    let transactionsToSend;

    switch (payAmountIndex) {
      case 1:
        payAmount = loanAmount * 0.1;
        break;
      case 2:
        payAmount = loanAmount * 0.25;
        break;
      case 3:
        payAmount = loanAmount * 0.5;
        break;
      case 4:
        payAmount = loanAmount * 0.75;
        break;
      case 5:
        payAmount = loanAmount;
        break;
      default:
        payAmount = loanAmount;
    }

    const paramsResponse = await axios.get(process.env.REACT_APP_API_ADDRESS + 'getParams');
    const params = paramsResponse.data;

    if (payAmount === loanAmount) {
      const optInTransaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams: {
          ...params,
        },
        from: address,
        to: address,
        assetIndex: nftId,
        amount: 0,
      });

      const appArgs = [
        new Uint8Array(Buffer.from('pay')),
      ];

      const payTransaction = algosdk.makeApplicationNoOpTxnFromObject({
        suggestedParams: {
          ...params,
        },
        from: address,
        appIndex: loanId,
        appArgs: appArgs,
        foreignAssets: [nftId],
      });

      payTransaction.fee = 3000;

      const fundTransaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams: {
          ...params,
        },
        from: address,
        to: algosdk.getApplicationAddress(loanId),
        amount: algosdk.algosToMicroalgos(payAmount),
      });

      const txnsToGroup = [optInTransaction, payTransaction, fundTransaction];

      const groupID = algosdk.computeGroupID(txnsToGroup);
      for (let i = 0; i < txnsToGroup.length; i++) txnsToGroup[i].group = groupID;

      transactionsToSend = await signTransactions(
          walletConnect, myAlgoWallet, txnsToGroup,
      );

      if (transactionsToSend) {
        showLoadingModal();
        await axios.post(process.env.REACT_APP_API_ADDRESS + 'pay',
            {
              'pay_transactions': transactionsToSend,
            })
            .then(() => {
              toast.success('Loan Repayment Successful');
              payModal.reload();
            })
            .catch(() => {
              toast.error('An Error Occurred.');
            })
            .finally(() => {
              closeModal(SHOW_LOADING_MODAL);
            });
      }
    } else {
      const appArgs = [
        new Uint8Array(Buffer.from('partial_pay')),
      ];

      const payTransaction = algosdk.makeApplicationNoOpTxnFromObject({
        suggestedParams: {
          ...params,
        },
        from: address,
        appIndex: loanId,
        appArgs: appArgs,
        foreignAssets: [nftId],
      });

      payTransaction.fee = 2000;

      const fundTransaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams: {
          ...params,
        },
        from: address,
        to: algosdk.getApplicationAddress(loanId),
        amount: algosdk.algosToMicroalgos(payAmount),
      });

      const txnsToGroup = [payTransaction, fundTransaction];

      const groupID = algosdk.computeGroupID(txnsToGroup);
      for (let i = 0; i < txnsToGroup.length; i++) txnsToGroup[i].group = groupID;

      transactionsToSend = await signTransactions(
          walletConnect, myAlgoWallet, txnsToGroup,
      );

      if (transactionsToSend) {
        showLoadingModal();
        await axios.post(process.env.REACT_APP_API_ADDRESS + 'partialPay',
            {
              'partial_pay_transactions': transactionsToSend,
            })
            .then(() => {
              toast.success('Partial Loan Repayment Successful');
              payModal.reload();
            })
            .catch(() => {
              toast.error('An Error Occurred.');
            })
            .finally(() => {
              closeModal(SHOW_LOADING_MODAL);
            });
      }
    }
  }

  const modalRef = useRef();

  const closeModalBackground = (e) => {
    if (modalRef.current === e.target) {
      closeModal(SHOW_PAY_MODAL);
    }
  };

  const keyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal(SHOW_PAY_MODAL);
    }
  }, [closeModal]);

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  });


  return (
    <>
      { payModal.type === SHOW_PAY_MODAL &&
        <div ref={modalRef} onClick={closeModalBackground} className='modal fade show d-inline' id='payModal'>
          <div className='modal-dialog modal-dialog-centered modal-md'>
            <div className='modal-content rounded-big bg-body border-body'>
              <div className='modal-header border-none text-body'>
                <h6 className='modal-title text-truncate' id='payModalLabel'>
                  <small className='d-block light-weight text-brand'>Pay Loan:</small>{payModal.name}</h6>
                <button type='button' className='btn-close' onClick={() => closeModal(SHOW_PAY_MODAL)}></button>
              </div>
              <div className='modal-body p-3 px-md-4 pt-0'>
                <img className="img-fluid rounded-big mb-3" src={payModal.image} />
                <div className='row my-3'>
                  <div className='col'>
                    <div className='input-group d-none'>
                      <span className='input-group-text bg-body-dark border-body-light' id='list-addon'>
                        <img src={AlgoImage} className='invert' width='10px'/>
                      </span>
                      <input id='listInput' onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          pay(payModal.id, payModal.loanId, payModal.loanAmount, payAmountIndex);
                        }
                      }} type='number' className='form-control bg-body-dark border-body-light text-body'
                      placeholder='Algo lend price...' aria-label='Pay' aria-describedby='list-addon' />
                    </div>
                    <label htmlFor="timeframe" className="form-label"><strong>Payment:</strong>
                      <span className='text-brand ps-2'>
                        {payAmountIndex === 1 && `10% = ${(payModal.loanAmount * 0.1).toFixed(6)} $ALGO`}
                        {payAmountIndex === 2 && `25% = ${(payModal.loanAmount * 0.25).toFixed(6)} $ALGO`}
                        {payAmountIndex === 3 && `50% = ${(payModal.loanAmount * 0.5).toFixed(6)} $ALGO`}
                        {payAmountIndex === 4 && `75% = ${(payModal.loanAmount * 0.75).toFixed(6)} $ALGO`}
                        {payAmountIndex === 5 && `100% = ${(payModal.loanAmount).toFixed(6)} $ALGO`}
                      </span>
                    </label>
                    <input type="range" className="form-range" min="1" max="5" step="1" defaultValue="5" id="timeframe"
                      onChange={(e) => setPayAmountIndex(parseInt(e.target.value))}></input>
                  </div>
                  <div className='col-auto'>
                    <button onClick={() => {
                      pay(payModal.id, payModal.loanId, payModal.loanAmount, payAmountIndex);
                    }} type='button' className='btn btn-primary px-3 ' data-bs-dismiss='modal'>Pay</button>
                  </div>
                </div>
                <small className='d-block my-3 text-center text-body-25'>
                  Be sure to double-check your payment amount.</small>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  payModal: state.payModal,
  address: state.connect?.address,
  myAlgoWallet: myAlgoWallet,
  walletConnect: walletConnect,
});

const mapDispatchToProps = (dispatch) => ({
  showLoadingModal: () => dispatch(openLoadingModal()),
  closeModal: (id) => dispatch(closeModal(id)),
});

PayModal.propTypes = {
  address: PropTypes.string,
  payModal: PropTypes.object,
  showLoadingModal: PropTypes.func,
  closeModal: PropTypes.func,
  walletConnect: PropTypes.object,
  myAlgoWallet: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(PayModal);
