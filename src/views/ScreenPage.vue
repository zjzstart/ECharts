<template>
  <div class="screen-container">
    <!-- <header class="screen-header">
      <div>
        <img src="" alt="">
      </div>
      <span class="logo">
        <img src="" alt="">
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img src="" alt="">
        <span class="datetime">2020-01-01 00:00:00</span>
      </div>
    </header> -->
    <div class="screen-head"></div>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <span class="iconfont"  @click="changeSize('trend')">&#xe651;</span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <span class="iconfont" @click="changeSize('seller')">&#xe651;</span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div class="resize">
            <span class="iconfont" @click="changeSize('map')">&#xe651;</span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <span class="iconfont"  @click="changeSize('rank')">&#xe651;</span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <span class="iconfont" @click="changeSize('hot')">&#xe651;</span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <span class="iconfont" @click="changeSize('stock')">&#xe651;</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
export default {
  data () {
    return {
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        hot: false,
        rank: false,
        stock: false
      }
    }
  },
  methods: {
    changeSize (chartName) {
      // 1、改变fullScreenStatus的数据
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2、需要调用一个图表组件的screenAdapter的方法
      // 数据的变化无法让界面立即更新 需要延迟
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  }
}
</script>

<style lang="less" scoped>
.screen-head {
  background-color: #161522;
  height: 40px;
  width: 100%;
}

// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 300;
}
.screen-container{
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header{
  width: 100%;
  height: 100%;
  font-size: 20px;
  position: relative;
  > div{
      img {
        width: 100%;
      }
    }
  .title{
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0%;
    top: 50%;
    transform: translateY(-80%);
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  // margin-top: 40px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
