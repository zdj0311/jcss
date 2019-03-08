import Vue from 'vue' 
import axios from 'axios'
import errorMessage from 'utils/error-message'

Vue.$axios = Vue.prototype.$axios = axios

function axiosGet(url,data) {
  return new Promise((resolve,reject)=>{
    Vue.$axios.get(url,data).then(res=>{
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
    Vue.$axios.post(url, data).then(res => {
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
Vue.$get = Vue.prototype.$get = axiosGet
Vue.$post = Vue.prototype.$post = axiosPost
