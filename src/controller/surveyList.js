import uri from 'utils/uri'

/*
 @desc 绑定账户
 @params [formData] @desc formData
 * */
function getVisited(params) {
  return new Promise((resolve,reject)=>{
    let formData = new FormData();
    formData.append('paperId',params.id)
    this.$post(uri.cananswer,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
       reject(err)
    })
  })
}

export {
  getVisited
}






