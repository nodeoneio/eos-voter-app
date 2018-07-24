import { AppRegistry } from 'react-native'
import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, WebView, AppState } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import SelectNetworkView from './containers/SelectNetworkView'
import FindAccountView from './containers/FindAccountView'
import AccessAccountView from './containers/AccessAccountView'
import SetPasswordView from './containers/SetPasswordView'
import ChangePasswordView from './containers/ChangePasswordView'
import UnlockWalletView from './containers/UnlockWalletView'
import VoteView from './containers/VoteView'
import SettingsView from './containers/SettingsView'
import StakeView from './containers/StakeView'
import EVWebView from './containers/WebView'
import ApiWebView from './containers/ApiWebView'
import TestView from './containers/TestView'

import ApiDelegate from './api/ApiDelegate'
import * as AccountActions from './actions/accounts'
import * as ApiActions from './actions/api'
import * as WalletActions from './actions/wallet'
import * as SettingsActions from './actions/settings'


/* Navigation Flows */

const AuthMainStack = createStackNavigator(
  {
    SelectNetwork: SelectNetworkView,
    FindAccount: FindAccountView,
    AccessAccount: AccessAccountView,
    SetPassword: SetPasswordView
  },
  {
    initialRouteName: 'FindAccount',
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

const MainStack = createStackNavigator(
  {
    VoteView: VoteView
  },
  {
    initialRouteName: 'VoteView',
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

const SettingStack = createStackNavigator(
  {
    SelectNetwork: SelectNetworkView,
    SetPassword: SetPasswordView,
    ChangePassword: ChangePasswordView,
    SettingsView: SettingsView
  },
  {
    initialRouteName: 'SettingsView',
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

const UnlockWallet = createStackNavigator(
  {
    UnlockWallet: UnlockWalletView,
  },
  {
    initialRouteName: 'UnlockWallet',
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
)

var RootStack
class Root extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    data: PropTypes.object
  }

  state = {
    appState: AppState.currentState
  }

  constructor(props) {
    super(props)

    const {
      settings,
      wallet
    } = props

    console.log(props, 'Root props')

    var hasPassword = wallet.data ? true : false
    const Main = { screen: MainStack }
    const AuthMain = { screen: AuthMainStack }

    var startingView
    if (hasPassword) {
      startingView = { UnlockWallet, Main, AuthMain }
    } else {
      startingView = { AuthMain, Main }
    }

    RootStack = createStackNavigator(
      {
        ...startingView,
        SettingModal: {
          screen: SettingStack,
        },
        StakeModal: {
          screen: createStackNavigator(
          {
            StakeView: StakeView
          },
          {
            mode: 'modal',
            headerMode: 'none',
          })
        },
        WebViewModal: {
          screen: createStackNavigator(
          {
            WebView: EVWebView
          },
          {
            mode: 'modal',
            headerMode: 'none',
          })
        }
      },
      {
        mode: 'modal',
        headerMode: 'none',
      }
    )
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _presentUnlockView() {
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Unlock' })]
    }))
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
    } else {
      // wallet.data 가 있고 현재 뷰가 UnlockWallet 이 아닐 경우
      // --> 현재뷰를 UnlockWallet 뷰로 바꿈
      if (_.get(this._root, 'props.navigation.state.routeName') !== 'Unlock') {
          this._presentUnlockView()
      }
    }
    this.setState({appState: nextAppState});
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ApiWebView />
        <RootStack ref={(el) => { this._root = el}} />
      </View>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    keys: state.keys,
    wallet: state.wallet,
    settings: state.settings
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(ApiActions, dispatch)
// }

const ConnectedRoot = connect(mapStateToProps)(Root)


export default ConnectedRoot
