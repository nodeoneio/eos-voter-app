import guid from '../helpers/guid'
import _ from 'lodash'

const WAITING = 1
const REQUESTED = 2

// const config = {
//   chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
//   httpEndpoint: "https://api.main-net.eosnodeone.io",
//   expireInSeconds: 60
// }

export const GET_KEY_ACCOUNTS = 'getKeyAccounts'
export const GET_ACCOUNT = 'getAccount'
export const STAKE = 'stake'
export const VOTE_PRODUCERS = 'voteproducers'
export const DELEGATEBW = 'delegatebw'
export const UNDELEGATEBW = 'undelegatebw'
export const GET_BLOCK = 'getBlock'
export const GET_TABLE_ROWS = 'getTableRows'
export const GET_CURRENCY_STATES = 'getCurrencyStats'
export const GET_ACTIONS = 'getActions'
export const GET_CURRENCY_BALANCE = 'getCurrencyBalance'
export const REFUND = 'refund'

export const IS_VALID_PRIVATE = 'isValidPrivate'
export const PRIVATE_TO_PUBLIC = 'privateToPublic'

let __active = true
let __running = false

const __apiRequests = {
  [GET_KEY_ACCOUNTS]: {},
  [GET_ACCOUNT]: {},
  [STAKE]: {},
  [VOTE_PRODUCERS]: {},
  [DELEGATEBW]: {},
  [UNDELEGATEBW]: {},
  [GET_BLOCK]: {},
  [GET_TABLE_ROWS]: {},
  [GET_CURRENCY_STATES]: {},
  [GET_ACTIONS]: {},
  [GET_CURRENCY_BALANCE]: {},
  [REFUND]: {},

  [IS_VALID_PRIVATE]: {},
  [PRIVATE_TO_PUBLIC]: {},
}

export default class ApiDelegate {

  _timer = null

  constructor(eosp) {
    this.eosp = eosp
  }

  _validateParams(api, required, request, requests) {

    console.log('_validateParams')

    if (!required) return true

    const options = request.options
    var missing = null
    required.forEach((item)=> {
      if (!options.hasOwnProperty(item)) {
        missing = item
        return false
      }
    })

    if (missing) {
      // requests.splice(0, 1)
      delete requests[request.requestId]

      if (req.callback)
        req.callback({description: `${missing} options is required`, domain: api}, null)
      else if (req.reject)
        req.reject({description: `${missing} options is required`, domain: api})

      return false
    }

    return true
  }

  _executeRequest(config, api, requestId) {
    let requests = __apiRequests[api]
    let req = requests[requestId] // requests[0]
    var script = ""
    switch(api) {
      case GET_KEY_ACCOUNTS: {
        // Check Parameters
        if (!this._validateParams(api, ['public_key'], req, requests)) return

        var pk = req.options.public_key
        script = `getKeyAccounts("${req.requestId}", ${JSON.stringify(config)}, "${pk}");`
      }
      break
      case GET_ACCOUNT: {
        // Check Parameters
        if (!this._validateParams(api, ['account'], req, requests)) return

        var account = req.options.account
        script = `getAccount("${req.requestId}", ${JSON.stringify(config)}, "${account}");`
      }
      break
      case VOTE_PRODUCERS: {
        // Check Parameters
        if (!this._validateParams(api, ['account','producers'], req, requests)) return

        var account = req.options.account
        var producers = JSON.stringify(req.options.producers)
        script = `voteproducers("${req.requestId}", ${JSON.stringify(config)}, "${account}", ${producers});`
      }
      break
      case DELEGATEBW: {
        // Check Parameters
        if (!this._validateParams(api, ['delegater', 'receiver', 'netAmount', 'cpuAmount'], req, requests)) return

        const {
          delegater,
          receiver,
          netAmount,
          cpuAmount,
          sign
        } = req.options

        script = `delegatebw("${req.requestId}", ${JSON.stringify(config)}, ${JSON.stringify(sign)}, "${delegater}", "${receiver}", ${netAmount}, ${cpuAmount});`
      }
      break
      case UNDELEGATEBW: {
        // Check Parameters
        if (!this._validateParams(api, ['delegater', 'receiver', 'netAmount', 'cpuAmount'], req, requests)) return

        const {
          delegater,
          receiver,
          netAmount,
          cpuAmount,
          sign
        } = req.options

        var account = req.options.account
        script = `undelegatebw("${req.requestId}", ${JSON.stringify(config)}, ${JSON.stringify(sign)}, "${delegater}", "${receiver}", ${netAmount}, ${cpuAmount});`
      }
      break
      case GET_BLOCK: {
        // Check Parameters
        if (!this._validateParams(api, ['block_num'], req, requests)) return

        var block_num = req.options.block_num
        script = `getBlock("${req.requestId}", ${JSON.stringify(config)}, "${block_num}");`
      }
      break
      case GET_TABLE_ROWS: {
        // Check Parameters
        if (!this._validateParams(api, ['query'], req, requests)) return

        var query = JSON.stringify(req.options.query)
        script = `getTableRows("${req.requestId}", ${JSON.stringify(config)}, ${query});`
      }
      break
      case GET_CURRENCY_STATES: {
        // Check Parameters
        if (!this._validateParams(api, ['account', 'symbol'], req, requests)) return

        var account = req.options.account
        var symbol = req.options.symbol
        script = `getCurrencyStats("${req.requestId}", ${JSON.stringify(config)}, "${account}", "${symbol}");`
      }
      break
      case GET_ACTIONS: {
        // Check Parameters
        if (!this._validateParams(api, ['account'], req, requests)) return

        var account = req.options.account
        script = `getActions("${req.requestId}", ${JSON.stringify(config)}, "${account}");`
      }
      break
      case GET_CURRENCY_BALANCE: {
        // Check Parameters
        if (!this._validateParams(api, ['contract','account','symbol'], req, requests)) return

        var contract = req.options.contract
        var account = req.options.account
        var symbol = req.options.symbol
        script = `getCurrencyBalance("${req.requestId}", ${JSON.stringify(config)}, "${contract}", "${account}", "${symbol}");`
      }
      break
      case REFUND: {
        // Check Parameters
        if (!this._validateParams(api, ['account'], req, requests)) return

        var account = req.options.account
        script = `refund("${req.requestId}", ${JSON.stringify(config)}, "${account}");`
      }

      /* eosjs-cc */
      case IS_VALID_PRIVATE: {
        // Check Parameters
        if (!this._validateParams(api, ['key'], req, requests)) return

        var key = req.options.key
        script = `isValidPrivate("${req.requestId}", "${key}");`
      }
      break
      case PRIVATE_TO_PUBLIC: {
        // Check Parameters
        if (!this._validateParams(api, ['key'], req, requests)) return

        var key = req.options.key
        script = `privateToPublic("${req.requestId}", "${key}");`
      }
      break
    }

    console.log(script, "script")
    console.log(`${api} executed`)

    this.eosp.injectJavaScript(script)
    req["state"] = REQUESTED
  }

  /**
   * public request()
   *
   * Supports callback and promise pattern
   * @param String key
   * @param Object options
   * @param fn     callback
   */
  request(config, key, options, callback) {
    const uid = guid()

    var resolve = null
    var reject = null
    var promise = null
    if (!callback) {
      promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
    }

    let request = {requestId: uid, state: WAITING, options, callback, resolve, reject}

    if (Object.keys(__apiRequests).indexOf(key) < 0) {
      throw `"${key}" key does not exist`
    }

    __apiRequests[key][uid] = request

    this._executeRequest(config, key, uid)

    return promise
  }

  /**
   * Listening Message from WebView
   *
   * @param Object event
   */
  onMessage(event) {
    console.log("Message received from webview");

    let msgData;
    try {
      msgData = JSON.parse(event.nativeEvent.data);
    } catch (err) {
      console.warn(err);
      return;
    }

    switch (msgData.targetFunc) {
      case "handleInitEos":
      case "handleGetBlock":
      case "handleGetAccount":
      case "handleGetKeyAccounts":
      case "handleIsValidPrivate":
      case "handlePrivateToPublic":
      case "handleGetTableRows":
      case "handleGetCurrencyStates":
      case "handleVoteproducers":
      case "handleDelegatebw":
      case "handleUndelegatebw":
      case "handleGetActions":
      case "handleGetCurrencyBalance":
      case "handleRefund":
          this[msgData.targetFunc].apply(this, [msgData]);
          break
    }
  }

  /* Handle WebView Messages */

  _fireCallback(res, api) {
    if (res) {
      console.log(res, `${api} res`)
      let requests = __apiRequests[api]
      const req = _.find(requests, {state: REQUESTED})
      // console.log(requests, "requests")
      // console.log(req, "req")
      const data = res.data
      if (req.callback)
        req.callback(data.error, data.result) // Callback
      else if (data.error)
        req.reject(data.error) // Promise
      else
        req.resolve(data.result) // Promise

      delete requests[req.requestId]
    }
  }

  handleGetKeyAccounts(res) { this._fireCallback(res, GET_KEY_ACCOUNTS)}
  handleGetAccount(res) { this._fireCallback(res, GET_ACCOUNT)}
  handleGetBlock(res) { this._fireCallback(res, GET_BLOCK)}
  handleIsValidPrivate(res) { this._fireCallback(res, IS_VALID_PRIVATE)}
  handlePrivateToPublic(res) { this._fireCallback(res, PRIVATE_TO_PUBLIC)}
  handleGetTableRows(res) { this._fireCallback(res, GET_TABLE_ROWS)}
  handleGetCurrencyStates(res) { this._fireCallback(res, GET_CURRENCY_STATES)}
  handleVoteproducers(res) { this._fireCallback(res, VOTE_PRODUCERS)}
  handleDelegatebw(res) { this._fireCallback(res, DELEGATEBW)}
  handleUndelegatebw(res) { this._fireCallback(res, UNDELEGATEBW)}
  handleGetActions(res) { this._fireCallback(res, GET_ACTIONS)}
  handleGetCurrencyBalance(res) { this._fireCallback(res, GET_CURRENCY_BALANCE)}
  handleRefund(res) { this._fireCallback(res, REFUND)}
}
