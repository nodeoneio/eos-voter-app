import { Decimal } from 'decimal.js';

import * as types from './types';

import { delegatebwParams } from './system/delegatebw';
import { undelegatebwParams } from './system/undelegatebw';

import * as AccountActions from './accounts';
import * as Api from '../api/ApiDelegate'

export function setStake(account, netAmount, cpuAmount) {
  return (dispatch: () => void, getState) => {
    const {
      connection,
      api
    } = getState();

    const sign = {
      broadcast: connection.broadcast,
      expireInSeconds: connection.expireInSeconds,
      sign: connection.sign
    };

    dispatch({ type: types.SYSTEM_STAKE_PENDING });

    return api.request(connection, Api.DELEGATEBW, {
      delegater: account,
      receiver: account,
      netAmount,
      cpuAmount,
      sign
    }).then((tx) => {
      dispatch(AccountActions.getAccount(account));
      return dispatch({
        payload: { tx },
        type: types.SYSTEM_STAKE_SUCCESS
      });
    }).catch((err) => {
      dispatch({
        payload: { err },
        type: types.SYSTEM_STAKE_FAILURE
      });
    });
  };
}

export function setUnstake(account, netAmount, cpuAmount) {
  return (dispatch: () => void, getState) => {
    const {
      connection,
      api
    } = getState();

    const sign = {
      broadcast: connection.broadcast,
      expireInSeconds: connection.expireInSeconds,
      sign: connection.sign
    }

    dispatch({ type: types.SYSTEM_STAKE_PENDING });

    return api.request(connection, Api.UNDELEGATEBW, {
      delegater: account,
      receiver: account,
      netAmount,
      cpuAmount,
      sign
    }).then((tx) => {
      dispatch(AccountActions.getAccount(account));
      return dispatch({
        payload: { tx },
        type: types.SYSTEM_STAKE_SUCCESS
      });
    }).catch((err) => {
      dispatch({
        payload: { err },
        type: types.SYSTEM_STAKE_FAILURE
      });
    });
  };
}


export function resetStakeForm() {
  return (dispatch: () => void) => {
    dispatch({
      type: types.RESET_SYSTEM_STATES
    });
  };
}

function getStakeChanges(account, nextNetAmount, nextCpuAmount) {
  const {
    cpu_weight,
    net_weight
  } = account.self_delegated_bandwidth;

  const currentCpuAmount = new Decimal(cpu_weight.split(' ')[0]);
  const currentNetAmount = new Decimal(net_weight.split(' ')[0]);

  const increaseInStake = {
    netAmount: Math.max(0, (nextNetAmount - currentNetAmount)),
    cpuAmount: Math.max(0, (nextCpuAmount - currentCpuAmount))
  };

  const decreaseInStake = {
    netAmount: Math.max(0, (currentNetAmount - nextNetAmount)),
    cpuAmount: Math.max(0, (currentCpuAmount - nextCpuAmount))
  };

  return {
    increaseInStake,
    decreaseInStake
  };
}

export default {
  resetStakeForm,
  setStake,
  setUnstake
};
