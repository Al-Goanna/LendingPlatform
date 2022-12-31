import React from 'react';

import {Routes, Route, useLocation} from 'react-router-dom';

import './App.scss';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Welcome from 'Pages/welcome';
import Wallet from 'Pages/wallet';
import NotFound from './pages/not-found';

import Team from './pages/team';
import Faq from './pages/faq';
import Terms from './pages/terms';
import Privacy from './pages/privacy';

import ConnectModal from 'Components/Modals/ConnectModal/ConnectModal';
import WalletConnectModal from 'Components/Modals/WalletConnectModal/WalletConnectModal';
import LoadingModal from 'Components/Modals/LoadingModal/LoadingModal';
import LendModal from 'Components/Modals/LendModal/LendModal';
import PayModal from 'Components/Modals/PayModal/PayModal';

/**
 * App.
 * @return {React.Component}
 */
export default function App() {
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--app-height', `${window.innerHeight}px`);
  };
  window.addEventListener('resize', appHeight);
  appHeight();

  const location = useLocation();

  if (location.pathname=='/') {
    document.body.classList.add('home');
  } else {
    document.body.classList.remove('home');
  }

  return (
    <>
      <LoadingModal />
      <div className="container h-100 padded">
        <div className="h-100">
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Welcome />} />
            <Route exact path='/wallet' element={<Wallet />} />
            <Route exact path='/team' element={<Team />} />
            <Route exact path='/faq' element={<Faq />} />
            <Route exact path='/terms' element={<Terms />} />
            <Route exact path='/privacy' element={<Privacy />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
          <Footer />
          <ConnectModal />
          <WalletConnectModal />
          <LendModal />
          <PayModal />
        </div>
      </div>
    </>
  );
}
