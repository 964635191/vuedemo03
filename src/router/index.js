import Vue from 'vue'
import Router from 'vue-router'
// import Goods from '@/components/goods/goods'
//import Seller from '@/components/seller/seller'
import Ratings from '@/components/ratings/ratings'


Vue.use(Router)

export default new Router({
  routes: [
		{
			path: '/', redirect: '/goods' ,
		},
		{
		  path: '/goods',
		  name: 'goods',
		  component:  resolve => require(['@/components/goods/goods'], resolve),
		},
		{
		  path: '/seller',
		  name: 'seller',
      component:  resolve => require(['@/components/seller/seller'], resolve),
		},
		{
		  path: '/ratings',
		  name: 'ratings',
		  component: Ratings
		}
  ]
})
