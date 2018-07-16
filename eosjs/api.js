/** API Bridge
 *
 * dependencies: eosjs, webViewBridge
 */


function getKeyAccounts(requestId, config, pk) {
  Eos(config).getKeyAccounts(pk, (error, result) => {
    window.webViewBridge.send('handleGetKeyAccounts', {error, result, requestId});
  });
}

function getAccount(requestId, config, account) {
  Eos(config).getAccount(account, (error, result) => {
    window.webViewBridge.send('handleGetAccount', {error, result, requestId});
  });
}

function delegatebw(requestId, config, delegater, receiver, netAmount, cpuAmount, option) {
  Eos(config).transaction(tr => {
    tr.delegatebw(delegatebwParams(
      delegater,
      receiver,
      netAmount,
      cpuAmount
    ));
  }, option, (error, result) => {
    window.webViewBridge.send('handleGetDelegatebw', {error, result, requestId});
  });
}

function getTableRows(requestId, config, query) {
  Eos(config).getTableRows(query, (error, result) => {
    window.webViewBridge.send('handleGetTableRows', {error, result, requestId});
  });
}

function voteproducers(requestId, config, account, producers = []) {
  Eos(config).voteproducers(account, '', producers, (error, result) => {
    window.webViewBridge.send('handleGetTableRows', {error, result, requestId});
  });
}

function getBlock(requestId, config, block) {
  Eos(config).getBlock(block, (error, result) => {
    window.webViewBridge.send('handleGetBlock', {error, result, requestId});
  });
}

function getTableRows(requestId, config, query) {
  Eos(config).getTableRows(query, (error, result) => {
    window.webViewBridge.send('handleGetTableRows', {error, result, requestId});
  });
}

function getCurrencyStats(requestId, config, account, symbol) {
  Eos(config).getCurrencyStats(account, symbol, (error, result) => {
    window.webViewBridge.send('handleGetCurrencyStates', {error, result, requestId});
  });
}


/*
 * eosjs-ecc api
 */

function isValidPrivate(requestId, key) {

  var valid = false;
  var error;
  try {
    valid = window.eosjs_ecc.isValidPrivate(key);
  } catch (e) {
    error = e
  }
  window.webViewBridge.send('handleIsValidPrivate', {error, result: valid, requestId});
}

function privateToPublic(requestId, key) {
  var public = false;
  var error;
  try {
    public = window.eosjs_ecc.privateToPublic(key);
  } catch (e) {
    error = e
  }
  window.webViewBridge.send('handlePrivateToPublic', {error, result: public, requestId});
}
