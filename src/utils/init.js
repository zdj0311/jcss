import Vue from 'vue' 
import config from '../../config'
Vue.$get('/jcss/api/wx/user/info.action').then(res=>{
  console.log(res)
})
Vue.mixin({
  methods: {
    addPath(url) {
      return config.build.hostname + url
    },
    addHost(url) {
      return config.build.hostname + url
    }
  }
})

