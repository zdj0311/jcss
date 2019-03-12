import uri from 'utils/uri'

/**
 * @desc 获取客户名称
 */
function getCustomerOrgDic() {
  return new Promise((resolve,reject)=>{
    this.$get(uri.getCustomerOrgDic).then(res=>{
      resolve(makeData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取工单类型
 */
function getBtDic() {
  return new Promise((resolve,reject)=>{
    this.$get(uri.getBtDic).then(res=>{
      resolve(makeData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取客户负责人
 * @params
 */
function getCustomerDic(nowCustomerOrgId) {
  return new Promise((resolve,reject)=>{
    let data = {nowCustomerOrgId:nowCustomerOrgId}
    this.$get(uri.getCustomerDic,{params:data}).then(res=>{
      resolve(makeData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取紧急程度
 * @params
 */
function getUrgencyDic(code,parentCode) {
  return new Promise((resolve,reject)=>{
    let data = {code:code,parentCode:parentCode}
    this.$get(uri.getUrgencyDic,{params:data}).then(res=>{
      resolve(makeData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取项目
 * @params
 */
function getProjectDic(customerId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId}
    this.$get(uri.getProjectDic,{params:data}).then(res=>{
      resolve(makeData(res,'project'))
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取子项目
 * @params
 */
function getProjectSubDic(customerId,projectId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId,projectId:projectId}
    this.$get(uri.getProjectSubDic,{params:data}).then(res=>{
      resolve(makeData(res,'projectSub'))
    })
    .catch(err=>{
      reject(err)
    })
  })
}

function makeData(res,pro) {
  let newArr = []
  res.forEach((item,index)=>{
    if(pro=='project'){
      newArr.push({
        text:item.projectName,
        code:item.id
      })
    }else if(pro=='projectSub'){
      newArr.push({
        text:item.subProjectName,
        code:item.id
      })
    }else{
      newArr.push({
        text:item.name,
        code:item.code
      })
    } 
  })
  return newArr
}

/**
 * @desc 获取资产列表
 * @params
 */
function getAssetType(customerId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId}
    this.$get(uri.getAssetType,data).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取子资产列表
 * @params
 */
function getAssetsList(customerId,assetsTypeId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId,assetsTypeId:assetsTypeId}
    this.$get(uri.getAssetsList,data).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取工单
 * @params
 */
function loadWorkflow(id) {
  return new Promise((resolve,reject)=>{
    let data = {id:id}
    this.$get(uri.loadWorkflow,{params:data}).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 保存工单
 * @params
 */
function saveWorkflow(formData) {
  return new Promise((resolve,reject)=>{
    this.$post(uri.saveWorkflow,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 修改工单
 * @params
 */
function updateWorkflow(formData) {
  return new Promise((resolve,reject)=>{
    this.$post(uri.updateWorkflow,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 上传
 * @params
 */
function upload(formData) {
  return new Promise((resolve,reject)=>{
    this.$post(uri.upload,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

export {
  getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetType,getAssetsList,loadWorkflow,updateWorkflow,upload
}






