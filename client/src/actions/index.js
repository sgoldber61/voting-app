import axios from 'axios';
import {AUTH_USER, DEAUTH_USER, AUTH_ERROR, FETCH_MESSAGE} from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({email, password}, history) {
  // redux-thunk allows us to return a function from our action creator
  return function(dispatch) {
    // Submit email/password to the server
    axios.post(`${ROOT_URL}/signin`, {email, password})
      .then(response => {
        // If request is good...
        
        // - Update state to indicate user is authenticated
        dispatch({type: AUTH_USER});
        
        // - Save the JWT token
        localStorage.setItem('token', response.data.token);
        
        // - redirect to the route '/feature'
        history.push('/feature');
      })
      .catch(() => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  }
}


export function signupUser({email, password}, history) {
  // redux-thunk allows us to return a function from our action creator
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, {email, password})
      .then(response => {
        dispatch({type: AUTH_USER});
        localStorage.setItem('token', response.data.token);
        history.push('/feature');
      })
      .catch(error => {
        dispatch(authError(error.message));
      });
  }
}


export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}


export function signoutUser() {
  localStorage.removeItem('token');
  
  return {
    type: DEAUTH_USER,
  };
}


export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        });
      });
  }
}

