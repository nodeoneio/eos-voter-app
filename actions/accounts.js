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

export function refreshAccountBalances(account) {
  return (dispatch: () => void) => {
    dispatch(clearBalanceCache());
    return dispatch(getCurrencyBalance(account));
  };
}

export function claimUnstaked(owner) {
  return (dispatch: () => void, getState) => {
    const {
      connection
    } = getState();
    dispatch({
      type: types.SYSTEM_REFUND_PENDING
    });
    return eos(connection).refund({
      owner
    }).then((tx) => {
      // Reload the account
      dispatch(getAccount(owner));
      // Reload the balances
      dispatch(getCurrencyBalance(owner));
      return dispatch({
        payload: { tx },
        type: types.SYSTEM_REFUND_SUCCESS
      });
    }).catch((err) => dispatch({
      payload: { err },
      type: types.SYSTEM_REFUND_FAILURE
    }));
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
      api.request(connection, Api.GET_ACCOUNT, {account}).then((results) => {
        // Trigger the action to load this accounts balances
        dispatch(getCurrencyBalance(account));
        // PATCH - Force in self_delegated_bandwidth if it doesn't exist
        const modified = results;
        if (!modified.self_delegated_bandwidth) {
          modified.self_delegated_bandwidth = {
            cpu_weight: '0.0000 EOS',
            net_weight: '0.0000 EOS'
          };
        }
        // Dispatch the results of the account itself
        return dispatch({
          type: types.GET_ACCOUNT_SUCCESS,
          payload: { results: modified }
        });
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
      return api.request(connection, Api.GET_KEY_ACCOUNTS, {public_key}).then((accounts) => dispatch({
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

export function getActions(account = '') {
  return (dispatch: () => void, getState) => {
    dispatch({
      type: types.GET_ACTIONS_REQUEST,
      payload: { account_name: account }
    });
    const {
      connection,
      settings,
      api
    } = getState();
    if (account) { //&& (settings.node || settings.node.length !== 0)
      api.request(connection, Api.GET_ACTIONS, {account}).then((results) => dispatch({
        type: types.GET_ACTIONS_SUCCESS,
        payload: { results }
      })).catch((err) => dispatch({
        type: types.GET_ACTIONS_FAILURE,
        payload: { err, account_name: account },
      }));
      return;
    }
    dispatch({
      type: types.GET_ACTIONS_FAILURE,
      payload: { account_name: account },
    });
  };
}

export function getCurrencyBalance(account) {
  return (dispatch: () => void, getState) => {
    dispatch({
      type: types.GET_ACCOUNT_BALANCE_REQUEST,
      payload: { account_name: account }
    });
    const {
      connection,
      settings,
      api
    } = getState();
    if (account) { // && (settings.node || settings.node.length !== 0)
      const { customTokens } = settings;
      let selectedTokens = ['eosio.token:EOS'];
      if (customTokens && customTokens.length > 0) {
        selectedTokens = [...customTokens, ...selectedTokens];
      }
      forEach(selectedTokens, (namespace) => {
        const [contract, symbol] = namespace.split(':');
        api.request(connection, Api.GET_CURRENCY_BALANCE, {contract, account, symbol})
        .then((results) =>
          dispatch({
            type: types.GET_ACCOUNT_BALANCE_SUCCESS,
            payload: {
              account_name: account,
              contract,
              symbol,
              tokens: formatBalances(results)
            }
          }))
          .catch((err) => dispatch({
            type: types.GET_ACCOUNT_BALANCE_FAILURE,
            payload: { err, account_name: account }
          }));
      });
    }
    dispatch({
      type: types.GET_ACCOUNT_BALANCE_FAILURE,
      payload: { account_name: account },
    });
  };
}

function formatBalances(balances) {
  const formatted = {};
  for (let i = 0; i < balances.length; i += 1) {
    const [amount, symbol] = balances[i].split(' ');
    formatted[symbol] = parseFloat(amount);
  }
  return formatted;
}

export function clearAccountByKey() {
  return (dispatch: () => void) => {
    dispatch({
      type: types.GET_ACCOUNT_BY_KEY_CLEAR
    });
  };
}


export default {
  clearAccountByKey,
  clearAccountCache,
  getAccount,
  getAccountByKey,
  getCurrencyBalance,
  refreshAccountBalances
};
