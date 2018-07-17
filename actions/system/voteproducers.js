import * as types from '../types';
import * as Api from '../../api/ApiDelegate'

export function voteproducers(producers = []) {
  return (dispatch: () => void, getState) => {
    const {
      connection,
      settings,
      api
    } = getState();
    dispatch({
      type: types.SYSTEM_VOTEPRODUCER_REQUEST
    });
    const { account } = settings;
    producers.sort();
    return api.request(connection, Api.VOTE_PRODUCERS, {account, producers})
      .then((tx) => dispatch({
        payload: { tx, producers },
        type: types.SYSTEM_VOTEPRODUCER_SUCCESS
      }))
      .catch((err) => dispatch({
        payload: { err },
        type: types.SYSTEM_VOTEPRODUCER_FAILURE
      }));
  };
}

export default {
  voteproducers
};
