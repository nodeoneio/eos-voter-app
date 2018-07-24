import React from 'react'
import _ from 'lodash'
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
import { SafeAreaView } from 'react-navigation'
import OnLayout from 'react-native-on-layout'
import Icon from 'react-native-vector-icons/Feather'
import * as consts from '../common/constants'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as AccountActions from '../actions/accounts'
import * as SettingsActions from '../actions/settings'
import Indicator, * as IndicatorIcon from '../components/Indicator'
import Confirm from '../components/Confirm'

import * as StakeActions from '../actions/stake'

const __actions = ['Stake', 'Unstake']

class StakeView extends React.Component {

  static navigationOptions = {
    header: null,
  }

  state = {
    net: '',
    cpu: '',
    EOSbalance: (this.props.balance && this.props.balance.EOS) ? this.props.balance.EOS : 0,
    isVisible: false,
    action: __actions[0],
    show_indicator: false,
    indicator: {
      icon: undefined,
      title: undefined,
      desc: undefined,
      toast: false
    },
    submitting: false
  }

  constructor(props) {
    super(props)

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps, 'StakeView nextProps')

    const {
      system
    } = nextProps

    if (system.STAKE === 'SUCCESS') {
      this._showCompleteIndicator()
      console.log('_showCompleteIndicator')
      this.setState({submitting: false})
    } else if (system.STAKE === 'FAILURE') {
      this._showSubmitFailIndicator()
      console.log('_showSubmitFailIndicator')
      this.setState({submitting: false})
    } else if (system.STAKE === 'PENDING') {

      // console.log('_showLoadingIndicator')
    }
  }

  _showLoadingIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_LOADING,
      title: 'Submitting',
      desc: 'via Mainnet',
      toast: false
    }
    this.setState({indicator, show_indicator: true})

    console.log('_showLoadingIndicator')
  }

  _showSubmitFailIndicator() {
    const indicator = {
      icon: IndicatorIcon.ICON_INVALID,
      title: 'Failed',
      desc: 'Something went wrong. Try agian',
      toast: true
    }
    this.setState({indicator, show_indicator: true})
    console.log('_showSubmitFailIndicator')
  }

  _showCompleteIndicator() {
    const {
      net,
      cpu,
      action
    } = this.state
    const indicator = {
      icon: IndicatorIcon.ICON_VALID,
      title: 'Success!',
      desc: `${action}d\n net ${net}\n cpu ${cpu} \n`,
      toast: true
    }
    this.setState({indicator, show_indicator: true})
  }

  _validate() {
    const {
      net,
      cpu,
      EOSbalance,
      action
    } = this.state
    const {
      settings,
      accounts
    } = this.props
    const account = accounts[settings.account]
    var availAmt = _.get(account, 'core_liquid_balance') || '0 EOS'
    availAmt = parseFloat(availAmt.substring(availAmt.length - 4, -4))
    var staked_net = _.get(account, 'self_delegated_bandwidth.net_weight') || '0 EOS'
    staked_net = parseFloat(staked_net.substring(staked_net.length - 4, -4))
    var staked_cpu = _.get(account, 'self_delegated_bandwidth.cpu_weight') || '0 EOS'
    staked_cpu = parseFloat(staked_cpu.substring(staked_cpu.length - 4, -4))

    const decimalRegex = /^\d+(\.\d{1,4})?$/;
    const staking_sum = parseFloat(net) + parseFloat(cpu)

    if (!decimalRegex.test(net) || !decimalRegex.test(cpu)) {
      const indicator = {
        icon: IndicatorIcon.ICON_INVALID,
        title: 'Invalid Format',
        desc: 'Invalid stake amount',
        toast: true
      }
      this.setState({indicator, show_indicator: true})
      return false
    }

    if (action === 'Stake' && staking_sum > availAmt) {
      const indicator = {
        icon: IndicatorIcon.ICON_INVALID,
        title: 'Invalid Amount',
        desc: `Sum of cpu and net amount cannot be over ${availAmt} EOS`,
        toast: true
      }
      this.setState({indicator, show_indicator: true})
      return false
    }

    if (action === 'Unstake' && staking_sum > staked_cpu + staked_net) {
      const indicator = {
        icon: IndicatorIcon.ICON_INVALID,
        title: 'Invalid Amount',
        desc: `Sum of cpu and net amount MUST be over ${staked_cpu + staked_net} EOS`,
        toast: true
      }
      this.setState({indicator, show_indicator: true})
      return false
    }


    return true
  }

  _onPressSubmit() {
    const {
      action,
      net,
      cpu,
      submitting
    } = this.state
    const {
      actions,
      settings
    } = this.props
    const {
      setStake,
      setUnstake
    } = actions

    if (submitting)
      return

    if (!this._validate()) {
      return
    }

    this._showLoadingIndicator()

    this.setState({submitting: true}, () => {
      if (action === 'Stake') {
        setStake(settings.account, net, cpu)
      } else {
        setUnstake(settings.account, net, cpu)
      }
    })
  }

  _onPressClose() {
    this.props.navigation.navigate('Main')
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

    if (!show_indicator) return undefined

    return (
      <Indicator
        icon={icon}
        title={title}
        desc={desc}
        toast={toast}
        show={toast ? false : true}
        onHide={() => {
          this.setState({show_indicator : false, indicator:{}})
        }}/>)
  }

  render() {
    const {
      net,
      cpu,
      action
    } = this.state
    const {
      accounts,
      settings
    } = this.props
    const account = accounts[settings.account]
    return(
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <KeyboardAwareScrollView style={{flex: 1}}>
              <View style={[styles.container, {minHeight: height}]}>
                <View style={styles.top}>
                  <View style={styles.top_left}>
                  </View>
                  <View style={styles.top_right}>
                    <TouchableOpacity style={{paddingLeft: 15, paddingTop: 5, paddingBottom: 5}} onPress={this._onPressClose.bind(this)}>
                      <Icon name="x" size={20}/>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.body}>
                  <View style={styles.header}>
                    <Icon name="user" size={16} color="#333"/>
                    <Text style={[styles.bold, {color:'#333'}]}>{settings.account}</Text>
                  </View>
                  <View style={styles.content}>
                    <View style={styles.balance}>
                      {/* <Text style={{
                        color:'#bbb',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                        fontSize: 14
                      }}>Total</Text>
                      <Text style={[styles.bold, {
                        color: '#888',
                        fontFamily: 'Kohinoor Bangla',
                        fontSize: 18
                      }]}><Text style={styles.emp}>1,234</Text> EOS</Text> */}
                      <Text style={{
                        color:'#bbb',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                        fontSize: 14,
                        marginBottom: 10
                      }}>Staked</Text>
                      <Text style={[styles.bold, {
                        color: '#888',
                        fontFamily: 'Kohinoor Bangla',
                        fontSize: 18
                      }]}>
                      NET <Text style={styles.emp}>{_.get(account, 'self_delegated_bandwidth.net_weight')}</Text> {'\n'}
                      CPU <Text style={styles.emp}>{_.get(account, 'self_delegated_bandwidth.cpu_weight')}</Text>
                      </Text>
                      <Text style={{
                        color:'#bbb',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                        fontSize: 14,
                        marginTop: 25,
                        marginBottom: 10
                      }}>Available to stake</Text>
                      <Text style={[styles.bold, {
                        color: '#888',
                        fontFamily: 'Kohinoor Bangla',
                        fontSize: 18
                      }]}><Text style={styles.emp}>{_.get(account, 'core_liquid_balance')}</Text></Text>
                    </View>
                    <View style={styles.stake}>
                      <View style={styles.select_box}>
                        <Text style={[styles.label, {marginBottom: 10}]}>ACTION : </Text>
                        <SegmentedControlTab
                          tabStyle={{minWidth: 60, borderColor: '#666', maxWidth: 100}}
                          tabTextStyle={{color: '#666'}}
                          activeTabStyle={{backgroundColor: '#666'}}
                          activeTabTextStyle={{fontWeight: 'bold'}}
                          values={__actions}
                          selectedIndex={__actions.indexOf(this.state.action)}
                          onTabPress={(index)=>{this.setState({action: __actions[index]})}}
                          />
                      </View>
                      <View style={styles.inputs}>
                        <View style={styles.input_box_wrapper}>
                          <Text style={styles.label}>NET : </Text>
                          <View style={styles.input_box}>
                            <TextInput
                              style={styles.input}
                              value={net}
                              keyboardType="decimal-pad"
                              onChangeText={(net) => this.setState({net})}
                              clearButtonMode="while-editing"
                              placeholder=""/>
                          </View>
                        </View>
                        <View style={styles.input_box_wrapper}>
                          <Text style={styles.label}>CPU : </Text>
                          <View style={styles.input_box}>
                            <TextInput
                              style={styles.input}
                              value={cpu}
                              keyboardType="decimal-pad"
                              onChangeText={(cpu) => this.setState({cpu})}
                              clearButtonMode="while-editing"
                              placeholder=""/>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.bottom}>
                  <TouchableOpacity style={styles.submit} onPress={this._onPressSubmit.bind(this)}>
                    <Text style={styles.submit_text}>{action.toUpperCase()}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          )}
        </OnLayout>
        {this._renderIndicator()}
      </SafeAreaView>
    )
  }
}



function mapStateToProps(state, props) {
  return {
    accounts: state.accounts,
    settings: state.settings,
    system: state.system,
    balance: state.balance
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...AccountActions,
      ...SettingsActions,
      ...StakeActions
    }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StakeView)

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
    height: 80,
    padding: 20,
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
    backgroundColor: undefined,
  },
  header: {
    height: 84,
    backgroundColor: undefined,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#eee'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  balance: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    width: '100%',
    borderBottomWidth: 3,
    borderBottomColor: '#eee'
  },
  stake: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  select_box: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 25
  },
  inputs: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  input_box_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  label: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold'
  },
  input_box: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#999'
  },
  input: {
    minWidth: 180,
    minHeight: 32,
    padding: 5
  },
  submit: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(52, 152, 219)'
  },
  submit_text: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    fontFamily: 'Kohinoor Bangla',
  },
  /* Common */
  bold: {
    fontWeight: '800'
  },
  emp: {
    color: '#666'
  }
});
