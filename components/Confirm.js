import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Feather'
import OnLayout from 'react-native-on-layout'
import Dimensions from 'Dimensions'

var {height, width} = Dimensions.get('window');

export default class Confirm extends React.Component {

  static propTypes = {
    icon: PropTypes.element,
    title: PropTypes.string,
    desc: PropTypes.string,
    content: PropTypes.element,
    cancelButtonText: PropTypes.string,
    confirmButtonText: PropTypes.string,
    onHide: PropTypes.func,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func
  }

  state = {
    show: this.props.show,
    toast: this.props.toast,
    icon: this.props.icon,
    title: this.props.title,
    desc: this.props.desc,
    content: this.props.content,
    cancelButtonText: this.props.cancelButtonText || 'Cancel',
    confirmButtonText: this.props.confirmButtonText || 'Confirm',
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
      desc: nextProps.desc,
      content: nextProps.content,
      cancelButtonText: nextProps.cancelButtonText,
      confirmButtonText: nextProps.confirmButtonText,
    }

    this.setState(content)

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

  _onPressConfirm() {
    this._hideIndicator(0, ()=>{
      if (this.props.onConfirm)
        this.props.onConfirm()
    })
  }

  _onPressCancel() {
    this._hideIndicator(0, ()=>{
      if (this.props.onCancel)
        this.props.onCancel()
    })
  }

  render() {
    const {
      show,
      toast,
      icon,
      title,
      desc,
      content,
      cancelButtonText,
      confirmButtonText,
      fade
    } = this.state

    return (
      <Animated.View pointerEvents="box-none" style={[styles.overlay, {width: width, height: height, opacity: fade}]}>
        <View style={styles.box}>
          {icon}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{desc}</Text>
          {content
          ? <ScrollView
             contentContainerStyle={{

             }}
             style={styles.content}>
             {content}
            </ScrollView>
          : undefined }
          <View style={styles.buttons}>
            <TouchableOpacity onPress={this._onPressCancel.bind(this)} style={styles.left}>
              <Text style={styles.left_text}>{cancelButtonText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onPressConfirm.bind(this)} style={styles.right}>
              <Text style={styles.right_text}>{confirmButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    )
  }
}


const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(255,255,255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 50,
    width: 250,
    minHeight: 350,
    maxHeight: 430,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
  },
  title: {
    textAlign: 'center',
    marginTop: 15,
    fontWeight: "800",
    color: '#ddd',
    minHeight: 20
  },
  desc: {
    padding: 10,
    fontWeight: "400",
    color: '#ddd',
    fontSize: 11,
    textAlign: 'center',
    minHeight: 25,
  },
  content: {
    flex: 1,
    width: '100%',
    maxHeight: 200,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  buttons: {
    flexDirection: 'row',
    minHeight: 48
  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  left_text: {
    color: 'red',
    opacity: .7
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right_text: {
    color: '#fff',
    fontWeight: '600'
  }
})
