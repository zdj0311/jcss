import uri from 'utils/uri'
/*
 @desc 获取信息发布
 * */
function getInfo(params) {
return new Promise((resolve,reject)=>{
    this.$get(uri.getInfo,{params:params}).then(res=>{
      resolve(res)
    })
    .catch(err=>{s
      reject(err)
    })
})
}


export {
  getInfo
}






