import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import PropTypes from 'prop-types';

import {openConnectModal, disconnectWallet} from 'Root/services/actions/actions';

import {shortenAddress} from 'Root/helpers/shortenAddress';

import axios from 'axios';

// import Logo from 'Root/images/shufl.webp';
import AlgoImage from 'Root/images/algo.png';
import Logo from 'Root/images/logo-pink.png';

import ClipLoader from 'react-spinners/ClipLoader';

const Navbar = ({address, showConnectModal, disconnectWallet}) => {
  const [algo, setAlgo] = useState(0);

  const [algoLoading, setAlgoLoading] = useState(false);

  useEffect(() => {
    setAlgoLoading(true);
    if (address) {
      axios.get(process.env.REACT_APP_API_ADDRESS + `getAlgo?public_key=${address}`).then((response) => {
        setAlgo(response.data);
      }).finally(() => {
        setAlgoLoading(false);
      });
    }
  }, [address]);

  return (
    <>
      <div className="p-3 bg-dark rounded-top border-bottom border-dark">
        <div className="row align-items-center">
          <div className="col-auto">
            <Link to="/"><img src={Logo} className="img-fluid" width="80px" height="auto" /></Link>
          </div>
          <div className="col text-center text-white">
              Algorand NFT Liquidity Unlocker
          </div>
          <div className="col-auto">
            {address ? <div className="dropdown d-inline-block">
              <button className="btn btn-primary btn-sm px-3 dropdown-toggle" type="button"
                id="walletDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa-light fa-wallet"></i>
                <span className="d-inline d-lg-none d-xl-inline">
                  {address ? '' : 'Connect'}
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-center text-center py-3 rounded-big"
                aria-labelledby="walletDropdown">
                <li>
                  <p className="dropdown-item mb-0"><img className='mr-1 algo' src={AlgoImage}/>
                    {!algoLoading ? (
                <>
                  &nbsp;{algo.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}&nbsp;
                </>
              ) : (
                <>
                  &nbsp;<ClipLoader size={16} color="#df57eb" />
                </>
              )}
                  </p>
                </li>
                <li>
                  <a className="dropdown-item" to={`/wallet/${address}`}>{shortenAddress(address)}</a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={disconnectWallet}>Disconnect</a>
                </li>
              </ul>
            </div> : <a onClick={showConnectModal} className="btn btn-primary btn-sm px-3">Connect</a> }
          </div>
        </div>
      </div>
    </>
  );
};


const mapStateToProps = (state) => ({
  address: state.connect?.address,
});

const mapDispatchToProps = (dispatch) => ({
  showConnectModal: () => dispatch(openConnectModal()),
  disconnectWallet: () => dispatch(disconnectWallet()),
});

Navbar.propTypes = {
  address: PropTypes.string,
  showConnectModal: PropTypes.func,
  disconnectWallet: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
