import React, {useRef, useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SHOW_LEND_MODAL, SHOW_LOADING_MODAL} from 'Root/services/constants/ActionTypes';

import {openLoadingModal, closeModal} from 'Root/services/actions/actions';
import {myAlgoWallet, walletConnect} from 'Root/services/reducers/connect/connect';

import {signTransactions} from 'Root/helpers/signTransactions';

import toast from 'react-hot-toast';

import algosdk from 'algosdk';

import axios from 'axios';

import AlgoImage from 'Root/images/algo.png';

const LendModal = ({address, lendModal, closeModal, showLoadingModal, walletConnect, myAlgoWallet}) => {
  if (!lendModal) {
    return null;
  }

  const [timeFrame, setTimeFrame] = useState(1);

  /**
  * Function to send an NFT to a created listing
  * @param {number} nftId
  * @param {number} loanLengthIndex loan length index
  */
  async function lend(nftId, loanLengthIndex) {
    let loanLength;

    switch (loanLengthIndex) {
      case 1:
        loanLength = 604800;
        break;
      case 2:
        loanLength = 1209600;
        break;
      case 3:
        loanLength = 2630000;
        break;
      case 4:
        loanLength = 7890000;
        break;
      case 5:
        loanLength = 15780000;
        break;
      default:
        loanLength = 604800;
    }

    showLoadingModal();
    const contract = await axios.get(process.env.REACT_APP_API_ADDRESS +
      `createLoan?nftId=${nftId}&loanLength=${loanLength}`)
        .catch(() => {
          toast.error('An Error Occurred.');
        })
        .finally(() => {
          closeModal(SHOW_LOADING_MODAL);
        });

    const appId = contract.data.app_id;

    const paramsResponse = await axios.get(process.env.REACT_APP_API_ADDRESS + 'getParams');
    const params = paramsResponse.data;

    const appArgs = [
      new Uint8Array(Buffer.from('lend')),
    ];

    const lendTransaction = algosdk.makeApplicationNoOpTxnFromObject({
      suggestedParams: {
        ...params,
      },
      from: address,
      appIndex: parseInt(appId),
      appArgs: appArgs,
      foreignAssets: [nftId],
    });

    lendTransaction.fee = 2000;

    const assetTransferTransaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: address,
      to: algosdk.getApplicationAddress(parseInt(appId)),
      assetIndex: nftId,
      amount: 1,
    });


    const txnsToGroup = [lendTransaction, assetTransferTransaction];

    const groupID = algosdk.computeGroupID(txnsToGroup);
    for (let i = 0; i < txnsToGroup.length; i++) txnsToGroup[i].group = groupID;

    const transactionsToSend = await signTransactions(
        walletConnect, myAlgoWallet, txnsToGroup,
    );

    if (transactionsToSend) {
      showLoadingModal();
      await axios.post(process.env.REACT_APP_API_ADDRESS + 'lend',
          {
            'lend_transactions': transactionsToSend,
          })
          .then(() => {
            toast.success('Loaned NFT Successfully!');
            lendModal.reload();
          })
          .catch(() => {
            toast.error('An Error Occurred.');
          })
          .finally(() => {
            closeModal(SHOW_LOADING_MODAL);
            closeModal(SHOW_LEND_MODAL);
          });
    } else {
      closeModal(SHOW_LOADING_MODAL);
      closeModal(SHOW_LEND_MODAL);
    }
  }

  const modalRef = useRef();

  const closeModalBackground = (e) => {
    if (modalRef.current === e.target) {
      closeModal(SHOW_LEND_MODAL);
    }
  };

  const keyPress = useCallback((e) => {
    if (e.key === 'Escape') {
      closeModal(SHOW_LEND_MODAL);
    }
  }, [closeModal]);

  useEffect(() => {
    document.addEventListener('keydown', keyPress);
    return () => document.removeEventListener('keydown', keyPress);
  });


  return (
    <>
      { lendModal.type === SHOW_LEND_MODAL &&
        <div ref={modalRef} onClick={closeModalBackground} className='modal fade show d-inline' id='lendModal'>
          <div className='modal-dialog modal-dialog-centered modal-md'>
            <div className='modal-content rounded-big bg-body border-body'>
              <div className='modal-header border-none text-body'>
                <h6 className='modal-title text-truncate' id='lendModalLabel'>
                  <small className='d-block light-weight text-brand'>Lend NFT:</small>{lendModal.name}</h6>
                <button type='button' className='btn-close' onClick={() => closeModal(SHOW_LEND_MODAL)}></button>
              </div>
              <div className='modal-body p-3 px-md-4 pt-0'>
                <img className="img-fluid rounded-big mb-3" src={lendModal.image} />
                <div className='row align-items-end my-3 g-3'>
                  <div className='col-12'>
                    <div className='input-group d-none'>
                      <span className='input-group-text bg-body-dark border-body-light' id='list-addon'>
                        <img src={AlgoImage} className='invert' width='10px'/>
                      </span>
                      <input id='listInput' onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                          lend(lendModal.id, timeFrame);
                        }
                      }} type='number' className='form-control bg-body-dark border-body-light text-body'
                      placeholder='Algo lend price...' aria-label='Lend' aria-describedby='list-addon' />
                    </div>
                    <label htmlFor="timeframe" className="form-label"><strong>Loan length:</strong>
                      <span className='text-brand ps-2'>
                        {timeFrame === 1 && '1 Week'}
                        {timeFrame === 2 && '2 Weeks'}
                        {timeFrame === 3 && '1 Month'}
                        {timeFrame === 4 && '3 Months'}
                        {timeFrame === 5 && '6 Months'}
                      </span>
                    </label>
                    <input type="range" className="form-range" min="1" max="5" step="1" defaultValue="1" id="timeframe"
                      onChange={(e) => setTimeFrame(parseInt(e.target.value))}></input>
                  </div>
                  <div className='col'>
                    <strong>Total repayable:</strong>
                    <span className='text-brand ps-2'>
                      {timeFrame === 1 && `1 $ALGO + 30% APY = 
                      ${(1 + (1 * (604800/31536000)) * 1.3).toFixed(2)} $ALGO`}
                      {timeFrame === 2 && `1 $ALGO + 30% APY = 
                      ${(1 + (1 * (1209600/31536000)) * 1.3).toFixed(2)} $ALGO`}
                      {timeFrame === 3 && `1 $ALGO + 30% APY = 
                      ${(1 + (1 * (2630000/31536000)) * 1.3).toFixed(2)} $ALGO`}
                      {timeFrame === 4 && `1 $ALGO + 30% APY = 
                      ${(1 + (1 * (7890000/31536000)) * 1.3).toFixed(2)} $ALGO`}
                      {timeFrame === 5 && `1 $ALGO + 30% APY = 
                      ${(1 + (1 * (15780000/31536000)) * 1.3).toFixed(2)} $ALGO`}
                    </span>
                  </div>
                  <div className='col-auto'>
                    <button onClick={() => {
                      lend(lendModal.id, timeFrame);
                    }} type='button' className='btn btn-primary px-3 ' data-bs-dismiss='modal'>Lend</button>
                  </div>
                  <div className='col-12 pt-3 text-center text-muted'>
                    <small>Be sure to double-check your loan length.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  lendModal: state.lendModal,
  address: state.connect?.address,
  myAlgoWallet: myAlgoWallet,
  walletConnect: walletConnect,
});

const mapDispatchToProps = (dispatch) => ({
  showLoadingModal: () => dispatch(openLoadingModal()),
  closeModal: (id) => dispatch(closeModal(id)),
});

LendModal.propTypes = {
  address: PropTypes.string,
  lendModal: PropTypes.object,
  showLoadingModal: PropTypes.func,
  closeModal: PropTypes.func,
  walletConnect: PropTypes.object,
  myAlgoWallet: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(LendModal);
