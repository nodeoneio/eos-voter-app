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
  Button
} from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'
import * as consts from '../common/constants'
import PropTypes from 'prop-types'
import { SafeAreaView } from 'react-navigation'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

console.disableYellowBox = true;
process.env.NODE_ENV = 'production'

const CHAIN_ID = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'

const __networks = [
  "api.main-net.eosnodeone.io",
  "mainnet.eoscanada.com",
  "fn.eossweden.se",
  "bp.cryptolions.io"
]

const ICON_LOADING = "icon_loading"
const ICON_VALID = "icon_valid"
const ICON_INVALID = "icon_invalid"

export default class SelectNetwork extends React.Component {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {
    completion_type: PropTypes.string,
    network: PropTypes.string
  }

  state = {
    selected_network: this.props.navigation.getParam('network', __networks[0]),
    networks: __networks,
    custom_url: null,
    fade: new Animated.Value(0),
    show_indicator: false,
    indicator: {
      icon: null,
      title: null,
      desc: null
    },
    completion_type: this.props.navigation.getParam('completion_type', consts.COMPLETION_TYPE_NEXT)
  }

  constructor(props) {
    super(props)


  }

  componentDidMount() {

  }

  _finalUrl() {
    const { selected_network, custom_url } = this.state
    return custom_url || selected_network
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
    indicator.title = 'Network not reachable!'
    this.setState({indicator})
  }


  _showIndicator() {
    this.setState({show_indicator: true})
    Animated.sequence([
      Animated.delay(0), // Option
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
    ]).start(() => {
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
        const responseJson = JSON.parse(request.responseText)
        if (responseJson.chain_id === CHAIN_ID) {
          this._showNetworkValidIndicator()
          callback = () => {
            if (this.state.completion_type == consts.COMPLETION_TYPE_DONE) {
              this.props.navigation.goBack()
            } else {
              this.props.navigation.navigate('FindAccount')
            }
          }
        } else {
          this._showNetworkInvalidIndicator()
        }
      } else {
        console.warn('error');
        this._showNetworkInvalidIndicator()
      }

      setTimeout(()=>{
        this._hideIndicator()
        if (callback) {
          callback()
        }
      }, 1500)

    };

    request.open('GET', `https://${network}/v1/chain/get_info`);
    request.send();
  }

  _onPressNetworkItem(selected_network, s) {
    console.log(selected_network)
    this.setState({selected_network, custom_url: null})
  }

  _onPressComplete() {
    const { selected_network, custom_url } = this.state
    const url = this._finalUrl()
    this._showIndicator()
    this._checkNetwork(url)
  }

  _onPressCancel() {
    this.props.navigation.goBack()
  }

  _renderIndicator(width, height) {
    const { show_indicator, indicator, fade } = this.state
    if (!show_indicator) return undefined

    return(
      <Animated.View pointerEvents={!show_indicator ? "box-none" : ""} style={[styles.indicator_overlay, {width: width, height: height, opacity: fade}]}>
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

  render() {
    const { selected_network, networks, custom_url, completion_type } = this.state
    return (
      <SafeAreaView style={{flex: 1}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <KeyboardAwareScrollView style={{flex: 1}}>
              <View style={[styles.container, {height: height}]}>
                <View style={styles.top}>
                  <View style={styles.top_left}>
                    <Text style={styles.hint}>{completion_type == consts.COMPLETION_TYPE_DONE ? '' : 'STEP 1'}</Text>
                  </View>
                  <View style={styles.top_right}>
                    <Image style={{width:42, height:42}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.header}>
                    <Text style={styles.header_title}>
                      SELECT{'\n'}NETWORK
                    </Text>
                  </View>
                  <View style={styles.content}>
                    {/* ----- RECOMMENDED NETWORK AREA ---- */}
                    <Text style={{color: 'rgb(94, 94, 94)'}}>Recommended :</Text>
                    <FlatList
                      style={styles.networks_box}
                      data={networks}
                      extraData={custom_url || selected_network}
                      renderItem={({item}) => (
                        <TouchableOpacity onPress={this._onPressNetworkItem.bind(this, item)}>
                          <View style={styles.network_item}>
                            {!custom_url && item === selected_network ? <Icon style={styles.network_item_check} size={24} name="check" color="rgb(46, 204, 113)"/> : undefined}
                            <Text style={{color: 'rgb(94, 94, 94)'}}>
                              {item}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                    {/* ----- ENTER URL AREA ---- */}
                    <Text style={{color: 'rgb(94, 94, 94)'}}>Or enter URL :</Text>
                    <View style={[styles.custom_url_input, {height: 46}]}>
                      <TextInput
                        value={custom_url}
                        onChangeText={(custom_url) => this.setState({custom_url})}
                        clearButtonMode="while-editing"
                        placeholder="enter here.."/>
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
                    <View style={styles.bottom_right}>
                      <TouchableOpacity onPress={this._onPressComplete.bind(this)}>
                        <Text style={[styles.major_button, styles.text_right]}>
                          {completion_type == consts.COMPLETION_TYPE_DONE ? 'DONE' : 'NEXT 〉'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                </View>
                {this._renderIndicator(width, height)}
              </View>
            </KeyboardAwareScrollView>
          )}
        </OnLayout>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  /* Layer 1 */
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column'
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
    backgroundColor: process.env.NODE_ENV == 'development' ? 'blue' : undefined
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
    paddingLeft: 20,
    paddingRight: 20
  },
  networks_box: {
    marginTop: 5,
    marginBottom: 15
  },
  network_item: {
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1
  },
  network_item_check: {
    position: 'absolute',
    left: 15
  },
  custom_url_input: {
    marginTop: 5,
    backgroundColor: 'rgba(224, 224, 224, 0.3)',
    height: 46,
    paddingLeft: 10,
    justifyContent: 'center',
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
