export default class SocketService {
  /**
   * 单例
  */
  static instance = null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务端连接的socket对象
  ws = null

  // 存储回调函数  // 回调函数用来将从服务端获取的数据传递给各个组件实现更新
  callBackMapping = {}

  // 标志连接状态
  isConnected = false
  // 记录重试的次数
  sendRetryCount = 0
  // 重新连接尝试的次数
  connectRetryCount = 0

  // 定义连接服务器的方法
  connect () {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')

    // 连接成功的事件
    this.ws.onopen = () => {
      console.log('连接服务端成功！')
      this.isConnected = true
      this.connectRetryCount = 0
    }
    // 1.连接服务端失败
    // 2.当连接成功之后，服务器关闭的情况
    this.ws.onclose = () => {
      console.log('连接服务端失败...')
      this.isConnected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
    }
    // 得到服务端发送过来的数据
    this.ws.onmessage = msg => {
      console.log('从服务端获取到了数据...')
      // 真正服务端发送过来的原始数据是在msg.data字段
      // console.log(msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {

        } else if (action === 'themeChange') {

        }
      }
    }
  }

  // 回调函数的注册
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  // 取消某个回调
  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法
  send (data) {
    if (this.isConnected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++ // 重试的次数越多，延时越长
      setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryCount)
    }
  }
}
