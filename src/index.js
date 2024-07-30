import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './i18n';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; 


ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1099168062160-45qfl29bu88pfbk59r68l8ubkhhqt60d.apps.googleusercontent.com">
      <I18nextProvider i18n={i18n}>
          <App />
      </I18nextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Si vous souhaitez commencer à mesurer les performances de votre application, passez une fonction pour enregistrer les résultats (par exemple : reportWebVitals(console.log))
// ou envoyez-les à un point de terminaison d'analyse. Apprenez-en davantage : https://bit.ly/CRA-vitals
reportWebVitals();
