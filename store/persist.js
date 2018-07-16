import createSensitiveStorage from "redux-persist-sensitive-storage";

const storage = createSensitiveStorage({
  keychainService: "eosVoterAppKeychain",
  sharedPreferencesName: "eosVoterAppSharedPrefs"
})

const persistConfig = {
  key: 'eos-voter-app-config',
  storage: storage,
  whitelist: [
    'settings',
    'wallet'
  ]
};

export default persistConfig;
