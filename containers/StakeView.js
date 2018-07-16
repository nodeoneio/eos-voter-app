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
import { SafeAreaView } from 'react-navigation'
import OnLayout from 'react-native-on-layout'
import Icon from 'react-native-vector-icons/Feather'
import * as consts from '../common/constants'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// process.env.NODE_ENV = 'development'

const __actions = ['Stake', 'Unstake']

export default class StakeView extends React.Component {

  static navigationOptions = {
    header: null,
  }

  state = {
    net: 0,
    cpu: 0,
    isVisible: false,
    action: __actions[0]
  }

  constructor(props) {
    super(props)

  }

  _onPressClose() {
    // this.props.navigation.navigate('Main')
    // this.props.navigation.goBack()
    this.props.navigation.navigate('Main')
  }

  _onPressSubmit() {

  }

  render() {
    const { net, cpu } = this.state
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
                    <Text style={[styles.bold, {color:'#333'}]}>robinsonpark</Text>
                  </View>
                  <View style={styles.content}>
                    <View style={styles.balance}>
                      <Text style={{
                        color:'#bbb',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                        fontSize: 14
                      }}>Total</Text>
                      <Text style={[styles.bold, {
                        color: '#888',
                        fontFamily: 'Kohinoor Bangla',
                        fontSize: 18
                      }]}><Text style={styles.emp}>1,234</Text> EOS</Text>
                      <Text style={{
                        color:'#bbb',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                        fontSize: 14,
                        marginTop: 20
                      }}>Staked</Text>
                      <Text style={[styles.bold, {
                        color: '#888',
                        fontFamily: 'Kohinoor Bangla',
                        fontSize: 18
                      }]}>net <Text style={styles.emp}>10</Text> EOS / cpu <Text style={styles.emp}>10</Text> EOS</Text>
                      <Text style={{
                        color:'#bbb',
                        fontWeight: 'bold',
                        textDecorationLine: 'underline',
                        fontSize: 14,
                        marginTop: 20
                      }}>Available to stake</Text>
                      <Text style={[styles.bold, {
                        color: '#888',
                        fontFamily: 'Kohinoor Bangla',
                        fontSize: 18
                      }]}><Text style={styles.emp}>1,224</Text> EOS</Text>
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
                    <Text style={styles.submit_text}>SUBMIT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAwareScrollView>
          )}
        </OnLayout>
      </SafeAreaView>
    )
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
    backgroundColor: process.env.NODE_ENV == 'development' ? 'orange' : undefined,
  },
  header: {
    height: 84,
    backgroundColor: process.env.NODE_ENV == 'development' ? 'grey' : undefined,
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
