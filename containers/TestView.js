
import React from 'react'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import OnLayout from 'react-native-on-layout'
import Icon from 'react-native-vector-icons/Feather'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default class TestView extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    return(
      <SafeAreaView style={{flex: 1}}>
        <OnLayout style={{flex: 1}}>
          {({ width, height}) => (
            <KeyboardAwareScrollView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <Icon name="x"/>
              <TouchableOpacity onPress={()=>{}}>
                <Text>Hello World</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
          )}
        </OnLayout>
      </SafeAreaView>
    )
  }
}
