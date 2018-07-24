import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Animated,
  ScrollView
} from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import Indicator, * as IndicatorIcon from '../components/Indicator'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'
import * as consts from '../common/constants'
import PropTypes from 'prop-types'
import { NavigationActions, StackActions, SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as SettingsActions from '../actions/settings'
import * as WalletActions from '../actions/wallet'

class UnlockWalletView extends React.Component {

  static navigationOptions = {
    header: null,
  }

  state = {
    password: null,
    show_indicator: false,
    indicator: {},
    submitting: false,
    success: false,
    fade: new Animated.Value(1),
  }

  constructor(props) {
    super(props)

  }

  componentWillReceiveProps(nextProps) {
    const {
      submitting
    } = this.state
    const {
      wallet,
      validate
    } = nextProps

    if (submitting) {
      console.log(validate, 'Unlockwallet componentWillReceiveProps')
      if (validate.WALLET_PASSWORD === 'SUCCESS') {
        this._showCompleteIndicator()
        this.setState({submitting: false, success: true})
      } else if (validate.WALLET_PASSWORD === 'FAILURE'){
        this._showSubmitFailIndicator()
        this.setState({submitting: false, success: false})
      }
    }
  }

  _finishCheck() {
    const {
      success
    } = this.state
    const {
      navigation,
      validate
    } = this.props

    console.log(navigation)

    if (success) {
      this._fadeOut(() => {
        this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          key: null,
          actions: [NavigationActions.navigate({ routeName: 'Main' })]
        }))
      })
    }
  }

  _fadeOut(callback) {
    Animated.sequence([
      Animated.delay(0), // Option
      Animated.parallel([
        Animated.timing(
          this.state.fade,
          {
            toValue: 0,
            duration: 200,
          }
        )
      ])
    ]).start(()=>{
      if (callback)
        callback()
    })
  }

  _showCompleteIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_VALID,
      title: 'Unlocked!',
      desc: '',
      toast: true
    }
    console.log('_showCompleteIndicator')
    this.setState({show_indicator: true, indicator})
  }

  _showSubmitFailIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_INVALID,
      title: 'Wrong Password',
      desc: '',
      toast: true
    }
    console.log('_showSubmitFailIndicator')
    this.setState({show_indicator: true, indicator})
  }

  _showLoadingIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_LOADING,
      title: 'Unlocking',
      desc: '...',
      toast: false
    }
    console.log('_showLoadingIndicator')
    this.setState({show_indicator: true, indicator})
  }

  _onPressUnlock() {
    const {
      password,
      submitting
    } = this.state
    const {
      actions,
      wallet
    } = this.props

    if (submitting)
      return

      this._showLoadingIndicator()

    this.setState({submitting: true}, () => {
      actions.unlockWallet(wallet, password)
    })
  }

  _onPressCancel() {
    this.props.navigation.goBack()
  }

  _renderIndicator() {
    const {
      show_indicator,
      indicator
    } = this.state
    const {
      icon,
      title,
      desc,
      toast
    } = indicator

    console.log(indicator, show_indicator)

    if (!show_indicator) return undefined

    return (
      <Indicator
        icon={icon}
        title={title}
        desc={desc}
        toast={toast}
        show={toast ? false : true}
        onHide={() => {
          this.setState({show_indicator : false})
          this._finishCheck()
        }}/>)
  }

  render() {
    const {
      password,
      fade,
    } = this.state
    const {
      navigation
    } = this.props
    return (
      <SafeAreaView style={{flex: 1}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <Animated.View style={{flex: 1, opacity: fade}}>
              <KeyboardAwareScrollView style={{flex: 1}}>
                <View style={[styles.container, {height: height}]}>
                  <View style={styles.top}>
                    <View style={styles.top_left}>
                    </View>
                    <View style={styles.top_right}>
                      <Image style={{width:42, height:42}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
                    </View>
                  </View>
                  <View style={styles.body}>
                    <View style={styles.header}>
                      <Text style={styles.header_title}>
                        WALLET IS{'\n'}LOCKED
                      </Text>
                    </View>
                    <View style={styles.content}>
                      <View style={styles.input_area}>
                        {/* ----- INPUT AREA ---- */}
                        <View style={styles.password_input_box}>
                          <TextInput
                            style={[styles.password_input]}
                            value={password}
                            secureTextEntry
                            onChangeText={(password) => this.setState({password})}
                            clearButtonMode="while-editing"
                            placeholder="enter here.."/>
                        </View>
                        <Text style={{color: 'rgb(94, 94, 94)', marginTop: 15}}>
                          Enter wallet <Text style={styles.bold}>password</Text> to unlock
                        </Text>
                        <View style={{padding: 5, marginTop: 20}}>
                          <Text style={{color: 'rgb(158, 158, 158)', fontSize: 12}}>
                            Your wallet password is only used to encrypt/decrypt your private key, and not stored in the app. So if you lost your wallet password, remove the app and install again.
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.bottom}>
                    <View style={styles.bottom_left}>
                    </View>
                    <TouchableOpacity onPress={this._onPressUnlock.bind(this)}>
                      <View style={styles.bottom_right}>
                        <Text style={[styles.major_button, styles.text_right]}>
                          UNLOCK
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            </Animated.View>
          )}
        </OnLayout>
        {this._renderIndicator()}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    keys: state.keys,
    wallet: state.wallet,
    settings: state.settings,
    validate: Object.assign({}, state.validate)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...SettingsActions,
      ...WalletActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UnlockWalletView)


const styles = StyleSheet.create({
  /* Layer 1 */
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  /* Layer 2 */
  top: {
    height: 42,
    marginTop: 15,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    backgroundColor: undefined,
  },
  bottom: {
    height: 42,
    backgroundColor: undefined,
    flexDirection: 'row'
  },
  indicator_overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(255,255,255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input_area: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator_box: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    width: 250,
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
  },
  indicator_text: {
    marginTop: 15,
    fontWeight: "800",
    color: '#ddd'
  },
  indicator_desc: {
    marginTop: 35,
    fontWeight: "400",
    color: '#ddd',
    fontSize: 11
  },
  /* Layer 3 */
  top_left: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20
  },
  top_right: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: 16,
    backgroundColor: undefined,
  },
  header: {
    height: 84,
    backgroundColor: undefined
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  password_input_box: {
    width: '100%',
    marginTop: 5,
    backgroundColor: 'rgba(224, 224, 224, 0.3)',
    height: 46,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  password_input: {
    height: 46,
  },
  bottom_left: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    backgroundColor: undefined
  },
  bottom_right: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 20,
    backgroundColor: undefined
  },
  /* Common */
  bold: {
    fontWeight: '800'
  },
  header_title: {
    color:'rgb(51, 51, 51)',
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 15,
    fontSize: 36,
    lineHeight: 30,
    fontFamily: 'Kohinoor Bangla',
    fontWeight: '400'
  },
  major_button: {
    fontSize: 18,
    fontFamily: 'Kohinoor Bangla'
  },
  minor_button: {
    fontSize: 16,
    fontFamily: 'Kohinoor Bangla',
    color: '#ccc'
  },
  text_right: {
    textAlign: 'right'
  },
  text_left: {
    textAlign: 'left'
  },
  hint: {
    fontSize: 14
  }
});
