//==================================================================================================================
//    React & Redux Imports
//==================================================================================================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';

//==================================================================================================================
//    Styles & Component Imports
//==================================================================================================================
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/700.css'; // Bold
import './index.css';
import App from './App.jsx';

//==================================================================================================================
//    Application Initialization
//==================================================================================================================
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);