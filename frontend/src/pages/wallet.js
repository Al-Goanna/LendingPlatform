import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

import WalletSection from '../components/Sections/WalletSection/Wallet';

const Wallet = () => {
  return (
    <>
      <div className="row g-0 row-eq-height h-100-internal">
        <Sidebar />
        <div className="col-12 col-md bg-light rounded-bottom-end">
          <Breadcrumbs />
          <div className="p-3 p-md-4 p-lg-5">
            <WalletSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
