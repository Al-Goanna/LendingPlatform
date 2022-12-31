import React from 'react';
import {Link, useLocation} from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  return (
    <>
      <div className="bg-white p-3 border-bottom">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to={`/`} className="nav-link">Dashboard</Link></li>
            {location.pathname && (
              <li className="breadcrumb-item active" aria-current="page">
                {location.pathname == '/' && ( <>Welcome</> ) }
                {location.pathname == '/wallet' && ( <>My NFTs</> ) }
                {location.pathname == '/about' && ( <>About</> ) }
                {location.pathname == '/team' && ( <>Team</> ) }
                {location.pathname == '/faq' && ( <>FAQ</> ) }</li>
            )}
          </ol>
        </nav>
      </div>
    </>
  );
};
export default Breadcrumbs;
