<template>
    <transition name="move">
      <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
          <div class="image-header">
            <img :src="food.image" alt="">
            <div class="back" @click="hide">
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}份</span>
              <span class="rating">好評率{{food.rating}}$</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price}}</span>
              <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
            <transition name="fade">
              <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count === 0">加入購物車</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <div class="title">商品信息</div>
            <div class="text">{{food.info}}</div>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @selecttype="selecttype" @content="content"></ratingselect>
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                  </div>
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                  </p>
                </li>

              </ul>
              <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>

<script>
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/date'
  import cartcontrol from '../../components/cartcontrol/cartcontrol.vue';
  import { eventBus } from '../../components/event-bus';
  import  ratingselect from '../../components/ratingselect/ratingselect'
  import split from '../../components/split/split';

  const ALL = 2;
    export default {
        name: "food",
      props:{
          food:{
            type:Object
          }
      },
      data(){
          return{
            showFlag: false,
            selectType:ALL,
            onlyContent:true,
            desc:{
              all:'全部',
              positive: '推荐',
              negative: '吐槽'
            }
        }
      },
      methods:{
        show () {
          this.showFlag = true;
          this.$nextTick(() => {
            if (!this.foodScroll) {
              this.foodScroll = new BScroll(this.$refs.food, {
                click: true
              })
            } else {
              this.foodScroll.refresh()
            }
          })
        },
        hide(){
          this.showFlag = false;
        },
        addFirst(event){
          if (!event._constructed){
            return;
          }
          this.$nextTick(() => {
            eventBus.$emit('addcart', event.target)
          })
          Vue.set(this.food,'count',1)
        },
        selecttype (type) {
          this.selectType = type
          // 手动刷新better-scroll重新计算页面高度
          this.$nextTick(() => {
            this.foodScroll.refresh()
          })
        },
        content () {
          this.onlyContent = !this.onlyContent
          // 手动刷新better-scroll重新计算页面高度
          this.$nextTick(() => {
            this.foodScroll.refresh()
          })
        },
        needShow(type,text){
          if (this.onlyContent && !text){
            return false;
          }
          if (this.selectType === ALL){
            return true;
          }else {
            return type === this.selectType;
          }
        }
      },
      filters: {
        formatDate (time) {
          let date = new Date(time)
          return formatDate(date, 'yyyy-MM-dd hh:mm')
        }
      },
      components:{
        cartcontrol,
        ratingselect,
        split,

      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position fixed
    top:0
    left 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.move-enter-active
      animation: bounce-in .3s
    &.move-leave-active
      animation: bounce-in .3s reverse
    @keyframes bounce-in
      0%
        transform: scale(0)
      100%
        transform: scale(1)
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100%
      img
        position absolute
        top:0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top:10px
        left 0
        .icon-arrow_lift
          display inline-block
          padding 10px
          font-size 20px
          color #fff
    .content
      position relative
      padding 18px
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height: 10px
        font-size: 0
        .sell-count,.rating
          font-size: 10px
          color: rgb(147,153,159)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          font-size: 10px;
          text-decoration: line-through;
          color: #93999f;
          font-weight: 700;
          line-height: 24px;
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right:18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size 10px
        color #fff
        background rgb(0,160,220)
        &.fade-enter-active, &.fade-leave-active
          transition: opacity .5s
        &.fade-enter, &.fade-leave-to
          opacity: 0
    .info
       padding 18px
       .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
       .text
         padding: 0 8px;
         font-size: 12px;
         font-weight: 200;
         color: #4d555d;
         line-height: 24px;

    .rating
      padding 18px
      .title
        line-height 14px
        margin-left: 18px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position: absolute
            right: 0
            top:16px
            line-height: 12px
            font-size: 0
            .name
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color: rgb(147,153,159)
            .avatar
                border-radius: 50%

          .time
            margin-right: 6px
            line-height: 12px
            font-size: 12px
            color: rgb(147,153,159)
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right: 4px
              line-height: 16px
              font-size: 12px
            .icon-thumb_up
              color: rgb(0,160,220)
            .icon-thumb_down
              color: rgb(147,153,159)
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147,153,159)
</style>
