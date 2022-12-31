import React from 'react';
import {connect} from 'react-redux';

import PropTypes from 'prop-types';

import {Link, useLocation} from 'react-router-dom';


const Sidebar = ({address}) => {
  const location = useLocation();

  return (
    <>
      <div className="col-12 col-md-4 col-xl-3 rounded-0 rounded-bottom-start bg-darklite text-white sidebar">
        <div className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link disabled">Dashboard</a>
            </li>
            <li className="nav-item">
              <Link to={`/`} className={`nav-link ${location.pathname == '/' && ( 'active' )}`}
                aria-current="page">Welcome</Link>
            </li>
            {address && (
              <li className="nav-item">
                <Link to={`/wallet`} className={`nav-link ${location.pathname == '/wallet' && ( 'active' )}`}
                  aria-current="page">My NFTs</Link>
              </li>
            )}
            <li className="nav-item">
              <Link to={`/team`} className={`nav-link ${location.pathname == '/team' && ( 'active' )}`}
                aria-current="page">Team</Link>
            </li>
            <li className="nav-item">
              <Link to={`/faq`} className={`nav-link ${location.pathname == '/faq' && ( 'active' )}`}
                aria-current="page">FAQ</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  address: state.connect?.address,
});

const mapDispatchToProps = (_dispatch) => ({});

Sidebar.propTypes = {
  address: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
