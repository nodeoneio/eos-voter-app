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
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'
import * as consts from '../common/constants'
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Indicator, * as IndicatorIcon from '../components/Indicator'

import * as AccountActions from '../actions/accounts'
import * as SettingsActions from '../actions/settings'
import * as WalletActions from '../actions/wallet'
import * as ValidateActions from '../actions/validate'

import * as Api from '../api/ApiDelegate'


console.disableYellowBox = true;
process.env.NODE_ENV = 'production'

var {height, width} = Dimensions.get('window');

class AccessAccount extends React.Component {

  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    completion_type: PropTypes.string
  }

  state = {
    key: null,
    account: this.props.account,
    account_name: this.props.navigation.getParam('account_name', ''),
    show_indicator: false
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {
    if (newProps.hasOwnProperty('validate')) {
      const validate = newProps.validate
      this.setState({validate, show_indicator: true})

      if (validate.KEY === 'SUCCESS') {
        this._goNext()
      }
    }
  }

  _showInvalidIndicator() {

  }

  _showValidIndicator() {

  }

  _goNext() {
    const {
      actions,
      navigation
    } = this.props

    setTimeout(() => {
      navigation.navigate('SetPassword')
    }, 1000)
  }

  _onPressNext() {
    const {
      key
    } = this.state
    const {
      validate,
      actions,
      api
    } = this.props

    this.props.actions.setTemporaryKey(key)

    api.request(Api.IS_VALID_PRIVATE, {key: key})
    .then((valid) => {
      console.log('valid key!', key)
      actions.validateKey(key)
    })
    .catch((error) => {
      console.log('Error', error)
    })
  }

  _renderIndicator() {
    const {
      account,
      validate,
      show_indicator
    } = this.state
    var show = false,
        toast = false
    var icon,
        title,
        desc

    if (!validate || !show_indicator) return undefined

    if (validate.KEY === 'PENDING') {
      icon = IndicatorIcon.ICON_LOADING
      title = 'Checking Private Key'
      desc = account
      show = true
    } else if (validate.KEY === 'SUCCESS') {
      icon = IndicatorIcon.ICON_VALID
      title = 'Matches Private Key'
      desc = 'The private key entered matches the public key on the accounts permissions'
      toast = true
    } else if (validate.KEY === 'FAILURE') {
      icon = IndicatorIcon.ICON_INVALID
      title = 'Invalid Private Key'
      desc = 'The private key entered does not matches the public key on the accounts permissions'
      toast = true
    }

    return (
      <Indicator
        icon={icon}
        title={title}
        desc={desc}
        show={show}
        toast={toast}
        ref={el => { this._indicator = el }}
        onHide={() => {
          this.setState({show_indicator : false})
        }}/>)
  }

  render() {
    const {
      key,
      account,
      account_name
    } = this.state
    const {
      validate
    } = this.props

    return (
      <SafeAreaView style={{flex: 1}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <KeyboardAwareScrollView style={{flex: 1}}>
              <View style={[styles.container, {minHeight: height}]}>
                <View style={styles.top}>
                  <View style={styles.top_left}>
                    <Text style={styles.hint}>{this.props.completion_type == consts.COMPLETION_TYPE_DONE ? '' : 'STEP 2'}</Text>
                  </View>
                  <View style={styles.top_right}>
                    <Image style={{width:42, height:42}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.header}>
                    <Text style={styles.header_title}>
                      ACCESS{'\n'}ACCOUNT
                    </Text>
                  </View>
                  <View style={styles.content}>
                    <Text style={{color: 'rgb(94, 94, 94)'}}>Account Name : <Text style={styles.bold}>{account_name}</Text></Text>
                    <View style={styles.input_area}>
                      {/* ----- INPUT AREA ---- */}
                      <View style={styles.input_box}>
                        <TextInput
                          style={[styles.input]}
                          value={key}
                          secureTextEntry
                          onChangeText={(key) => this.setState({key})}
                          clearButtonMode="while-editing"
                          placeholder="enter here.."/>
                      </View>
                      <Text style={{color: 'rgb(94, 94, 94)', marginTop: 15}}>
                        Enter your <Text style={styles.bold}>private key</Text>
                      </Text>
                    </View>
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
              </View>
            </KeyboardAwareScrollView>
          )}
        </OnLayout>
        {this._renderIndicator()}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    validate: state.validate,
    account: state.account,
    api: state.api,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...SettingsActions,
      ...WalletActions,
      ...ValidateActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccessAccount)


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
  input_area: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
