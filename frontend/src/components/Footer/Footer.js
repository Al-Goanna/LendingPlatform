import React from 'react';
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <div className="footer text-center d-flex justify-content-between">
        <div>
          <a href="https://discord.gg/x7HnTRRru2" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-discord fa-fw"></i>
          </a>
          &middot; <a href="https://twitter.com/shuflalgo" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-twitter fa-fw"></i>
          </a>
        </div>
        <div>
          <a href="https://shufl.app" target="_blank" rel="noreferrer">Marketplace</a> &middot;
          <Link to={`/terms`}>Terms</Link> &middot; <Link to={`/privacy`}>Privacy</Link>
        </div>
      </div>
    </>
  );
};
export default Footer;
