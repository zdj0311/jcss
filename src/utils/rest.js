import Vue from 'vue' 
import axios from 'axios'
import errorMessage from 'utils/error-message'
import config from 'config'

Vue.$axios = Vue.prototype.$axios = axios

function axiosGet(url,data) {
  return new Promise((resolve,reject)=>{
    Vue.$axios.get(config.hostname + url,data).then(res=>{
      if(res.data.code === '000000') {
        resolve(res.data.data)
      }else {
        reject({
          code: res.data.code,
          message: errorMessage[res.data.code] || res.data.message
        })
      }
    })
  })
}
function axiosPost(url, data) {
  return new Promise((resolve, reject) => {
    Vue.$axios.post(config.hostname + url, data).then(res => {
      if(res.data.code === '000000') {
        resolve(res.data.data)
      } else {
        reject({
          code: res.data.code,
          message: errorMessage[res.data.code] || res.data.message
        })
      }
    })
  })
}

function axiosUpload(url, data) {
  return new Promise((resolve, reject) => {
    Vue.$axios({
        method:"post",
        url:config.hostname + url,
        data:data,
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        mimeType:"multipart/form-data",  
    }).then(res => {
       resolve(res.data)
    })
  })
}
Vue.$get = Vue.prototype.$get = axiosGet
Vue.$post = Vue.prototype.$post = axiosPost
Vue.$postUpload = Vue.prototype.$postUpload = axiosUpload
