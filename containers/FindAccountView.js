import React from 'react'
import { isIphoneX } from 'react-native-iphone-x-helper'
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
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'
import * as consts from '../common/constants'
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import * as AccountActions from '../actions/accounts'
import * as SettingsActions from '../actions/settings'

console.disableYellowBox = true;
process.env.NODE_ENV = 'production'

var {height, width} = Dimensions.get('window');

const ICON_LOADING = "icon_loading"
const ICON_VALID = "icon_valid"
const ICON_INVALID = "icon_invalid"

const REQUEST_TYPE_ACCOUNT_NAME = 'REQUEST_TYPE_ACCOUNT_NAME'
const REQUEST_TYPE_PUBLIC_KEY = 'REQUEST_TYPE_PUBLIC_KEY'

class FindAccountView extends React.Component {

  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    completion_type: PropTypes.string
  }

  state = {
    input_value: null,
    accounts: null,
    request_type: REQUEST_TYPE_ACCOUNT_NAME,
    fade: new Animated.Value(0),
    fade1: new Animated.Value(0),
    show_indicator: false,
    indicator: {
      icon: null,
      title: null,
      desc: null
    },
    is_requesting: false,
    show_account_select: false
  }

  constructor(props) {
    super(props)

  }

  componentWillReceiveProps(newProps) {
    const { is_requesting, input_value, request_type } = this.state
    console.log(newProps, 'Component WILL RECIEVE PROPS!')

    if (newProps.hasOwnProperty('accounts')) {
      const accounts = newProps.accounts
      if (is_requesting) {
        if (request_type == REQUEST_TYPE_ACCOUNT_NAME) {
          this.showIndicator(ICON_VALID, 'Hello :)', accounts[input_value].account_name, 1000)
          setTimeout(() => {
            this._goNext(accounts[input_value].account_name)
          }, 1000)
        } else if (request_type == REQUEST_TYPE_PUBLIC_KEY) {
          this._hideIndicator()
          this.showAccountSelectIndicator(220)
        }
        this.setState({is_requesting: false})
      }
      this.setState({accounts})
    }
  }

  componentDidMount() {
    console.log('Find account componentDidMount')
  }

  _finalUrl() {
    const { selected_network, input_value } = this.state
    return input_value || selected_network
  }

  _showLoadingIndicator() {
    this.setState({
      indicator: {
        icon: ICON_LOADING,
        title: 'Checking Network..',
        desc: this._finalUrl()
      }
    })
  }

  _showNetworkValidIndicator() {
    let indicator = this.state.indicator
    indicator.icon = ICON_VALID
    indicator.title = 'VALID!'
    this.setState({indicator})
  }

  _showNetworkInvalidIndicator() {
    let indicator = this.state.indicator
    indicator.icon = ICON_INVALID
    indicator.title = 'Enter valid account name or public key'
    this.setState({indicator})
  }

  showIndicator(icon, title, desc, timeout, delay) {
    let indicator = this.state.indicator || {}
    indicator.icon = icon
    indicator.title = title
    indicator.desc = desc
    this.setState({indicator})

    this._showIndicator(delay)

    if (timeout) {
      setTimeout(()=>{
        this._hideIndicator()
      }, timeout)
    }
  }

  showAccountSelectIndicator(delay = 0) {
    this.setState({show_account_select: true})
    Animated.sequence([
      Animated.delay(delay), // Option
      Animated.parallel([
        Animated.timing(
          this.state.fade1,
          {
            toValue: 1,
            duration: 200,
          }
        )
      ])
    ]).start()
  }

  hideAccountSelectIndicator(delay = 0, callback) {
    Animated.sequence([
      Animated.delay(delay), // Option
      Animated.parallel([
        Animated.timing(
          this.state.fade1,
          {
            toValue: 0,
            duration: 200,
          }
        )
      ])
    ]).start(()=>{
      this.setState({show_account_select: false})
      if (callback)
        callback()
    })
  }

  _showIndicator(delay = 0) {
    this.setState({show_indicator: true})

    Animated.sequence([
      Animated.delay(delay), // Option
      Animated.parallel([
        Animated.timing(
          this.state.fade,
          {
            toValue: 1,
            duration: 200,
          }
        )
      ])
    ]).start()
  }

  _hideIndicator() {
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
      this.setState({show_indicator: false})
    })
  }

  _checkNetwork(network) {
    this._showLoadingIndicator()
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
      if (request.readyState !== 4) {
        return;
      }

      var callback = undefined;

      if (request.status === 200) {
        console.log('success', request);
        const responseJson = JSON.parse(request.responseText)
        if (responseJson.chain_id === CHAIN_ID) {
          this._showNetworkValidIndicator()
        } else {
          this._showNetworkInvalidIndicator()
        }
      } else {
        console.warn('error');
        this._showNetworkInvalidIndicator()
        callback = () => {
          this._complete()
        }
      }

      setTimeout(()=>{
        this._hideIndicator()
        if (callback) {
          callback()
        }
      }, 2000)

    };

    request.open('GET', `https://${network}/v1/chain/get_info`);
    request.send();
  }

  _resetAccountSelect() {

  }

  _goNext(account_name) {
    const {
      actions,
      navigation
    } = this.props
    actions.setSetting('account', account_name)
    navigation.navigate('AccessAccount', {account_name})
  }

  _onPressNext() {
    const { input_value } = this.state

    // Validation
    if (!input_value) {
      return this.showIndicator(ICON_INVALID, 'Enter account name \nor public key', '', 1000)
    } else if (input_value.length != 12 && input_value.length != 53) {
      console.log(input_value.length, 'input_value.length')
      return this.showIndicator(ICON_INVALID, 'Wrong name or public key', input_value, 1000)
    } else if (input_value.length == 53 && input_value.slice(0,3) !== 'EOS') {
      return this.showIndicator(ICON_INVALID, 'Wrong public key', input_value, 1000)
    }

    this.setState({is_requesting: true})

    let request_type
    if (input_value.length == 53 && input_value.slice(0,3) === 'EOS') {
      request_type = REQUEST_TYPE_PUBLIC_KEY
      this.props.actions.getAccountByKey(input_value)
    } else {
      request_type = REQUEST_TYPE_ACCOUNT_NAME
      this.props.actions.getAccount(input_value)
    }

    this.setState({request_type})
    this.showIndicator(ICON_LOADING, 'Fetching Account', input_value)

  }

  _onPressAccount(item) {
    this.hideAccountSelectIndicator(0, () => {
      this._goNext(item)
    })
  }

  _onPressCancelChoosing() {
    this.hideAccountSelectIndicator()
  }

  _renderIndicator(width, height) {
    const { show_indicator, indicator, fade } = this.state
    if (!show_indicator) return undefined

    return(
      <Animated.View pointerEvents="box-none" style={[styles.indicator_overlay, {width: width, height: height, opacity: fade}]}>
        <View style={styles.indicator_box}>
          { indicator.icon == ICON_LOADING
            ? <ActivityIndicator style={styles.indicator} size="large" />
            : indicator.icon == ICON_VALID
            ? <Icon size={40} name="check" color="rgb(46, 204, 113)"/>
            : <Icon size={40} name="x" color="rgb(231, 76, 60)"/>}
          <Text style={styles.indicator_desc}>{indicator.desc}</Text>
          <Text style={styles.indicator_text}>{indicator.title}</Text>
        </View>
      </Animated.View>
    )
  }


  _renderAccountSelect(width, height) {
    const { show_account_select, fade1, accounts } = this.state
    if (!show_account_select) return undefined

    const array = accounts.__lookups

    return (
      <Animated.View pointerEvents="box-none" style={[styles.indicator_overlay, {width: width, height: height, opacity: fade1}]}>
        <View style={styles.indicator_box}>
          <Icon name="user" size={24} color="#fff"/>
          <Text style={{fontWeight: 'bold', color:'#fff', marginTop: 10}}>Choose Account</Text>
          <View style={styles.account_list}>
            {array.map((item) => {
              return (
                <TouchableOpacity
                  style={styles.account_list_item}
                  onPress={this._onPressAccount.bind(this, item)}>
                    <Text style={{color: '#fff'}}>{item}</Text>
                </TouchableOpacity>)
            })}
          </View>
        </View>
      </Animated.View>
    )
  }

  render() {
    const { selected_network, networks, input_value, accounts } = this.state

    return (
      <SafeAreaView style={{flex: 1}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <KeyboardAwareScrollView style={{flex: 1}}>
              <View style={[styles.container, {height: height}]}>
                <View style={styles.top}>
                  <View style={styles.top_left}>
                    <Text style={styles.hint}>{this.props.completion_type == consts.COMPLETION_TYPE_DONE ? '' : 'STEP 1'}</Text>
                  </View>
                  <View style={styles.top_right}>
                    <Image style={{width:42, height:42}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.header}>
                    <Text style={styles.header_title}>
                      FIND YOUR{'\n'}ACCOUNT
                    </Text>
                  </View>
                  <View style={styles.content}>
                    {/* ----- INPUT AREA ---- */}
                    <View style={styles.input_box}>
                      <TextInput
                        style={[styles.input]}
                        value={input_value}
                        multiline={false}
                        maxLength={53}
                        returnKeyType="next"
                        onChangeText={(input_value) => this.setState({input_value})}
                        onSubmitEditing={this._onPressNext.bind(this)}
                        clearButtonMode="while-editing"
                        placeholder="enter here.."/>
                    </View>
                    <Text style={{color: 'rgb(94, 94, 94)', marginTop: 15}}>
                      Enter your <Text style={styles.bold}>public key</Text> or <Text style={styles.bold}>account name</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.bottom}>
                  <View style={styles.bottom_left}>
                  </View>
                  <TouchableOpacity onPress={this._onPressNext.bind(this)}>
                    <View style={styles.bottom_right}>
                      <Text style={[styles.major_button, styles.text_right]}>
                        {this.props.completion_type == consts.COMPLETION_TYPE_DONE ? 'DONE' : 'NEXT'} 〉
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {this._renderIndicator(width, height)}
                {this._renderAccountSelect(width, height)}
              </View>
            </KeyboardAwareScrollView>
          )}
        </OnLayout>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    accounts: state.accounts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...SettingsActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FindAccountView)

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
    backgroundColor: process.env.NODE_ENV == 'development' ? 'red' : 'white',
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'blue' : undefined,
    paddingBottom: 40
  },
  bottom: {
    height: 42,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'orange' : undefined,
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
  indicator_box: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    width: 250,
    minHeight: 250,
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
    textAlign: 'center',
    marginTop: 15,
    fontWeight: "800",
    color: '#ddd'
  },
  indicator_desc: {
    marginTop: 35,
    padding: 20,
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
    backgroundColor: process.env.NODE_ENV == 'development' ? 'orange' : undefined,
  },
  header: {
    height: 84,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'grey' : undefined
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input_box: {
    width: '100%',
    marginTop: 5,
    backgroundColor: 'rgba(224, 224, 224, 0.3)',
    height: 46,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  input: {
    height: 46,
  },
  account_list: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  account_list_item: {
    marginTop: 5,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderColor: '#eee',
    borderWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  bottom_left: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 20,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'red' : undefined
  },
  bottom_right: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 20,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'blue' : undefined
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
})
