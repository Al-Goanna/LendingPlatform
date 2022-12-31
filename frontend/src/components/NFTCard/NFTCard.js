import React from 'react';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import {openLendModal, openPayModal} from 'Root/services/actions/actions';
import {myAlgoWallet, walletConnect} from 'Root/services/reducers/connect/connect';

import AlgoImage from 'Root/images/algo.png';

const NFTCard = ({
  showLendModal, showPayModal, id, loanId, name, image, rank, price, isOwner, reload, small = false, amount = 1,
}) => {
  return (
    <>
      <div className="nft-item col-12 col-sm-6 col-md-4 col-xl-3">
        <div className="card text-body bg-body border border-body h-100 position-relative">
          {rank && (
            <span className="rarity">
              <small className="xs">
                <i className="fa-regular fa-crown"></i> {rank}
              </small>
            </span>
          )}
          {image?.endsWith('.webm') || image?.endsWith('.mp4') ?
          (
            <video className='thumbnail card-img-top' autoPlay loop>
              <source src={image} type={'video/webm'} />
            </video>
          ) :
          (
            <div className="thumbnail card-img-top" style={{
              backgroundImage: `url("${image}")`,
            }}>
              <img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                width="800px" height="auto"
                className="card-img-top" alt=""/></div>
          )}
          <div className="card-body p-3">
            <p className="mb-0 fw-bold">{name} {amount > 1 && (`x${amount}`)}</p>
            <small className="text-body-25">{id}</small>
          </div>
          <div className="card-footer p-3">
            <div className="row align-items-end g-0">
              <div className="col"><small className="text-muted">{loanId ? 'Loan' : 'Our'} Value:</small><br/>
                <img src={AlgoImage} width="10px" className="align-baseline" alt="$ALGO"/> {price || 1}</div>
              {isOwner ? (price && loanId ? (
                  <div className="col-auto text-start"><button className="btn btn-info px-3 rounded-pill"
                    onClick={(e) => {
                      e.preventDefault(); showPayModal(id, loanId, price, image, name, reload);
                    }} >Pay</button></div>
                ) : (
                  !price && (
                    <>
                      <div className="col-auto text-start"><button className="btn btn-primary px-3 rounded-pill"
                        onClick={(e) => {
                          e.preventDefault(); showLendModal(id, image, name, reload);
                        }} >Loan</button></div>
                    </>
                  )
                )
                ) : price && loanId && (
                  <></>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  address: state.connect?.address,
  myAlgoWallet: myAlgoWallet,
  walletConnect: walletConnect,
});

const mapDispatchToProps = (dispatch) => ({
  showLendModal: (id, image, name, reload) => dispatch(openLendModal(id, image, name, reload)),
  showPayModal: (id, loanId, loanAmount, image, name, reload) =>
    dispatch(openPayModal(id, loanId, loanAmount, image, name, reload)),
});

NFTCard.propTypes = {
  showLendModal: PropTypes.func,
  showPayModal: PropTypes.func,
  id: PropTypes.number,
  loanId: PropTypes.number,
  name: PropTypes.string,
  image: PropTypes.string,
  rank: PropTypes.number,
  price: PropTypes.number,
  isOwner: PropTypes.bool,
  reload: PropTypes.func,
  small: PropTypes.bool,
  amount: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(NFTCard);
