import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';

import App from './App';

import {Toaster} from 'react-hot-toast';

import store from './services/reducers/store';

import ScrollToTop from './helpers/scrollToTop';

import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            border: `1px solid #df57eb`,
            padding: '16px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
          },
          iconTheme: {
            primary: `#df57eb`,
            secondary: '#000',
          },
        }}
      />
      <Router>
        <ScrollToTop />
        <App />
      </Router>
    </Provider>,
);
