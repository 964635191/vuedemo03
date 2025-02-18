<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></span>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送費{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass" @click.stop.prevent="pay">
          {{payDesc}}
        </div>
      </div>

    </div>
    <div class="ball-container" >
      <transition-group  name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"   >
        <div class="ball"  v-for="(ball,index) in balls" :key="'myname'+index" v-show="ball.show">
          <span class="inner inner-hook"></span>
        </div>
      </transition-group>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">購物車</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="mask-fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
  import { eventBus } from '../../components/event-bus';
  import cartcontrol from  '@/components/cartcontrol/cartcontrol';
  import BScroll from 'better-scroll'
  export default {
    name: "shopcart",
    props:{
      selectFoods:{
        type:Array,
        default(){
          return [];
        }
      },
      deliveryPrice:{
        type:Number,
        default:0
      },
      minPrice:{
        type:Number,
        default:0
      }
    },
    data(){
      return{
        balls:[
          {show:false },
          {show:false },
          {show:false},
          {show:false},
          {show:false}
        ],
        dropBalls: [],
        fold: true
      }
    },
    created () {
      // 优化体验，异步监听小球平抛动画
      this.$nextTick(() => {
        eventBus.$on('addcart', this.drop)
      })
    },
    computed:{
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount(){
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count
      },
      payDesc(){
        if (this.totalPrice===0){
          return `￥${this.minPrice}元起送`;
        }else if(this.totalPrice<this.minPrice){
            let diff=this.minPrice-this.totalPrice
          return `还差￥${diff}元起送`;
        }else{
          return '去結算';
        }
      },
      payClass(){
        if (this.totalPrice<this.minPrice) {
          return 'not-enough';
        }else {
          return 'enough';
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          // 手动刷新better-scroll重新计算页面高度
          if (!this.listContentScroll) {
            this.listContentScroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.$nextTick(() => {
              this.listContentScroll.refresh()
            })
          }
        }
        return show
      }

    },
    methods: {

      drop (ele) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true // 表示可以有下落动画
            ball.el = ele
            this.dropBalls.push(ball)
            return // 跳出循环
          }
        }
      },
      beforeEnter: function (ele) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            ele.style.display = ''
            ele.style.webkitTransform = `translate3d(0, ${y}px, 0)`
            ele.style.transform = `translate3d(0, ${y}px, 0)`
            let inner = ele.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px, 0, 0)`
          }
        }
      },
      enter: function (ele) {
        /* eslint-disable */
        ele.offsetHeight
        this.$nextTick(() => {
          ele.style.webkitTransform = 'translate3d(0, 0, 0)'
          ele.style.transform = 'translate3d(0, 0, 0)'
          let inner = ele.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
        })
      },
      afterEnter: function (ele) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          ele.style.display = 'none'
        }
      },
      toggleList(){
         if (!this.totalCount){
           return;
         }
         this.fold=!this.fold;
      },
      hideList () {
        this.fold = true
      },
      empty () {
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`需要支付${this.totalPrice}元`)
      }
    },
    components:{
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .shopcart
    position: fixed
    left: 0
    right: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    background: #000

    .content
      background: #141d27
      display: flex
      color: rgba(255,255,255,0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            vertical-align: top
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              line-height: 44px
              font-size 24px
              color: #80858
              &.highlight
               color: #fff
          .num
            position: absolute
            top:0
            right:0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240,20,20)
            box-shadow: 0px 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin-top: 12px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255,255,255,0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin: 12px 0 0 12px
          color: rgba(255,255,255,0.4)
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-enter, &.drop-enter-active
          transition all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          display: inline-block
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all .4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      width: 100%
      z-index -1
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,.1)
        .title
          font-size: 14px
          float: left
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-content
        padding: 0 18px
        max-height: 217px
        background: #fff
        overflow: hidden
        .food
         position: relative
         padding: 12px 0
         box-sizing: border-box
         border-1px(rgba(7,17,27,.1))
         &:last-child:after
          border-top: 0
        .name
         line-height: 24px
         font-size: 14px
         color: rgb(7,17,27)
        .price
         position: absolute
         right: 90px
         bottom: 12px
         line-height: 24px
         font-size: 14px
         font-weight: 700
         color: rgb(240,20,20)
        .cartcontrol-wrapper
         position: absolute
         right: 0
         bottom: 6px


    .list-mask
      position: fixed
      top: 0
      left: 0
      right: 0
      margin: 0 auto
      width: 100%
      height: 100%
      background: rgba(7,17,27,.6)
      backdrop-filter: blur(10px)
      z-index: -2;
      opacity: 1
      &.mask-fade-enter-active, &.mask-fade-leave-active
        transition: all 0.3s
      &.mask-fade-enter, &.mask-fade-leave-to
        opacity: 0
</style>
