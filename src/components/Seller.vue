<!--
  商家销量统计的横向柱状图
-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 总页数
      timerId: null // 定时器的标识
    }
  },
  created () {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  // 在vue生命周期中代表dom结构加载完成
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 在界面完全加载的时候主动进行适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.timerId)
    // 在组件销毁时，需要将监听器取消
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  },
  methods: {
    // 初始化echartsInstance对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'dark')
      // 对图表初始化的控制
      const initOption = {
        title: {
          text: '▶ 商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离包含坐标的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2d3443'
            }
          }
        },
        series: {
          type: 'bar',
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: 'white'
            }
          },
          itemStyle: {
            // 指明颜色渐变的方向
            // 指明不同百分比下颜色的值
            color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
              // 百分之0状态下的颜色值
              {
                offset: 0,
                color: '#5052EE'
              },
              // 百分之100状态下的颜色值
              {
                offset: 1,
                color: '#AB6EE5'
              }
            ])
          }
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    getData (ret) {
      // http://127.0.0.1:8888/api  使用axios得到的数据是promise对象
      // const { data: ret } = await this.$http.get('seller')
      this.allData = ret
      // 对数据进行排序
      this.allData.sort((a, b) => {
        return a.value - b.value // 数据从小到大排序
      })
      // 每5个元素显示1页
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length + 1
      this.updateChart()
      // 启动定时器
      this.startInterval()
    },
    // 更新图表l
    updateChart () {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start, end)
      const sellerNames = showData.map(item => {
        return item.name
      })
      const sellervalue = showData.map(item => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: {
          data: sellervalue
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 当浏览器的大小发生变化的时候，会调用的方法，完成屏幕的适配
    screenAdapter () {
      // console.log(this.$refs.seller_ref.offsetWidth)
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 和分辨率大小有关的配置项
      const adaptOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: {
          barWidth: titleFontSize,
          itemStyle: {
            barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
          }
        }
      }
      this.chartInstance.setOption(adaptOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
