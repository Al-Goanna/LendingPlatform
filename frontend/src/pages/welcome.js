import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

import WelcomeSection from '../components/Sections/WelcomeSection/Welcome';

import liquidity from 'Root/images/liquidity.jpg';

const Welcome = () => {
  return (
    <>
      <div className="row g-0 row-eq-height h-100-internal">
        <img src={liquidity} className='img-fluid' alt='' />
        <Sidebar />
        <div className="col-12 col-md bg-light rounded-bottom-end">
          <Breadcrumbs />
          <div className="p-3 p-md-4 p-lg-5">
            <WelcomeSection />
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
