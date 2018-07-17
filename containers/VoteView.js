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
import Confirm from '../components/Confirm'
import * as consts from '../common/constants'
import * as AccountActions from '../actions/accounts'
import * as SettingsActions from '../actions/settings'
import * as ProducersActions from '../actions/producers'
import * as GlobalsActions from '../actions/globals'
import * as VoteproducerActions from '../actions/system/voteproducers'


process.env.NODE_ENV = 'production'

const ICON_LOADING = "icon_loading"
const ICON_VALID = "icon_valid"
const ICON_INVALID = "icon_invalid"

const MAX_SELECT = 30

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class VoteView extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    old_selected: [],
    selected_bpcs: [],
    changed: false,
    bpcs: [],
    custom_url: null,
    show_indicator: false,
    indicator: {},
    producers: {},
    system: {},
    submitting: false,
    lastError: false,
    lastTransaction: {}
  }

  _interval = null

  constructor(props) {
    super(props)

  }

  componentDidMount() {
    const {
      actions,
      settings
    } = this.props

    // setTimeout(()=>{
    //
    //   this._loadData()
    // }, 1500)

    this._interval = setInterval(() => {
      this._loadData()
    }, 5000)
  }

  componentWillReceiveProps(newProps) {
    const {
      selected_bpcs,
      changed
    } = this.state
    const {
      producers,
      system
    } = newProps
    if (producers && producers.list && producers.list.length > 0) {
      this.setState({
        producers,
        old_selected: producers.selected,
        ...(!changed ? {selected_bpcs: producers.selected} : undefined)
      })
    }
    console.log(producers, 'producers')

    if (
      this.state.submitting
      && (
        this.state.lastTransaction !== system.VOTEPRODUCER_LAST_TRANSACTION
        || this.state.lastError !== system.VOTEPRODUCER_LAST_ERROR
      )
    ) {
      this.setState({
        lastError: system.VOTEPRODUCER_LAST_ERROR,
        lastTransaction: system.VOTEPRODUCER_LAST_TRANSACTION,
        submitting: false
      });

      const last = system.VOTEPRODUCER_LAST_TRANSACTION
      if (last && last.transaction_id) {
        this._showCompleteIndicator()
      } else {
        this._showSubmitFailIndicator()
      }
    }
  }

  componentWillUnmount() {
    if (this._interval)
      clearInterval(this._interval)
  }

  _isSelectChanged(a = [], b = []) {
    const eq = _.isEqual(a.sort(), b.sort())
    return !eq
  }

  _loadData() {
    const {
      actions,
      settings
    } = this.props
    const {
      getProducers,
      getGlobals,
      getAccount
    } = actions
    getAccount(settings.account)
    getGlobals()
    getProducers()
  }

  _submit() {
    const {
      actions
    } = this.props
    const {
      selected_bpcs
    } = this.state

    console.log(selected_bpcs, 'selected_bpcs submit')

    actions.voteproducers(selected_bpcs)
  }

  _onPressBpcsItem(bpc) {
    const {
      old_selected
    } = this.state
    var selected_bpcs = this.state.selected_bpcs

    // const idx = selected_bpcs.indexOf(bpc)
    const idx = selected_bpcs.indexOf(bpc.owner)
    selected_bpcs = Object.assign([], selected_bpcs)
    if (idx > -1) {
      // Remove selection
      selected_bpcs.splice(idx, 1)
    } else {
      // Check max selection
      if (selected_bpcs.length >= MAX_SELECT) {
        const indicator = {
          icon: IndicatorIcon.ICON_INVALID,
          title: 'Exceeds limits',
          desc: 'The maximum number of BPs that can be selected is 30',
          toast: true
        }
        this.setState({
          indicator,
          show_indicator: true
        })
        return
      }
      // Add selection
      selected_bpcs.push(bpc.owner)
    }

    //
    console.log(old_selected)
    console.log(selected_bpcs)
    console.log(this._isSelectChanged(old_selected, selected_bpcs), 'changed')

    this.setState({
      selected_bpcs,
      changed: this._isSelectChanged(old_selected, selected_bpcs)
    })
    console.log(selected_bpcs, "selected_bpcs")
  }

  _onPressVote() {
    this.setState({
      show_confirm: true
    })
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

  _showSubmittingIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_LOADING,
      title: 'Trasmitting Vote',
      desc: 'via Mainnet',
      toast: false
    }

    this.setState({
      indicator,
      show_indicator: true
    })
  }

  _showCompleteIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_VALID,
      title: 'Success!',
      desc: 'Trasmitting Vote',
      toast: true
    }

    this.setState({
      indicator,
      show_indicator: true
    })
  }

  _showSubmitFailIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_INVALID,
      title: 'Failed submitting!',
      desc: 'Error occured',
      toast: true
    }

    this.setState({
      indicator,
      show_indicator: true
    })
  }

  _renderConfirm() {
    const {
      show_confirm,
      selected_bpcs
    } = this.state

    if (!show_confirm) return undefined

    return (
      <Confirm
        show={true}
        title="Confirm Selection"
        desc={`You are voting for ${selected_bpcs.length} ${selected_bpcs.length > 1 ? 'BPCs' : 'BPC' }`}
        content={
          <View style={{flex: 1, paddingTop: 10}}>
            {selected_bpcs.map((item, index) =>
              <Text key={`selected-confrim-${item}`} style={{minHeight: 25, fontSize: 15, textAlign: 'center', color: '#eee'}}>
                {item}
              </Text>
            )}
          </View>
        }
        cancelButtonText="Cancel"
        confirmButtonText="SUBMIT"
        onHide={()=>{
          this.setState({show_confirm: false})
        }}
        onConfirm={()=>{

          this._submit()

          this.setState({
            show_confirm: false,
            submitting: true,
          })

          this._showSubmittingIndicator()

          // setTimeout(()=>{
          //   this._showSubmitFailIndicator()
          // }, 3000)
        }}
        onCancel={()=>{
          this.setState({show_confirm: false})
        }}
       />
    )
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
        }}/>)
  }

  _cleanUrl(url) {
    if (url)
      return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0]

    return ''
  }

  render() {
    const { selected_bpcs, bpcs, custom_url, producers } = this.state
    const {
      accounts,
      settings
    } = this.props
    const account = accounts[settings.account] || {}

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
                    <Text style={{color: 'orange', fontSize: 10, fontWeight: '600'}}>
                      Staked <Text style={styles.bold}>{numberWithCommas(_.get(account, 'voter_info.staked') / 10000)}</Text> EOS - <Text style={{textDecorationLine: 'underline'}}>Change</Text>
                    </Text>
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
                  <Text style={{color: 'rgb(158, 158, 158)', fontSize: 12}}><Icon name="check" size={10}/> Selected {selected_bpcs.length} of {MAX_SELECT}</Text>
                  {/* ----- BPCs LIST AREA ---- */}
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={styles.bpcs_box}
                    data={producers.list}
                    extraData={selected_bpcs}
                    keyExtractor={(item, index) => item.owner}
                    renderItem={({item, index}) => (
                      <TouchableOpacity key={item.owner} onPress={this._onPressBpcsItem.bind(this, item)}>
                        <View style={styles.bpcs_item}>
                          <Text style={styles.bpcs_item_rank }>
                            {index + 1}
                          </Text>
                          <Icon
                            style={styles.bpcs_item_check}
                            size={24}
                            name="check"
                            color={
                              selected_bpcs.indexOf(item.owner) > -1
                              ? "rgb(46, 204, 113)"
                              : "#e7e7e7"
                            }/>
                          <Text style={{color: '#555', fontWeight: '800'}}>
                            {item.owner} {index < 21 ? <Icon name="award" size={10}/> : undefined}
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
            </View>
          )}
        </OnLayout>
        {this._renderIndicator()}
        {this._renderConfirm()}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    accounts: state.accounts,
    settings: state.settings,
    producers: state.producers,
    globals: state.globals,
    system: state.system
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...SettingsActions,
      ...ProducersActions,
      ...GlobalsActions,
      ...VoteproducerActions
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
    paddingLeft: 54,
    marginLeft: 16
  },
  bpcs_item_rank: {
    position: 'absolute',
    fontSize: 8,
    left: -16,
    backgroundColor: '#ccc',
    borderColor: '#eee',
    color: '#eee',
    minWidth: 16,
    textAlign: 'center',
    height: 48,
    paddingTop: 18
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
