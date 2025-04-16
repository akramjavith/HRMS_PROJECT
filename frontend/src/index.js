import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import InternetDisable from './InternetDisabled';
// import { BrowserRouter } from 'react-router-dom';

// styles
import './App.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <BrowserRouter basename={process.env.PUBLIC_URL}> */}
    {navigator.onLine ? <App /> : <InternetDisable />}

    {/* </BrowserRouter> */}
  </React.StrictMode>
);