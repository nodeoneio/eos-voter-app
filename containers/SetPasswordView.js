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
import Icon from 'react-native-vector-icons/Feather'
import IonIcon from 'react-native-vector-icons/Ionicons'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'
import * as consts from '../common/constants'
import PropTypes from 'prop-types'
import { NavigationActions, StackActions, SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Indicator, * as IndicatorIcon from '../components/Indicator'

console.disableYellowBox = true;
process.env.NODE_ENV = 'production'

var {height, width} = Dimensions.get('window');

export default class SetPassword extends React.Component {

  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    onComplete: PropTypes.func,
    completion_type: PropTypes.string,
  }

  state = {
    completion_type: this.props.navigation.getParam('completion_type', consts.COMPLETION_TYPE_NEXT),
    password: '',
    password_confirm: '',
    skip: false,
    show_indicator: false,
    indicator: {
      icon: undefined,
      title: undefined,
      content: undefined
    }
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  _goNext() {
    // this.props.navigation.dispatch({
    //   type: 'Navigation/RESET',
    //   index: 0,
    //   actions: [{ type: 'Navigate', routeName: 'VoteView' }]
    // })

    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: 'Main' })]
    }))
  }

  _onPressCancel() {
    this.props.navigation.goBack()
  }

  _onPressNext() {

    const {
      password,
      password_confirm,
      skip
    } = this.state

    // Validation
    let indicator = {}
    if (!skip) {
      if (password.length < 4) {
        indicator.icon = IndicatorIcon.ICON_INVALID
        indicator.title = 'Invalid password'
        indicator.desc = 'Input at leat 4 charactor for the password'

      } else if (password !== password_confirm) {
        indicator.icon = IndicatorIcon.ICON_INVALID
        indicator.title = 'Passwords not matched'
        indicator.desc = 'Re-enter password'
      } else { // VALID
        indicator.icon = IndicatorIcon.ICON_VALID
        indicator.title = 'Success!'
        indicator.desc = 'Password configured'
        setTimeout(() => {
          this._goNext()
        }, 2000)
      }
      this.setState({indicator, show_indicator: true})
      return
    }

    this._goNext()
  }

  _onPressDone() {
    alert('Done')
  }

  _onPressSkip() {
    const { skip } = this.state
    this.setState({ skip : !skip})
  }

  _renderIndicator() {

    const {
      show_indicator,
      indicator
    } = this.state
    const {
      icon,
      title,
      desc
    } = indicator

    console.log(indicator, show_indicator)

    if (!show_indicator) return undefined

    return (
      <Indicator
        icon={icon}
        title={title}
        desc={desc}
        toast={true}
        onHide={() => {
          this.setState({show_indicator : false})
        }}/>)
  }

  render() {
    const { password, password_confirm, completion_type, skip } = this.state
    return (
      <SafeAreaView style={{flex: 1}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <KeyboardAwareScrollView style={{flex: 1}}>
              <View style={[styles.container, {height: height}]}>
                <View style={styles.top}>
                  <View style={styles.top_left}>
                    <Text style={styles.hint}>{completion_type == consts.COMPLETION_TYPE_DONE ? '' : 'STEP 3'}</Text>
                  </View>
                  <View style={styles.top_right}>
                    <Image style={{width:42, height:42}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.header}>
                    <Text style={styles.header_title}>
                      SET WALLET{'\n'}PASSWORD
                    </Text>
                  </View>
                  <View style={styles.content}>
                    {completion_type == consts.COMPLETION_TYPE_DONE
                     ? undefined
                     : <Text style={{color: 'rgb(94, 94, 94)'}}>Account Name : <Text style={styles.bold}>robinsonpark</Text></Text>}

                    <View style={styles.input_area}>
                      {/* ----- INPUT AREA ---- */}
                      <View style={styles.password_input_box}>
                        <TextInput
                          style={[styles.password_input, {opacity: skip ? .3 : 1}]}
                          value={password}
                          editable={!skip}
                          secureTextEntry
                          onChangeText={(password) => this.setState({password})}
                          clearButtonMode="while-editing"
                          placeholder="enter password.."/>
                      </View>
                      <View style={styles.password_input_box}>
                        <TextInput
                          style={[styles.password_input, {opacity: skip ? .3 : 1}]}
                          value={password_confirm}
                          editable={!skip}
                          secureTextEntry
                          onChangeText={(password_confirm) => this.setState({password_confirm})}
                          clearButtonMode="while-editing"
                          placeholder="confirm password.."/>
                      </View>
                      {completion_type == consts.COMPLETION_TYPE_DONE
                       ? undefined
                       : <TouchableOpacity
                           style={{
                              marginTop: 10,
                              width: '100%',
                              height: 30,
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              flexDirection: 'row'}}
                           onPress={this._onPressSkip.bind(this)}>
                        <IonIcon style={{padding: 3, paddingTop: 5, marginRight: 5}} size={20} color={ skip ? 'orange' : '#ddd'} name={ skip ? 'ios-radio-button-on' : 'ios-radio-button-off'}/>
                           <Text style={{color: 'rgb(94, 94, 94)'}}>Skip this Step</Text>
                         </TouchableOpacity>}
                      <View style={{padding: 5, marginTop: 10}}>
                        <Text style={{color: 'rgb(158, 158, 158)'}}>
                          If you don't use password to lock your wallet, you will have to re-enter your priate key every time you access your account.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.bottom}>
                  <View style={styles.bottom_left}>
                    {completion_type == consts.COMPLETION_TYPE_DONE
                    ? <TouchableOpacity onPress={this._onPressCancel.bind(this)}>
                        <Text style={[styles.minor_button, styles.text_left]}>
                          CANCEL
                        </Text>
                      </TouchableOpacity>
                    : undefined}
                  </View>
                  <TouchableOpacity onPress={this._onPressNext.bind(this)}>
                    <View style={styles.bottom_right}>
                      <Text style={[styles.major_button, styles.text_right]}>
                        {completion_type == consts.COMPLETION_TYPE_DONE ? 'DONE' : 'NEXT 〉'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* {this._renderIndicator(width, height)} */}
              </View>
            </KeyboardAwareScrollView>
          )}
        </OnLayout>
        {this._renderIndicator()}
      </SafeAreaView>
    );
  }
}

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
  input_area: {
    marginTop: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  password_input_box: {
    backgroundColor: 'rgba(224, 224, 224, 0.3)',
    width: '100%',
    paddingLeft: 10,
    justifyContent: 'center',
    marginBottom: 1
  },
  password_input: {
    height: 46,
  },
  bottom_left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
