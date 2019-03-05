import Vue from 'vue' 
import errorMessage from 'utils/error-message'
function axiosGet(url,data) {
  return new Promise((resolve,reject)=>{
    Vue.$axios.get(url,data).then(res=>{
      if(res.data.errorCode === 200) {
//      console.log(JSON.stringify(res.data))
        resolve(res.data.data)
      }else {
        reject({
          errorCode: res.data.errorCode,
          errorMessage: errorMessage[res.data.errorCode] || res.data.errorMessage
        })
      }
    })
  })
}

Vue.$get = Vue.prototype.$get = axiosGet
