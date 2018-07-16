import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, WebView } from 'react-native'
import * as ApiActions from '../actions/api'
import ApiDelegate from '../api/ApiDelegate'

class ApiWebView extends React.Component {

  _eosp

  _apiDelegate

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this._apiDelegate = new ApiDelegate(this._eosp)
    this.props.initApi(this._apiDelegate)
  }

  _onWebViewMessage(event) {
    this._apiDelegate.onMessage(event)
  }

  render() {
    return(
      <View style={{height: 0}}>
        <WebView
          automaticallyAdjustContentInsets={false}
          style={{height: 0}}
          ref={(el) => { return this._eosp = el}}
          source={require('../eosjs/eosjs.html')}
          onMessage={this._onWebViewMessage.bind(this)} />
      </View>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    api: state.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ApiActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiWebView)
