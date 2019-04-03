import uri from 'utils/uri'

/**
 * @desc 获取客户名称
 */
function getCustomerOrgDic() {
  return new Promise((resolve, reject) => {
    this.$get(uri.getCustomerOrgDic).then(res => {
        resolve(makeData(res))
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * @desc 格式化客户名称 picker
*/
function makeData(res) {
  let newArr = []
  res.forEach((item,index)=>{
    newArr.push({
      text: item.name,
      code: item.code
    })
  })
  return newArr
}

/**
 * @desc 获取工单类型
 */
function getBtDic(customerId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId}
    this.$get(uri.getBtDic,{params:data}).then(res=>{
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
 * @desc 获取资产列表
 * @params
 */
function getAssetType(customerId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId}
    this.$get(uri.getAssetType,{params:data}).then(res=>{
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
    this.$get(uri.getAssetsList,{params:data}).then(res=>{
      resolve(res)
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
      resolve(makeProjectData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}

function makeProjectData(res) {
  let newArr = []
  res.forEach((item,index)=>{
    newArr.push({
      text:item.projectName,
      code:item.id
    })
  })
  return newArr
}

/**
 * @desc 获取子项目
 * @params
 */
function getProjectSubDic(customerId,projectId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId,projectId:projectId}
    this.$get(uri.getProjectSubDic,{params:data}).then(res=>{
      resolve(makeSubData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}
function makeSubData(res) {
  let newArr = []
  res.forEach((item,index)=>{
    newArr.push({
      text:item.subProjectName,
      code:item.id
    })
  })
  return newArr
}

/**
 * @desc 上传
 * @params
 */
function upload(formData) {
  return new Promise((resolve,reject)=>{
    this.$postUpload(uri.upload,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 删除附件
 * @params
 */
function deleteFile(formData) {
  return new Promise((resolve,reject)=>{
    this.$axios.post(uri.deleteFile,formData).then(res=>{
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
 * @desc 开始创建工作流
 * @params
 */
function startWorkflow(customerOrg,busiTypeCode) {
  return new Promise((resolve,reject)=>{
    let data = {customerOrg:customerOrg,busiTypeCode:busiTypeCode}
    this.$get(uri.startWorkflow,{params:data}).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取客户和部门和公司负责人列表
 * @params
 */
function getCustomerAndJcAllDeptAndUser(nowCustomerOrgId) {
  return new Promise((resolve,reject)=>{
    let data = {nowCustomerOrgId:nowCustomerOrgId}
    this.$axios.get(uri.getCustomerAndJcAllDeptAndUser,{params:data}).then(res=>{
      resolve(res.data)
    })
    .catch(err=>{
      reject(err)
    })
  })
}
/**
 * @desc 获取下一节点
 * @params
 */
function getNextNodes(formData) {
  return new Promise((resolve,reject)=>{
    this.$post(uri.getNextNodes,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}
export {
  getCustomerOrgDic,getBtDic,getUrgencyDic,getAssetType,getAssetsList,getProjectDic,getProjectSubDic,upload,deleteFile
  ,saveWorkflow,startWorkflow,getNextNodes,getCustomerAndJcAllDeptAndUser
}