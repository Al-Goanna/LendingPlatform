import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import {shortenAddress} from 'Root/helpers/shortenAddress';

import {myAlgoWallet, walletConnect} from 'Root/services/reducers/connect/connect';
import {openLoadingModal, closeModal} from 'Root/services/actions/actions';

import NFTCard from 'Root/components/NFTCard/NFTCard';

import ClipLoader from 'react-spinners/ClipLoader';

import algosdk from 'algosdk';

import axios from 'axios';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const WalletSection = ({address}) => {
  const [assets, setAssets] = useState([]);
  const [currentAssets, setCurrentAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(false);

  const [filterCollection, setFilterCollection] = useState('all');
  const [loanedAssets, setLoanedAssets] = useState([]);
  const [loanedAssetsLoading, setLoanedAssetsLoading] = useState(false);
  const [nfd, setNfd] = useState([]);

  const [tradeableAssetsCount, setTradeableAssetsCount] = useState(0);

  useEffect(() => {
    document.title=shortenAddress(address);
    setAssetsLoading(true);
    axios.post(process.env.REACT_APP_API_ADDRESS + 'getAssetsByCollection', {
      'public_key': address,
    }).then((response) => {
      setAssets(response.data);
      setCurrentAssets(response.data);
    }).finally(() => {
      setAssetsLoading(false);
    });

    axios.get(process.env.REACT_APP_API_ADDRESS + `getLoans?public_key=${address}`).then((response) => {
      setLoanedAssets(response.data);
    }).finally(() => {
      setLoanedAssetsLoading(false);
    });

    axios.get(`https://api.nf.domains/nfd/address?address=${address}&view=full&limit=1`).then((response) => {
      const nfdData = response.data[0];
      if (nfdData.properties.verified.avatar) {
        nfdData.properties.verified.avatar =
          nfdData.properties.verified.avatar.replace('ipfs://',
              'https://app.nf.domains/_next/image?url=https%3A%2F%2Fimages.nf.domains%2Fipfs%2F');
        nfdData.properties.verified.avatar = nfdData.properties.verified.avatar + '&w=384&q=75';
      }
      if (nfdData.properties.verified.banner) {
        nfdData.properties.verified.banner =
        nfdData.properties.verified.banner.replace('ipfs://', 'https://ipfs.algonft.tools/ipfs/');
      }
      if (nfdData.properties.userDefined.banner) {
        nfdData.properties.userDefined.banner =
        nfdData.properties.userDefined.banner.replace('ipfs://', 'https://ipfs.algonft.tools/ipfs/');
      }
      setNfd(nfdData);
    }).catch(() => {
      setNfd([]);
    });
  }, [address]);

  useEffect(() => {
    let count = 0;
    for (const element of Object.entries(assets)) {
      count += element[1].length;
    }
    setTradeableAssetsCount(count);
  }, [assets]);

  useEffect(()=>{
    // Add locale once
    TimeAgo.addLocale(en);
  }, []);

  /**
   * Gets the collections image
   * @param {string} name
   */
  function getCollectionImg(name) {
    const imgId = name.replace(/\s/g, '')+'Img';
    axios.get(process.env.REACT_APP_API_ADDRESS + `getCollection?name=${encodeURIComponent(name)}`)
        .then((response) => {
          if (response.data.preview.includes('https://images.shufl.app/')) {
            if (document.getElementById(imgId)) {
              document.getElementById(imgId).innerHTML =
            `<img src="${response.data.preview}" width="40" class="img-fluid rounded-circle" />`;
            }
          } else {
            if (document.getElementById(imgId)) {
              document.getElementById(imgId).innerHTML =
            `<img src="https://shufl.app${response.data.preview}" width="40" class="img-fluid rounded-circle" />`;
            }
          }
        });
  }

  /**
  * Set sort state and add filter params to URL
  */
  function setCollection() {
    const ele = document.getElementsByName('collection');
    let i;
    for (i = 0; i < ele.length; i++) {
      if (ele[i].checked) {
        document.getElementById('collection').value = ele[i].value;
      }
    }
    const collectionElement = document.getElementById('collection');
    setFilterCollection(collectionElement.value);
    setCurrentAssets(
        Object.fromEntries(Object.entries(assets).filter(([key]) => key.includes(collectionElement.value))),
    );
  }

  /**
  * Function to reload assets on wallet page
  */
  function reload() {
    axios.post(process.env.REACT_APP_API_ADDRESS + 'getAssetsByCollection', {
      'public_key': address,
    }).then((response) => {
      setAssets(response.data);
      setCurrentAssets(response.data);
    });

    axios.get(process.env.REACT_APP_API_ADDRESS + `getLoans?public_key=${address}`).then((response) => {
      setLoanedAssets(response.data);
    }).finally(() => {
      setLoanedAssetsLoading(false);
    });
  }

  return (
    address ? (
      <>
        {nfd.properties ? (
          <>
            <div className='row align-items-center g-4'>
              <div className='col-4 col-xl-3'>
                {nfd.properties.verified?.avatar && (
                  <>
                    <img src={nfd.properties.verified.avatar}
                      className='img-fluid rounded-circle me-3' width='140'/>
                  </>
                )}
                {nfd.properties.userDefined?.avatar && (
                  <>
                    <img src={nfd.properties.userDefined.avatar}
                      className='img-fluid rounded-circle me-3' width='140'/>
                  </>
                )}
                {!nfd.properties.verified.avatar && !nfd.properties.userDefined.avatar && (
                  <img src='https://app.nf.domains/_next/image?url=%2Fimg%2Fnfd-image-placeholder.jpg&w=750&q=75'
                    className='img-fluid rounded-circle me-3' width='140'/>
                )}
              </div>
              <div className='col'>
                {nfd.name ? (
                  <h3 className="text-truncate mb-0">{nfd.name}</h3>
                ):(
                  <h3 className="text-truncate mb-0">{shortenAddress(address)}</h3>
                )}
                <p className="text-truncate text-muted mb-0 small">
                  <i className="fa-light fa-wallet"></i> {address}</p>
              </div>
            </div>
          </>
          ):(
            <div className='row align-items-center g-0'>
              <div className='col-auto'>
                <img src='https://app.nf.domains/_next/image?url=%2Fimg%2Fnfd-image-placeholder.jpg&w=750&q=75'
                  className='img-fluid rounded-circle me-3' width='60'/>
              </div>
              <div className='col'>
                <h3 className="text-truncate mb-0">{shortenAddress(address)}</h3>
                <p className="text-truncate text-muted mb-0 small">
                  <i className="fa-light fa-wallet"></i> {address}</p>
              </div>
              <div className='col-12 pt-3'></div>
            </div>
          )}
        <ul className="nav nav-pills pt-5  mb-4" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="tradeable-tab"
              data-bs-toggle="tab" data-bs-target="#tradeable"
              type="button" role="tab" aria-controls="tradeable" aria-selected="true">
                  Liquidity Enabled NFTs ({tradeableAssetsCount})
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="listings-tab" data-bs-toggle="tab"
              data-bs-target="#listings"
              type="button" role="tab" aria-controls="listings"
              aria-selected="false">My Liquidity ({Object.entries(loanedAssets).length})</button>
          </li>
        </ul>
        <div className="tab-content" id="walletTabs">
          <div className="tab-pane fade show active"
            id="tradeable" role="tabpanel" aria-labelledby="tradeable-tab">
            <div className='pb-5 d-flex align-items-center justify-content-end'>
              {tradeableAssetsCount > 0 && (
                <div className='flex-grow-1 text-muted'>
                  {tradeableAssetsCount} NFTs available for liquidity...
                </div>
              )}
              <div className="dropdown collection-style">
                <button className="rounded-big bg-body border-1 border-body form-select"
                  type="button" id="sortMenu" data-bs-toggle="dropdown" aria-expanded="false">
                    Select Collection
                </button>
                <div className="dropdown-menu dropdown-menu-end rounded-big border-brand"
                  aria-labelledby="sortMenu" onChange={setCollection}>
                  <input id="collection" value={filterCollection} type='hidden' />
                  <div className='internal-scroll'>
                    {!assetsLoading ? (Object.entries(assets)?.map(([collection, collectionNfts]) => (
                      collectionNfts.length > 0 && (
                        <div className="position-relative border-bottom border-dark"
                          aria-labelledby={collection.replace(/\s/g, '')+'Menu'} key={collection}>
                          <p className='text-truncate m-0'>
                            <input id={collection.replace(/\s/g, '')+'Filter'} type="radio"
                              className='form-check-input ps-1' key={collection}
                              name='collection'
                              value={collection} data-bs-toggle="collapse"
                              data-bs-target={'#'+collection.replace(/\s/g, '')} role="button"
                              aria-expanded="false" aria-controls={collection.replace(/\s/g, '')}/>
                            <label htmlFor={collection.replace(/\s/g, '')+'Filter'}
                              className='form-check-label p-2 px-3'>{getCollectionImg(collection)}
                              <span className='me-3'
                                id={collection.replace(/\s/g, '')+'Img'}></span> {collection}</label>
                          </p>
                        </div>
                      )
                    ))) :
                      (
                        <>
                          <div className='p-3 text-center'>
                            Loading Collections...
                          </div>
                          <div className="justify-content-center text-center align-items-center">
                            <ClipLoader size={128} color="#df57eb" />
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
            {filterCollection !== 'all' && (
              <>
                <span className="badge bg-brand text-black p-2 me-2 mb-4 d-inline-block position-relative pe-4">
                  <span className='text-dark'>{filterCollection}</span>
                  <button onClick={() => {
                    setFilterCollection('all');
                    setCurrentAssets(assets);
                    document.getElementById('collection').value ='all';
                    [].forEach.call(document.querySelectorAll(' input[type=radio]'), function(el) {
                      el.checked = false;
                    });
                  }}
                  className='btn bg-none border-0 btn-close-trait rounded-pill
              position-absolute top-50 end-0 translate-middle-y me-1'>
                    <i className="fa-solid fa-xmark"></i>
                  </button></span>
              </>
            )}
            <div className='row g-4'>
              {!assetsLoading ? (
                  Object.entries(currentAssets).length > 0 ? (
                    Object.entries(currentAssets)?.map(([_collection, collectionNfts]) => (
                      collectionNfts.map((asset) => (
                        <>
                          <NFTCard key={asset.name} classList='test' id={asset.id} listingId={asset.app_id}
                            name={asset.name} collection={asset.collection} image={asset.image}
                            rank={asset.rank}
                            price={asset.price && parseInt(asset.price)} owner={asset.owner} small
                            isOwner={address === address} amount={asset.amount} reload={reload}
                          />
                        </>
                      ))
                    ))
                  ) :
                  (
                    <div className="col-12">
                      <h2 className='text-center pt-4 mb-5'>No NFTs Found</h2>
                    </div>
                  )
                ) :
                (
                  <div className="col-12 justify-content-center text-center align-items-center w-100 h-100 pt-5">
                    <ClipLoader size={128} color="#df57eb" />
                  </div>
                )}
            </div>
          </div>
          <div className="tab-pane fade" id="listings" role="tabpanel"
            aria-labelledby="listings-tab">
            <div className='pb-5 d-flex align-items-center justify-content-end'>
              {Object.entries(loanedAssets).length > 0 && (
                <div className='flex-grow-1 text-muted'>
                  {Object.entries(loanedAssets).length} Liquidity Loans found...
                </div>
              )}
            </div>
            <div className='row g-4'>
              {!loanedAssetsLoading ? (
                  Object.entries(loanedAssets).length > 0 ? (
                    Object.entries(loanedAssets)?.map((_foundLoanedAssets, asset) => (
                      <NFTCard key={loanedAssets[asset].name} id={loanedAssets[asset].id}
                        loanId={loanedAssets[asset].app_id} name={loanedAssets[asset].name}
                        collection={loanedAssets[asset].collection} image={loanedAssets[asset].image}
                        rank={loanedAssets[asset].rank}
                        price={algosdk.microalgosToAlgos(loanedAssets[asset].params['global-state'].find(
                            (state) => state.key === 'Z2xvYmFsX2xlbmRfcGF5YmFjaw==',
                        ).value.uint - loanedAssets[asset].params['global-state'].find(
                            (state) => state.key === 'Z2xvYmFsX2xlbmRfcGFpZA==',
                        ).value.uint)}
                        owner={loanedAssets[asset].owner} small
                        isOwner={address === address} amount={loanedAssets[asset].amount} reload={reload}
                      />
                    ))
                  ) :
                  (
                    <div className="col-12">
                      <h2 className='text-center pt-4 mb-5'>No Lent NFTs Found</h2>
                    </div>
                  )
                ) :
                (
                  <div className="col-12 justify-content-center text-center align-items-center w-100 h-100 pt-5">
                    <ClipLoader size={128} color="#df57eb" />
                  </div>
                )}
            </div>
          </div>
        </div>
      </>
    ) : (
      <p>Please Log Into Your Account</p>
    )
  );
};

const mapStateToProps = (state) => ({
  address: state.connect?.address,
  myAlgoWallet: myAlgoWallet,
  walletConnect: walletConnect,
});

const mapDispatchToProps = (dispatch) => ({
  showLoadingModal: () => dispatch(openLoadingModal()),
  closeModal: (id) => dispatch(closeModal(id)),
});

WalletSection.propTypes = {
  address: PropTypes.string,
  myAlgoWallet: PropTypes.object,
  walletConnect: PropTypes.object,
  closeModal: PropTypes.func,
  showLoadingModal: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletSection);
