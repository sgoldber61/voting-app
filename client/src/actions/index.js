import axios from 'axios';
import {AUTH_USER, DEAUTH_USER, AUTH_ERROR, CLEAR_ERROR, FETCH_DATA, FETCH_USER_DATA, FETCH_POLL_DATA, POST_DATA, VOTE_POLL, DATA_ERROR, CLEAR_POLL} from './types';

// const ROOT_URL = 'http://localhost:3090';
const ROOT_URL = 'https://sgoldber61.github.io/voting-app';

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
        
        // - redirect to the route '/'
        history.push('/');
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
        history.push('/');
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
    type: DEAUTH_USER
  };
}

export function clearError() {
  return {
    type: CLEAR_ERROR
  };
}


export function fetchAllPolls() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/get-polls`)
      .then(response => {
        dispatch({
          type: FETCH_DATA,
          payload: response.data
        });
      })
      .catch(error => {
        dispatch(authError(error.message));
      });
  }
}


export function fetchUserPolls() {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/get-user-polls`, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        dispatch({
          type: FETCH_USER_DATA,
          payload: response.data
        });
      })
      .catch(error => {
        dispatch(authError(error.message));
      });
  }
}


export function getPollData(pollId) {
  return function(dispatch) {
    axios.get(`${ROOT_URL}/get-poll-data/${pollId}`)
      .then(response => {
        dispatch({
          type: FETCH_POLL_DATA,
          payload: response.data
        });
      })
      .catch(error => {
        dispatch(dataError(error));
      });
  }
}


export function createNewPoll({title, options}, history) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/create-poll`, {title, options}, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        dispatch({
          type: POST_DATA
        });
        
        history.push('/');
      })
      .catch(error => {
        dispatch(authError(error.message));
      });
  }
}


export function voteOnPoll({pollId, option}, history) {
  return function(dispatch) {
    axios.put(`${ROOT_URL}/add-vote`, {pollId: pollId, optionName: option}, {
      headers: {authorization: localStorage.getItem('token')}
    })
      .then(response => {
        dispatch({
          type: VOTE_POLL,
          payload: response.data
        });
      })
      .catch(error => {
        dispatch(dataError(error));
      });
  }
}


export function dataError(error) {
  return {
    type: DATA_ERROR,
    payload: error
  };
}


export function clearPoll() {
  return {
    type: CLEAR_POLL
  };
}

