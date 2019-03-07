import Vue from 'vue' 
import config from '../../config'

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

