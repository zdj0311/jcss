import Vue from 'vue' 
import axios from 'axios'
import errorMessage from 'utils/error-message'

Vue.$axios = Vue.prototype.$axios = axios

function axiosGet(url,data) {
  return new Promise((resolve,reject)=>{
    Vue.$axios.get(url,data).then(res=>{
      console.log(res.data)
      if(res.data.code === '000000') {
        resolve(res.data.data)
      }else {
        reject({
          errorCode: res.data.code,
          errorMessage: errorMessage[res.data.code] || res.data.message
        })
      }
    })
  })
}

Vue.$get = Vue.prototype.$get = axiosGet
