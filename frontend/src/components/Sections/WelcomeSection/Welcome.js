import React from 'react';

const WelcomeSection = () => {
  document.title = 'Shufl - The Home of Algorand NFTs';

  return (
    <>
      <div className='text-center'>
        <h2>Unleash your NFT liquidity.</h2>
        <p>Decentralized short-term <span className='text-brand'>$ALGO</span> loans backed by NFT collateral.</p>
      </div>
      <hr className='my-5' />
      <div className='row g-3 align-items-end'>
        <div className='col-12 col-xl-6'>
          <div className='p-3 border bg-white rounded'>
            <div className='row align-items-center'>
              <div className='col-auto'>
                <div className='d-inline-block border border-brand text-white bg-brand rounded-circle p-3'>
                  <i className='fa-solid fa-wallet fa-fw fa-3x my-1'></i>
                </div>
              </div>
              <div className='col'>
                <h2 className='pt-3'>Step 1:</h2>
                <p>Connect your Algorand wallet.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-6 d-none d-xl-inline-block'>
          <div className='lines right'></div>
        </div>
        <div className='col-12 col-xl-6 d-none d-xl-inline-block'>
          <div className='lines left'></div>
        </div>
        <div className='col-12 col-xl-6'>
          <div className='p-3 border bg-white rounded'>
            <div className='row align-items-center'>
              <div className='col-auto'>
                <div className='d-inline-block border border-brand text-white bg-brand rounded-circle p-3'>
                  <i className='fa-solid fa-layer-group fa-fw fa-3x my-1'></i>
                </div>
              </div>
              <div className='col'>
                <h2 className='pt-3'>Step 2:</h2>
                <p>Select the NFT you&apos;d like us to hold as collateral.</p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-6'>
          <div className='p-3 border bg-white rounded'>
            <div className='row align-items-center'>
              <div className='col-auto'>
                <div className='d-inline-block border border-brand text-white bg-brand rounded-circle p-3'>
                  <i className='fa-solid fa-clipboard-check fa-fw fa-3x my-1'></i>
                </div>
              </div>
              <div className='col'>
                <h2 className='pt-3'>Step 3:</h2>
                <p>Accept the terms of the loan, sign the transaction and
                  receive your <span className='text-brand'>$ALGO</span>!</p>
              </div>
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-6 d-none d-xl-inline-block'>
          <div className='lines right'></div>
        </div>
        <div className='col-12 col-xl-6 offset-xl-6'>
          <div className='p-3 border bg-white rounded'>
            <div className='row align-items-center'>
              <div className='col-auto'>
                <div className='d-inline-block border border-brand text-white bg-brand rounded-circle p-3'>
                  <i className='fa-solid fa-money-bill-1-wave fa-fw fa-3x my-1'></i>
                </div>
              </div>
              <div className='col'>
                <h2 className='pt-3'>Step 4:</h2>
                <p>Pay back the <span className='text-brand'>$ALGO</span> in the
                  allotted time and receive your NFT back!</p>
                <small className='text-muted'>Failure to repay loan will result in loss of
                  your collateral.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className='my-5' />
      <h1 className='h5 mb-5'>Featured Collections</h1>
      <div className='row g-5'>
        <div className='col-12 col-md-6'>
          <img src='https://shufl.app/images/Al%20Goanna/algoanna-collection.jpg'
            className='img-fluid rounded-3' alt='' />
        </div>
        <div className='col-12 col-md-6'>
          <img src='https://shufl.app/images/99%20Wise%20Uncles/99wiseuncles-collection.jpg'
            className='img-fluid rounded-3' alt='' />
        </div>
        <div className='col-12 col-md-6'>
          <img src='https://shufl.app/images/Akita%20Kennel%20Club/akc-collection.jpg'
            className='img-fluid rounded-3' alt='' />
        </div>
        <div className='col-12 col-md-6'>
          <img src='https://shufl.app/images/Al%20Goanna%20Stories/algoannastories-collection.jpg'
            className='img-fluid rounded-3' alt='' />
        </div>
      </div>
      <hr className='my-5' />
      <p className='text-center'>
        <small className='text-muted'>Failure to repay loan will result in loss of your collateral.</small></p>
    </>
  );
};

export default WelcomeSection;
