import * as types from './types';
import { clearAccountCache } from './accounts';

export function clearSettingsCache() {
  return (dispatch: () => void) => {
    dispatch({
      type: types.RESET_ALL_STATES
    });
  };
}

export function resetApp() {
  return (dispatch: () => void) => {
    dispatch(clearSettingsCache());
    dispatch(clearAccountCache());
  };
}

export function setSetting(key, value) {
  return (dispatch: () => void) => {
    dispatch({
      type: types.SET_SETTING,
      payload: {
        [key]: value
      }
    });
  };
}


export default {
  clearSettingsCache,
  setSetting,
};
