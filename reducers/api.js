import { combineReducers } from 'redux'
import * as types from '../actions/types'


const initialState = null

export default function api(state = initialState, action) {
  switch (action.type) {
    case types.API_INITIALIZED: {
      return action.payload.api
    }
    case types.API_GET:
    default: {
      return state
    }
  }
}
