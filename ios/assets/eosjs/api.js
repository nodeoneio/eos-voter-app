/** API Bridge
 *
 * dependencies: eosjs, webViewBridge
 */

function delegatebwParams(delegator, receiver, netAmount, cpuAmount) {
  const stakeNetAmount = netAmount || 0;
  const stakeCpuAmount = cpuAmount || 0;

  return {
    from: delegator,
    receiver,
    stake_net_quantity: `${stakeNetAmount.toFixed(4)} EOS`,
    stake_cpu_quantity: `${stakeCpuAmount.toFixed(4)} EOS`,
    transfer: 0
  };
}

function undelegatebwParams(delegator, receiver, netAmount, cpuAmount) {
  const unstakeNetAmount = netAmount || 0;
  const unstakeCpuAmount = cpuAmount || 0;

  return {
    from: delegator,
    receiver,
    unstake_net_quantity: `${unstakeNetAmount.toFixed(4)} EOS`,
    unstake_cpu_quantity: `${unstakeCpuAmount.toFixed(4)} EOS`,
    transfer: 0
  };
}

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

function delegatebw(requestId, config, delegater, receiver, netAmount, cpuAmount) {
  Eos(config).transaction(tr => {
    tr.delegatebw(delegatebwParams(
      delegater,
      receiver,
      netAmount,
      cpuAmount
    ));
  }, (error, result) => {
    window.webViewBridge.send('handleDelegatebw', {error, result, requestId});
  });
}

function undelegatebw(requestId, config, delegater, receiver, netAmount, cpuAmount) {
  Eos(config).transaction(tr => {
    tr.undelegatebw(delegatebwParams(
      delegater,
      receiver,
      netAmount,
      cpuAmount
    ));
  }, (error, result) => {
    window.webViewBridge.send('handleUndelegatebw', {error, result, requestId});
  });
}

function getTableRows(requestId, config, query) {
  Eos(config).getTableRows(query, (error, result) => {
    window.webViewBridge.send('handleGetTableRows', {error, result, requestId});
  });
}

function voteproducers(requestId, config, account, producers = []) {
  Eos(config).voteproducer(account, '', producers)
  .then((result) => {
    window.webViewBridge.send('handleVoteproducers', {result, requestId});
  })
  .catch((error) => {
    window.webViewBridge.send('handleVoteproducers', {error, requestId});
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
