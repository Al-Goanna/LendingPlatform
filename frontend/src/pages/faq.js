import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

const FAQ = () => {
  document.title='FAQ - Shufl';
  return (
    <>
      <div className="row g-0 row-eq-height h-100-internal">
        <Sidebar />
        <div className="col-12 col-md bg-light rounded-bottom-end">
          <Breadcrumbs />
          <div className="p-3 p-md-4 p-lg-5">
            <div className="col-12 text-center">
              <h1 className="text-body mb-0">FAQ</h1>
            </div>
            <hr className='my-5' />
            <h4 className='text-brand'>How does this all work?</h4>
            <p>We give NFTs a value based their current floor price and distribution.
              We offer a percentage of that floor price whilst holding your NFT as collateral.
              You pay a set APR for up to 6 months, and we return the NFT back to you once the loan has been paid in full.</p>
            <hr className='my-5' />
            <h4 className='text-brand'>Where do the funds come from?</h4>
            <p>Currently the all the liquidity is supplied by the Goanna DAO.</p>
            <hr className='my-5' />
            <h4 className='text-brand'>What happens if I don't repay in time?</h4>
            <p>One of two things may happen, Shufl may take the NFT and sell it at market value to recoup loses. OR, any other person may repay the rest of the loan to claim the NFT for themselves.</p>
            <hr className='my-5' />
            <h4 className='text-brand'>Can I change the term of my loan?</h4>
            <p>Not at this time, but this is something we're looking into for the future.</p>
            <hr className='my-5' />
            <h4 className='text-brand'>How are the NFTs used as collateral valued?</h4>
            <p>NFTs are valued individual using a multitude of third parties.</p>
            <hr className='my-5' />
            <h4 className='text-brand'>If my NFT is valued at 1k $ALGO, why am I only able to loan 500 $ALGO</h4>
            <p>Due to certain NFT collections floor prices being easily manipulated, we're currently only offering percentage of the NFTs value.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
