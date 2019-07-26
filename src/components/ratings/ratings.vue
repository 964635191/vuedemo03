<template>
	<div class="ratings" ref="ratings">
		<div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="24" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="24" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :select-type="selectType" :only-content="onlyContent" @selecttype="selecttype" @content="content"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" alt="" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend">
                <span class="icon-thumb_up" v-show="rating.recommend && rating.recommend.length"></span>
                <span  v-for="item in rating.recommend" class="recommend-item">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
	</div>
</template>

<script>
  import BScroll from 'better-scroll'
  import star from '../../components/star/star'
  import  ratingselect from '../../components/ratingselect/ratingselect'
  import split from '../../components/split/split';
  import {formatDate} from '../../common/js/date.js'
  import data from '../../common/json/data.json'
  const ALL = 2;
  const ERR_OK =0;
  export default {
    props:{
      seller:{
        type:Object
      }
    },
    data(){
      return{
        ratings:[],
        selectType:ALL,
        onlyContent:true,
      }
    },
    created(){
      // this.$http.get('/api/ratings').then((response) => {
      //   response = response.data
      //   if (response.errno === ERR_OK) {
      //     this.ratings = response.data
      //     this.$nextTick(() => {
      //      if (!this.ratingScroll) {
      //        this.ratingScroll = new BScroll(this.$refs.ratings, {
      //          click: true
      //        })
      //      } else {
      //        this.ratingScroll.refresh()
      //      }
      //    })
      //   }
      //
      // })
      this.ratings = data.ratings
      this.$nextTick(() => {
        if (!this.ratingScroll) {
          this.ratingScroll = new BScroll(this.$refs.ratings, {
            click: true
          })
        } else {
          this.ratingScroll.refresh()
        }
      })
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods:{
      selecttype (type) {
        this.selectType = type
        // 手动刷新better-scroll重新计算页面高度
        this.$nextTick(() => {
          this.ratingScroll.refresh()
        })
      },
      content () {
        this.onlyContent = !this.onlyContent
        // 手动刷新better-scroll重新计算页面高度
        this.$nextTick(() => {
          this.ratingScroll.refresh()
        })
      },
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    components:{
      star,
      ratingselect,
      split
    }
	}


</script>

<style  lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .ratings
    position: absolute
    top:174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0,0,137px
        width: 137px
        padding: 6px 0
        border-right: 1px solid rgba(7,17,27,0.2)
        text-align: center
        .score
          line-height: 28px
          font-size: 24px
          color: rgb(255,153,0)
          margin-bottom: 6px
        .title
          font-size: 12px
          color: rbg(7,17,27)
          line-height: 12px
          margin-bottom: 8px
        .rank
          font-size: 10px
          color rgb(147,153,159)
          line-height: 10px
      .overview-right
        flex: 1
        padding:6px 0 6px 24px
        .score-wrapper
          margin-bottom: 8px
          line-height: 18px
          font-size: 0
          .title
            display: inline-block
            font-size: 12px
            line-height 18px
            color: rgb(7,17,27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255,153,0)
        .delivery-wrapper
          font-size: 0
          .title
            display: inline-block
            font-size: 12px
            color: rgb(7,17,27)
          .time
            margin-left: 12px
            display: inline-block
            font-size: 12px
            color: rgb(147,153,159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7,17,27)
          .star-wrapper
            font-size: 0
            margin-bottom: 6px
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              margin-right: 6px
              vertical-align: top
              font-size: 10px
              color rgb(147,153,159)
          .text
            line-height 18px
            font-size 12px
            color rgb(7,17,27)
            margin-bottom 8px
          .recommend
            line-height: 16px
            .icon-thumb_up,.recommend-item
              display: inline-block
              margin 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0,160,220)
            .recommend-item
              padding 0 6px
              border: 1px solid rgba(7,17,27,0.1)
              color: rgba(7,17,27,0.4)
              background: #fff
              border-radius: 1px

          .time
            position: absolute
            top:0
            right: 0
            color: rgb(147,153,159)
            font-size: 10px
            line-height: 12px
</style>
