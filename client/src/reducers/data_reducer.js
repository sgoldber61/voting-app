import _ from 'lodash';
import {
  FETCH_DATA,
  FETCH_USER_DATA,
  FETCH_POLL_DATA,
  POST_DATA,
  VOTE_POLL,
  DATA_ERROR,
  CLEAR_POLL
} from '../actions/types';


export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_DATA:
      return {...state, data: _.mapKeys(action.payload, 'pollId')};
    case FETCH_USER_DATA:
      return {...state, userData: _.mapKeys(action.payload, 'pollId')};
    case FETCH_POLL_DATA:
      return {...state, pollData: action.payload};
    case POST_DATA:
      return {...state};
    case VOTE_POLL:
      return {...state, pollData: action.payload};
    case DATA_ERROR:
      return {...state, error: action.payload};
    case CLEAR_POLL:
      return {...state, error: '', pollData: null};
    default:
      return state;
  }
}

