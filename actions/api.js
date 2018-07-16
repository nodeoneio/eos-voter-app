import * as types from './types';

export function initApi(api) {
  return (dispatch: () => void) => {
    dispatch({
      type: types.API_INITIALIZED,
      payload: {api}
    });
  };
}

export function api() {
  return (dispatch: () => void) => {
    dispatch({
      type: types.API_GET
    });
  };
}

export default {
  initApi
}
