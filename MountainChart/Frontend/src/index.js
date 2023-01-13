import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import App from './App';
import { store } from './store';
import config from './config';
import 'toastr/toastr.js';
import 'toastr/build/toastr.css';

import * as serviceWorker from './serviceWorker';

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_PROXY}/access`,
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <BrowserRouter basename={config.basename}>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

serviceWorker.unregister();