import uri from 'utils/uri'

function feedback(params) {
  return new Promise((resolve,reject)=>{
    let formData = new FormData()
    formData.append("userName", params.userName);
    formData.append("mobile", params.mobile);
    formData.append("txt", params.txt);
    formData.append("orgName", params.orgName);
    this.$post(uri.feedback,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}
export {
    feedback
}






