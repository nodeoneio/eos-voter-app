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
import Icon from 'react-native-vector-icons/Feather'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'
import * as consts from '../common/constants'
import PropTypes from 'prop-types'
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


process.env.NODE_ENV = 'production'

const __networks = [
  "api.main-net.eosnodeone.io",
  "mainnet.eoscanada.com",
  "fn.eossweden.se",
  "bp.cryptolions.io"
]

var {height, width} = Dimensions.get('window');

const ICON_LOADING = "icon_loading"
const ICON_VALID = "icon_valid"
const ICON_INVALID = "icon_invalid"

export default class LockWallet extends React.Component {

  static navigationOptions = {
    header: null,
  }

  state = {
    completion_type: this.props.navigation.getParam('completion_type', consts.COMPLETION_TYPE_NEXT),
    password: null
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  _onPressNext() {
    this.props.navigation.navigate('SetPassword')
  }

  _onPressDone() {
    alert('Done')
  }

  _onPressCancel() {
    this.props.navigation.goBack()
  }

  render() {
    const { completion_type, password } = this.state
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
                      LOCK WALLET
                    </Text>
                  </View>
                  <View style={styles.content}>
                    <View style={styles.input_area}>
                      {/* ----- INPUT AREA ---- */}
                      <View style={styles.password_input_box}>
                        <TextInput
                          style={[styles.password_input]}
                          value={password}
                          onChangeText={(password) => this.setState({password})}
                          clearButtonMode="while-editing"
                          placeholder="enter here.."/>
                      </View>
                      <Text style={{color: 'rgb(94, 94, 94)', marginTop: 15}}>
                        Enter your wallet <Text style={styles.bold}>password</Text>
                      </Text>
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

UnlockWallet.propTypes = {
  onComplete: PropTypes.func,
  completion_type: PropTypes.string
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
