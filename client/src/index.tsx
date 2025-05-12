import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';
import "@fontsource-variable/raleway";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// TODO: Consume from environment
const auth0 = {
  domain: 'dev-ci6ig3efqzbsxrl7.us.auth0.com',
  client: '7JvIdoCTk87X6eyxgw8EMFrFEZA963SM',
  audience: 'https://observe.culturehouse.cc',
  redirect: 'http://localhost:3000'
}

root.render(
  <>
    <BrowserRouter>
    <Auth0Provider
      domain={auth0.domain}
      clientId={auth0.client}
      authorizationParams={{
        redirect_uri: auth0.redirect,
        audience: auth0.audience,
        // Add scopes here if you need them, e.g., scope: "openid profile email read:data"
      }}
    >
      <App />
    </Auth0Provider>
    </BrowserRouter>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
