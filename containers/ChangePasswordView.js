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
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'




var {height, width} = Dimensions.get('window');

export default class ChangePassword extends React.Component {

  static navigationOptions = {
    header: null,
  }

  state = {
    completion_type: this.props.navigation.getParam('completion_type', consts.COMPLETION_TYPE_NEXT),
    current_password: null,
    password: null,
    password_confirm: null
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  _onPressCancel() {
    this.props.navigation.goBack()
  }

  _onPressNext() {
    this.props.navigation.navigate('VoteView')
  }

  _onPressDone() {
    alert('Done')
  }

  render() {
    const { current_password, password, password_confirm, completion_type } = this.state
    return (
      <SafeAreaView style={{flex: 1}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <KeyboardAwareScrollView style={{flex: 1}}>
              <View style={[styles.container, {height: height}]}>
                <View style={styles.top}>
                  <View style={styles.top_left}>
                    <Text style={styles.hint}>{completion_type == consts.COMPLETION_TYPE_DONE ? '' : 'STEP 4'}</Text>
                  </View>
                  <View style={styles.top_right}>
                    <Image style={{width:42, height:42}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.header}>
                    <Text style={styles.header_title}>
                      CHANGE WALLET{'\n'}PASSWORD
                    </Text>
                  </View>
                  <View style={styles.content}>
                    {completion_type == consts.COMPLETION_TYPE_DONE
                     ? undefined
                     : <Text style={{color: 'rgb(94, 94, 94)'}}>Account Name : <Text style={styles.bold}>robinsonpark</Text></Text>}

                    <View style={styles.input_area}>
                      {/* ----- INPUT AREA ---- */}
                      <View style={[styles.password_input_box, styles.current_password_input_box]}>
                        <TextInput
                          style={[styles.password_input]}
                          value={current_password}
                          secureTextEntry
                          onChangeText={(current_password) => this.setState({current_password})}
                          clearButtonMode="while-editing"
                          placeholder="enter current password.."/>
                      </View>
                      <View style={styles.password_input_box}>
                        <TextInput
                          style={[styles.password_input]}
                          value={password}
                          secureTextEntry
                          onChangeText={(password) => this.setState({password})}
                          clearButtonMode="while-editing"
                          placeholder="enter new password.."/>
                      </View>
                      <View style={styles.password_input_box}>
                        <TextInput
                          style={[styles.password_input]}
                          value={password_confirm}
                          secureTextEntry
                          onChangeText={(password_confirm) => this.setState({password_confirm})}
                          clearButtonMode="while-editing"
                          placeholder="confirm password.."/>
                      </View>
                      {completion_type == consts.COMPLETION_TYPE_DONE
                       ? undefined
                       : <View style={{
                           marginTop: 10,
                           width: '100%',
                           height: 30,
                           justifyContent: 'flex-start',
                           alignItems: 'center',
                           flexDirection: 'row'}}>
                           <IonIcon style={{padding: 3, paddingTop: 6, marginRight: 5}} size={20} color="#ddd" name="ios-radio-button-off"/>
                           <Text style={{color: 'rgb(94, 94, 94)'}}>Skip this Step</Text>
                         </View>}
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
      </SafeAreaView>
    );
  }
}

ChangePassword.propTypes = {
  onComplete: PropTypes.func,
  completion_type: PropTypes.string,
  network: PropTypes.string
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
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    backgroundColor: undefined,
    paddingBottom: 40
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
  input_area: {
    marginTop: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  current_password_input_box: {
    marginBottom: 25
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
