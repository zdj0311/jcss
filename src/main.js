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
import 'vant/lib/index.css'
import store from 'store'
import init from 'utils/init'

Vue.config.productionTip = false
Vue.use(Vant);
if(process.env.NODE_ENV==='development' && config.dev.mock) {
  let Mock = require('mockjs')
  Vue.$mock = Vue.prototype.$mock = Mock
  require('./mock')
}
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
  methods:{
    cw() {
      return window.innerWidth
    }
  }
})
Vue.directive('title', {
  componentUpdated: function (el, binding) {
    document.title = binding.value
  }
})
router.beforeEach((to,from,next)=>{
// 百度统计
//if (_hmt) {
//      if (to.path) {
//          _hmt.push(['_trackPageview', '/#' + to.fullPath])
//      }
//  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  components: { App },
  template: '<App/>',
  data(){
    return {
      screenWidth: document.body.clientWidth,
      timer:false
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
    created() {
      this.$get('/jcss/api/wx/user/info.action').then(res=>{
        if(res.userStatus === "UNRegister") {
          this.$router.push('auth')
        }else if(res.userStatus === "created") {
          this.$store.commit('admin/updateUser',res)
        }
      })
    },
    mounted() {
      const that = this
      window.onresize = () => {
        that.screenWidth = document.body.clientWidth
      }
    },  
})
