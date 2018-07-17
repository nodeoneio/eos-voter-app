import React from 'react'
import { View, TouchableOpacity, Text, WebView } from 'react-native'
import PropTypes from 'prop-types'
import { SafeAreaView } from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather'

export default class EVWebView extends React.Component {

  state = {
    url: this.props.navigation.getParam('url', '')
  }

  constructor(props) {
    super(props)

  }

  _onPressClose() {
    this.props.navigation.navigate('Main')
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}} forceInset={{top: 'always'}}>
        <View style={{height: 50, flexDirection: 'row'}}>
          <View style={{flex: 1, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <TouchableOpacity style={{width: 44, marginRight: 20,marginLeft: 20}}
              onPress={() => this._webView.goBack()}>
              <Icon name="chevron-left" size={20}/>
            </TouchableOpacity>
            <TouchableOpacity style={{width: 44, marginRight: 20, marginLeft: 20}}
              onPress={() => this._webView.goForward()}>
              <Icon name="chevron-right" size={20}/>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, height: 50, alignItems: 'flex-end', justifyContent: 'center'}}>
            <TouchableOpacity style={{marginRight: 20}} onPress={this._onPressClose.bind(this)}>
              <Icon name="x" size={20}/>
            </TouchableOpacity>
          </View>
        </View>
        <WebView
          style={{flex: 1}}
          ref={(el) => { return this._webView = el}}
          url={this.state.url}/>
      </SafeAreaView>
    )
  }
}

EVWebView.propTypes = {
  url: PropTypes.string
}
