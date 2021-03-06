import Vue from 'vue' 
import '../directive'
import config from '../../config'

Vue.mixin({
  methods: {
    addPath(url) {
      return config.publicPath + api + url
    },
    addHost(url) {
      return config.hostname + url
    }
  }
})

