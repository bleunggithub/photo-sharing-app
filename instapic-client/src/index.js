import React from 'react';
import ReactDOM from 'react-dom';

import UserProvider from './context/UserContext'


//styling
import './index.scss';
import "@fontsource/ibm-plex-sans"
import "@fontsource/poppins"

//components
import App from './App';

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);
