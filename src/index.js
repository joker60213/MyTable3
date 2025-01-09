import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app';

import { Provider } from 'react-redux';
import Store from './components/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={Store}>
    <App />
  </Provider>
);
