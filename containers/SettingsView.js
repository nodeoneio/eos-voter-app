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
import Icon from 'react-native-vector-icons/Feather'
import * as consts from '../common/constants'

// process.env.NODE_ENV = 'development'


export default class SettingsView extends React.Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)

  }

  _onPressMenu(item) {
    if (item === 'change_network') {
      this.props.navigation.navigate('SelectNetwork', {
        network: 'mainnet.eoscanada.com',
        completion_type: consts.COMPLETION_TYPE_DONE
      })
    } else if (item === 'set_password') {
      this.props.navigation.navigate('SetPassword', {
        completion_type: consts.COMPLETION_TYPE_DONE
      })
    } else if (item === 'change_password') {
      this.props.navigation.navigate('ChangePassword', {
        completion_type: consts.COMPLETION_TYPE_DONE
      })
    } else if (item === 'unlock_wallet') {
      this.props.navigation.navigate('UnlockWallet', {
        completion_type: consts.COMPLETION_TYPE_DONE
      })
    }
  }

  _onPressClose() {
    this.props.navigation.navigate('Main')
  }

  render() {
    return(
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <View style={styles.container}>
          <View style={styles.top}>
            <View style={styles.top_left}>
              <Text style={{fontFamily: 'Kohinoor Bangla'}}>EOS <Text style={styles.bold}>VOTER</Text> APP v1.0.0</Text>
            </View>
            <View style={styles.top_right}>
              <TouchableOpacity style={{paddingLeft: 15, paddingTop: 5, paddingBottom: 5}} onPress={this._onPressClose.bind(this)}>
                <Icon name="x" size={20}/>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.content}>
              <View style={styles.menues}>
                <TouchableOpacity onPress={this._onPressMenu.bind(this, 'change_network')}>
                  <Text style={styles.menu_item}>CHANGE NETWORK 〉</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressMenu.bind(this, 'set_password')}>
                  <Text style={styles.menu_item}>SET PASSWORD 〉</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressMenu.bind(this, 'change_password')}>
                  <Text style={styles.menu_item}>CHANGE PASSWORD 〉</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressMenu.bind(this, 'lock_wallet')}>
                  <Text style={styles.menu_item}>LOCK WALLET 〉</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressMenu.bind(this, 'unlock_wallet')}>
                  <Text style={styles.menu_item}>UNLOCK WALLET 〉</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.about}>
                <Text style={{color: 'rgb(127, 127, 127)', fontWeight: '800'}}>About this App</Text>
                <Text style={{color: 'rgb(158, 158, 158)', marginTop: 10}}>EOS NodeOne has made this app. blah blah blah... 동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라만세 무궁화 삼천리 화려 강산 대한 사람 대한으로 길이 보전하세...</Text>
              </View>
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.bottom_box}>
              <Image style={{width:42, height:42, marginRight: 20}} source={require('../images/eos_spinning_logo_tiny.gif')}/>
              <View style={styles.split}></View>
              <Image resizeMode="contain" style={{height:28, maxWidth: 100, marginLeft: 14}} source={require('../images/nodeone_logo_h.png')}/>
            </View>
          </View>
        </View>
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
    backgroundColor:'white',
    flexDirection: 'row'
  },
  body: {
    flex: 1,
    backgroundColor:undefined,
  },
  bottom: {
    height: 80,
    padding: 20
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
    backgroundColor:undefined,
  },
  header: {
    height: 84,
    backgroundColor:undefined
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menues: {
    marginTop: 20,
    minHeight: 200,
    width: '100%',
    justifyContent: 'center',
    backgroundColor:undefined,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  menu_item: {
    fontSize: 24,
    marginBottom: 28,
    color: 'rgb(94, 94, 94)',
    fontFamily: 'Kohinoor Bangla',
    backgroundColor:undefined
  },
  about: {
    flex: 1,
    padding: 5,
    marginTop: 10
  },
  bottom_box: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  split: {
    width: 1,
    height: 24,
    backgroundColor: '#eee'
  },

  /* Common */
  bold: {
    fontWeight: '800'
  }
});
