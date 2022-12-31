import React from 'react';

import {useNavigate} from 'react-router-dom';

import Portal from 'Root/images/portal-404.png';
import PortalL1 from 'Root/images/404Layer1.png';
import PortalL2 from 'Root/images/404Layer2.png';
import PortalL3 from 'Root/images/404Layer3.png';
import PortalL4 from 'Root/images/404Layer4.png';
import PortalL5 from 'Root/images/404Layer5.png';
import PortalL6 from 'Root/images/404Layer6.png';

const NotFoundSection = () => {
  document.title='Not Found';
  document.body.classList.add('home');

  const navigate = useNavigate();

  return (
    <div className="container-fluid" id="main">
      <div className='row align-items-center text-body mt-neg-slide pb-5 mb-5'>
        <div className='col-12 col-md-5 offset-md-1 col-lg-4 offset-lg-1'>
          <h1 className='text-center text-md-start mb-4 mt-5 mt-md-0'>404<br/>Not Found...</h1>
          <div className='row g-0 explore-options mx-auto mx-md-0 mb-5 mb-md-0'>
            <div className='col-6 pe-3'>
              <button onClick={() => navigate(-1)} className='btn btn-primary btn-lg w-100'>Go Back</button>
            </div>
          </div>
        </div>
        <div className='col-10 offset-1 offset-md-0 col-md-5 col-lg-6 offset-lg-0'>
          <div className='portal'>
            <img src={PortalL6} className="layer6" alt="..."/>
            <img src={PortalL5} className="layer5" alt="..."/>
            <img src={PortalL4} className="layer4" alt="..."/>
            <img src={PortalL3} className="layer3" alt="..."/>
            <img src={PortalL2} className="layer2" alt="..."/>
            <img src={PortalL1} className="layer1" alt="..."/>
            <img src={Portal} className="d-block w-100" alt="..."/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundSection;
