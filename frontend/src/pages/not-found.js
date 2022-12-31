import React from 'react';

import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';

import NotFoundSection from '../components/Sections/NotFoundSection/NotFound';

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="content py-5 box-content">
        <NotFoundSection />
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
