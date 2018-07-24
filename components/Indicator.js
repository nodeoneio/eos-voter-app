import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Feather'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'

var {height, width} = Dimensions.get('window');

export const ICON_LOADING = "icon_loading"
export const ICON_VALID = "icon_valid"
export const ICON_INVALID = "icon_invalid"


export default class Indicator extends React.Component {

  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    onHide: PropTypes.func
  }

  state = {
    show: this.props.show,
    toast: this.props.toast,
    content: {
      icon: this.props.icon,
      title: this.props.title,
      desc: this.props.desc,
    },
    fade: new Animated.Value(0)
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {
      toast,
      show
    } = this.state
    if (toast === true) {
      this.toast()
    } else if (show === true) {
      this.show()
    }
    console.log('Indicator componentDidMount', toast)
  }

  componentWillReceiveProps(nextProps) {

    let content = {
      icon: nextProps.icon,
      title: nextProps.title,
      desc: nextProps.desc
    }

    this.setState({content})

    if (nextProps.hasOwnProperty('show')
        || nextProps.hasOwnProperty('toast')) {
      if (nextProps.toast === true) {
        this.toast()
      } else if (nextProps.show === true) {
        this.show()
      } else if (nextProps.show === false) {
        this.hide()
      }
    }
  }

  show(delay, callback) {
    this._showIndicator(delay, callback)
  }

  hide(delay, callback) {
    this._hideIndicator(delay, callback)
  }

  toast(delay, timeout = 2, callback) {
    this._showIndicator(delay, callback)

    this._hideIndicator(timeout * 1000, callback)
  }

  _showIndicator(delay = 0, callback) {
    this.setState({show: true})

    Animated.sequence([
      Animated.delay(delay), // Option
      Animated.parallel([
        Animated.timing(
          this.state.fade,
          {
            toValue: 1,
            duration: 200,
          }
        )
      ])
    ]).start(callback)
  }

  _hideIndicator(delay = 0, callback) {
    Animated.sequence([
      Animated.delay(delay), // Option
      Animated.parallel([
        Animated.timing(
          this.state.fade,
          {
            toValue: 0,
            duration: 200,
          }
        )
      ])
    ]).start(()=>{
      this.setState({show: false})
      if (callback)
        callback()

      if (this.props.onHide)
        this.props.onHide()
    })
  }

  render() {
    const { content, show, fade } = this.state

    return (
      <Animated.View style={[styles.indicator_overlay, {width: width, height: height, opacity: fade}]}>
        <View style={styles.indicator_box}>
          { content.icon == ICON_LOADING
            ? <ActivityIndicator style={styles.indicator} size="large" />
            : content.icon == ICON_VALID
            ? <Icon size={40} name="check" color="rgb(46, 204, 113)"/>
            : <Icon size={40} name="x" color="rgb(231, 76, 60)"/>}
          <Text style={styles.indicator_desc}>{content.desc}</Text>
          <Text style={styles.indicator_text}>{content.title}</Text>
        </View>
      </Animated.View>
    )
  }
}


const styles = StyleSheet.create({
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
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    width: 250,
    minHeight: 250,
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
    textAlign: 'center',
    marginTop: 15,
    fontWeight: "800",
    color: '#ddd'
  },
  indicator_desc: {
    marginTop: 35,
    padding: 20,
    fontWeight: "400",
    color: '#ddd',
    fontSize: 12,
    textAlign: 'center'
  },

})
