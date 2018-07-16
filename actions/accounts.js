import * as Api from '../api/ApiDelegate'
import { forEach } from 'lodash'
import * as types from './types'

export function clearAccountCache() {
  return (dispatch: () => void) => {
    dispatch({
      type: types.CLEAR_ACCOUNT_CACHE
    });
  };
}

export function getAccount(account = '') {
  return (dispatch: () => void, getState) => {
    dispatch({
      type: types.GET_ACCOUNT_REQUEST,
      payload: { account_name: account }
    })
    const {
      connection,
      settings,
      api
    } = getState();
    console.log(getState(), 'getState')
    if (account) {//&& (settings.node || settings.node.length !== 0)
      console.log(Api, 'Api')
      api.request(Api.GET_ACCOUNT, {account}).then((results) => {
        // Dispatch the results of the account itself
        return dispatch({
          type: types.GET_ACCOUNT_SUCCESS,
          payload: { results }
        })
      }).catch((err) => dispatch({
        type: types.GET_ACCOUNT_FAILURE,
        payload: { err, account_name: account },
      }))
      return
    }
    dispatch({
      type: types.GET_ACCOUNT_FAILURE,
      payload: { account_name: account },
    })
  }
}

export function getAccountByKey(public_key) {
  return (dispatch: () => void, getState) => {
    dispatch({
      type: types.GET_ACCOUNT_BY_KEY_REQUEST,
      payload: { public_key }
    });
    const {
      connection,
      settings,
      api
    } = getState();
    if (public_key) {// && (settings.node || settings.node.length !== 0)
      return api.request(Api.GET_KEY_ACCOUNTS, {public_key}).then((accounts) => dispatch({
        type: types.GET_ACCOUNT_BY_KEY_SUCCESS,
        payload: { accounts }
      })).catch((err) => dispatch({
        type: types.GET_ACCOUNT_BY_KEY_FAILURE,
        payload: { err, public_key }
      }));
    }
    dispatch({
      type: types.GET_ACCOUNT_BY_KEY_FAILURE,
      payload: { public_key },
    });
  };
}


export default {
  getAccount,
  getAccountByKey
}
