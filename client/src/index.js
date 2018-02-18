import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import App from './components/app';
import Signin from './components/auth/signin';
import Signout from './components/auth/signout';
import Signup from './components/auth/signup';
import RequireAuth from './components/auth/require_auth';
import Polls from './components/polls';
import MyPolls from './components/my_polls';
import NewPoll from './components/new_poll';
import Poll from './components/poll';
import reducers from './reducers';
import {AUTH_USER} from './actions/types';


const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');
// If we have a token, consider the user to be signed in.
if (token) {
  // we need to update application state
  store.dispatch({type: AUTH_USER});
}


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Switch>{/* Most specific route at the top */}
          <Route path="/signin" component={Signin} />
          <Route path="/signout" component={Signout} />
          <Route path="/signup" component={Signup} />
          <Route path="/mypolls" component={RequireAuth(MyPolls)} />
          <Route path="/newpoll" component={RequireAuth(NewPoll)} />
          <Route path="/polls/:pollid" component={Poll} />
          <Route path="/" component={Polls} />
        </Switch>
      </App>
    </BrowserRouter>
  </Provider>
  , document.querySelector('#root'));

