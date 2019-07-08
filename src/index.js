import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import Firebase, { FirebaseContext } from "./services/Firebase/firebase";

import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>
  , document.getElementById('root'));
registerServiceWorker();

if (module.hot) {
  module.hot.accept()
}