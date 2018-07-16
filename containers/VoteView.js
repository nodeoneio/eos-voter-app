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
  Button,
  TouchableHighlight,
  // SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Feather'
import IonIcon from 'react-native-vector-icons/Ionicons'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'
import { NavigationActions, StackActions, SafeAreaView } from 'react-navigation'
import Indicator, * as IndicatorIcon from '../components/Indicator'
import * as consts from '../common/constants'
import * as AccountActions from '../actions/accounts'
import * as SettingsActions from '../actions/settings'
import * as ProducersActions from '../actions/producers'
import * as GlobalsActions from '../actions/globals'

console.disableYellowBox = true;
process.env.NODE_ENV = 'production'

const ICON_LOADING = "icon_loading"
const ICON_VALID = "icon_valid"
const ICON_INVALID = "icon_invalid"

class VoteView extends React.Component {
  static navigationOptions = {
    header: null,
  }

  static propTypes = {

  }

  state = {
    selected_bpcs: [],
    bpcs: [],
    custom_url: null,
    show_indicator: false,
    indicator: {},
    producers: {}
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {
    const {
      producers
    } = newProps
    if (producers) {
      this.setState({producers})
    }
    console.log(producers, 'producers')
  }

  _onPressBpcsItem(bpc) {
    let selected_bpcs = this.state.selected_bpcs
    const idx = selected_bpcs.indexOf(bpc)
    selected_bpcs = Object.assign([], selected_bpcs)
    if (idx > -1) {
      selected_bpcs.splice(idx, 1)
    } else {
      selected_bpcs.push(bpc)
    }

    this.setState({selected_bpcs})
    console.log(selected_bpcs, "selected_bpcs")
  }

  _onPressVote() {
    const {
      actions
    } = this.props
    const {
      getProducers,
      getGlobals
    } = actions

    getGlobals()
    getProducers()
  }

  _onPressDone() {
    alert('Done')
  }

  _onPressStake() {
    this.props.navigation.navigate('StakeModal')
  }

  _onPressLink(url) {
    console.log(url)
    this.props.navigation.navigate('WebViewModal', {
      url: url
    })
  }

  _onPressSettings() {
    this.props.navigation.navigate('SettingModal')
  }

  _renderIndicator() {
    const { show_indicator, indicator } = this.state
    if (!show_indicator) return undefined

    return(
      <Indicator />
    )
  }

  _cleanUrl(url) {
    if (url)
      return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]

    return ''
  }

  render() {
    const { selected_bpcs, bpcs, custom_url, producers } = this.state
    const { account, settings } = this.props
    return (
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <View style={[styles.container, {height: height}]}>
              <View style={styles.top}>
                <View style={styles.top_left}>
                  <Image style={{width:42, height:42}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
                </View>
                <View style={styles.top_right}>
                  <TouchableOpacity style={{alignItems: 'flex-end'}} onPress={this._onPressStake.bind(this)}>
                    <Text style={[styles.bold, {color:'#999', fontSize: 14}]}><Icon name="user" size={16}/> {settings.account}</Text>
                    <Text style={{color: 'orange', fontSize: 10, fontWeight: '600'}}>Staked <Text style={styles.bold}>1,100</Text> EOS - <Text style={{textDecorationLine: 'underline'}}>Change</Text></Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.body}>
                <View style={styles.header}>
                  <Text style={styles.header_title}>
                    SELECT{'\n'}BPCs & VOTE
                  </Text>
                </View>
                <View style={styles.content}>
                  <Text style={{color: 'rgb(158, 158, 158)', fontSize: 12}}>Selected 3 of 30</Text>
                  {/* ----- BPCs LIST AREA ---- */}
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.bpcs_box}
                    data={producers.list}
                    extraData={selected_bpcs}
                    renderItem={({item}) => (
                      <TouchableOpacity key={item.account} onPress={this._onPressBpcsItem.bind(this, item)}>
                        <View style={styles.bpcs_item}>
                          <Icon
                            style={styles.bpcs_item_check}
                            size={24}
                            name="check"
                            color={
                              _.find(selected_bpcs, {owner: item.owner})
                              ? "rgb(46, 204, 113)"
                              : "#e7e7e7"
                            }/>
                          <Text style={{color: '#555', fontWeight: '800'}}>
                            {item.owner}
                          </Text>
                          <Text style={{color: '#bbb'}}>
                            {this._cleanUrl(item.url)}
                          </Text>
                          <View style={styles.scaled_vote_box}>
                            <Text style={{color: '#aaa', fontSize: 11}}>
                              {item.percent ? (item.percent * 100).toFixed(2) + '%' : '-'}
                            </Text>
                          </View>
                          <TouchableHighlight
                            underlayColor="#eee"
                            style={styles.bpcs_item_link_box}
                            onPress={this._onPressLink.bind(this, item.url)}>
                            <IonIcon name="md-link" size={24} color="rgb(190, 190, 190)"/>
                          </TouchableHighlight>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
              <View style={styles.bottom}>
                <View style={styles.bottom_left}>
                  <TouchableOpacity style={styles.settings_box} onPress={this._onPressSettings.bind(this)}>
                    <IonIcon size={25} name="ios-settings" color="rgb(190, 190, 190))"/>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this._onPressVote.bind(this)}>
                  <View style={styles.bottom_right}>
                    <Text style={[styles.major_button, styles.text_right]}>
                      VOTE
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {this._renderIndicator()}
            </View>
          )}
        </OnLayout>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    settings: state.settings,
    producers: state.producers,
    globals: state.globals
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...SettingsActions,
      ...ProducersActions,
      ...GlobalsActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteView)

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
    height: 44,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'orange' : undefined,
    flexDirection: 'row',
    marginBottom: 10
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
    marginRight: 20,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'orange' : undefined,
  },
  header: {
    height: 84,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'grey' : undefined
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  bpcs_box: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10
  },
  bpcs_item: {
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    height: 48,
    justifyContent: 'center',
    marginBottom: 1,
    paddingLeft: 54
  },
  bpcs_item_check: {
    position: 'absolute',
    left: 15
  },
  scaled_vote_box: {
    right: 48,
    height: 48,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bpcs_item_link_box: {
    position: 'absolute',
    right: 0,
    height: 48,
    width: 42,
    backgroundColor: 'rgba(224, 224, 224, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottom_left: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 20,
    paddingLeft: 10,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'red' : undefined,
    // backgroundColor: 'blue'
  },
  settings_box: {
    paddingTop: 15,
    paddingRight: 10
  },
  bottom_right: {
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 20,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'blue' : undefined,
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
    paddingHorizontal: 10,
    paddingTop: 4,
    paddingBottom: 3,
    fontSize: 18,
    fontFamily: 'Kohinoor Bangla',
    fontWeight: '800',
    color: '#fff',
    backgroundColor: 'rgb(52, 152, 219)',
    borderRadius: 10,
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
