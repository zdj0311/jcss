// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/css/normalize.css'
import '@/css/reset.css'
import config from '../config'
import utils from 'utils/rest'
import Vant from 'vant'
import ElementUI from 'element-ui';
import axios from 'axios'
import getUser from 'utils/getUser'

import 'element-ui/lib/theme-chalk/index.css';
import 'vant/lib/index.css'
import store from 'store'
import init from 'utils/init'

Vue.config.productionTip = false
Vue.use(Vant);
Vue.use(ElementUI);
if(process.env.NODE_ENV === 'development' && config.dev.mock) {
  let Mock = require('mockjs')
  Vue.$mock = Vue.prototype.$mock = Mock
  require('./mock')
}

let info = false

router.beforeEach((to, from, next) => {
  let user = localStorage.getItem('user')
  if(info && to.name === 'auth') {
    next()
  }else if(user && JSON.parse(user).userStatus === 'created') {
    if(process.env.NODE_ENV !== 'proxy') {
      getUser('dev').then(res=>{
        store.commit('admin/updateUser',res.data.data)
        next()
      })
    }else {
      getUser('proxy').then(res=>{
        store.commit('admin/updateUser',res.data.data)
        next()
      })
    }
  }else {
    if(process.env.NODE_ENV !== 'proxy') {
      getUser('dev').then(res=>{
        store.commit('admin/updateUser',res.data.data)
        info = true
        router.push('auth')
      })
    }else {
      // 如果是代理服务器
      getUser('proxy').then(res=>{
        store.commit('admin/updateUser',res.data.data)
        info = true
        router.push('auth')
      })
    }
    
  }
})

// 百度统计
//var _hmt = _hmt || [];
//window._hmt = _hmt; // 必须把_hmt挂载到window下，否则找不到
//(function() {
//var hm = document.createElement("script");
//hm.src = "https://hm.baidu.com/hm.js?38dcfc591c68b2a9a5dde92aa7de6d12";
//var s = document.getElementsByTagName("script")[0]; 
//s.parentNode.insertBefore(hm, s);
//})();

Vue.mixin({
  methods: {
    cw() {
      return window.innerWidth
    }
  }
})

Vue.directive('title', {
  componentUpdated: function(el, binding) {
    document.title = binding.value
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  components: {
    App
  },
  template: '<App/>',
  data() {
    return {
      screenWidth: document.body.clientWidth,
      timer: false
    }
  },
  watch: {
    screenWidth(val) {
      if(!this.timer) {
        this.screenWidth = val
        this.timer = true
        let that = this
        setTimeout(function() {
          that.timer = false
        }, 800)
      }
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      that.screenWidth = document.body.clientWidth
    }
  },
})

