import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

import benji from 'Root/images/benji.jpg';
import green from 'Root/images/green.png';
import slurp from 'Root/images/slurp.jpg';

const team = () => {
  document.title = 'Team - Shufl';
  return (
    <>
      <div className="row g-0 row-eq-height h-100-internal">
        <Sidebar />
        <div className="col-12 col-md bg-light rounded-bottom-end">
          <Breadcrumbs />
          <div className="p-3 p-md-4 p-lg-5">
            <div className="row align-items-center g-5 mb-5 text-center">
              <div className="col-12 text-center">
                <h1 className="text-body mb-0">Shufl Team</h1>
              </div>
              <div className="col-12 col-sm-6  col-md-4 ">
                <img src={benji} className="img-fluid d-block mb-4 mx-auto rounded-circle" />
                <h2 className="text-body mb-0">Benji</h2>
                <h6 className="text-brand mb-5 light-weight">Founder</h6>
              </div>
              <div className="col-12 col-sm-6  col-md-4">
                <img src={green} className="img-fluid d-block mb-4 mx-auto rounded-circle" />
                <h2 className="text-body mb-0">Green</h2>
                <h6 className="text-brand mb-5 light-weight">Software Engineer</h6>
              </div>
              <div className="col-12 col-sm-6  col-md-4">
                <img src={slurp} className="img-fluid d-block mb-4 mx-auto rounded-circle" />
                <h2 className="text-body mb-0">Slurp</h2>
                <h6 className="text-brand mb-5 light-weight">Front-End Developer &middot; UI/UX</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default team;
