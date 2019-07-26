<template>
  <div class="cartcontrol">
    <transition  name="slide-fade">
      <div class="car-decrease" v-show="food.count>0" @click="decreaseCart">
        <span class=" icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="car-count"  v-show="food.count>0">{{food.count}}</div>
    <div class="car-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { eventBus } from '../../components/event-bus'
    export default {
        name: "cartcontrol",
      props:{
          food:{
            type:Object
          }
      },
      created(){
      },
      methods:{
        addCart(event){
          if (!event._constructed){
            return
          }
          if (!this.food.count) {
            Vue.set(this.food, 'count', 1)
          } else {
            this.food.count += 1
          }
          // 优化体验，异步传递当前点击文档节点
          this.$nextTick(() => {
            eventBus.$emit('addcart', event.target)
          })
        },
        decreaseCart (event) {
          if (!event._constructed){
            return
          }
          if (this.food.count) {
            this.food.count --
          }
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .car-decrease,.car-add
      display: inline-block
      line-height: 24px
      width: 24px
      height 24px
      font-size: 24px
      padding 6px
      color rgb(0,160,220)
    .car-count
      display: inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)

  .cartcontroll
  &.slide-fade-enter-active
    transition: all .3s ease
  &.slide-fade-leave-active
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0)
  &.slide-fade-enter, &.slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
    transform: translateX(24px) rotate(360deg)
    opacity: 0

</style>
