import uri from 'utils/uri'
/*
 @desc 获取用户列表
 params [formData] @desc code 字典id
 * */
function getPostDic(dicId) {
  return new Promise((resolve,reject)=>{
    let formData = new FormData()
    formData.append("code", dicId);
    this.$post(uri.getPostDic,formData).then(res=>{
      resolve(makeData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}
function makeData(res) {
  let newArr = []
  res.forEach((item,index)=>{
    newArr.push({
      text:item.name,
      code:item.code
    })
  })
  return newArr
}

/*
 @desc 绑定账户
 @params [formData] @desc formData 
 @params [String] @desc userName 姓名
 @params [String] @desc mobile 手机
 @params [String] @desc roomNo 房间号
 @params [String] @desc dutyValue 职务
 @params [String] @desc cardNo 身份证号
 @params [String] @desc orgName 客户名称
 * */
function bindUser(params) {
  return new Promise((resolve,reject)=>{
    let formData = new FormData()
    formData.append("userName", params.userName);
    formData.append("mobile", params.mobile);
    formData.append("roomNo", params.roomNo);
    formData.append("dutyValue", params.dutyValue.code);
    formData.append("cardNo", params.cardNo);
    formData.append("orgName", params.orgName);
    this.$post(uri.bindUser,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}
export {
  getPostDic,bindUser
}





