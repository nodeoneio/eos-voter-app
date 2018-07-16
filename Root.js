import { AppRegistry } from 'react-native'

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, WebView } from 'react-native'
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

import ApiDelegate from './api/ApiDelegate'
import * as AccountActions from './actions/accounts'
import * as ApiActions from './actions/api'


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
    UnlockWallet: UnlockWalletView,
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

var RootStack
class Root extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    data: PropTypes.object
  }

  constructor(props) {
    super(props)

    const {
      settings,
      wallet
    } = props

    console.log(props, 'Root props')

    var isLogged = false //settings.account ? true : false
    const Main = { screen: MainStack }
    const AuthMain = { screen: AuthMainStack }

    var startingView
    if (isLogged) {
      startingView = { Main, AuthMain }
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


  render() {
    return (
      <View style={{flex: 1}}>
        <ApiWebView />
        <RootStack />
      </View>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    keys: state.keys,
    wallets: state.wallet,
    settings: state.settings
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(ApiActions, dispatch)
// }

const ConnectedRoot = connect(mapStateToProps)(Root)


export default ConnectedRoot
