import uri from 'utils/uri'
import Vue from 'vue'
import axios from 'axios'

Vue.$axios = Vue.prototype.$axios = Vue.prototype.$http = axios

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
 * @desc 获取客户负责人
 * @params
 */
function getCustomerDic(nowCustomerOrgId) {
  return new Promise((resolve,reject)=>{
    let data = {nowCustomerOrgId:nowCustomerOrgId}
    Vue.$axios.get(uri.getCustomerDic,{params:data}).then(res=>{
      resolve(res.data)
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
 * @desc 评价
 * @params
 */
function evaluation(code,parentCode) {
  return new Promise((resolve,reject)=>{
    let data = {code:code,parentCode:parentCode}
    this.$get(uri.evaluation,{params:data}).then(res=>{
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

/**
 * @desc 获取调查问卷
 * @params
 */
function paperList() {
  return new Promise((resolve,reject)=>{
    Vue.$axios.get(uri.paperList,).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取问卷详情
 * @params
 */
function getPaper(id) {
  return new Promise((resolve,reject)=>{
    Vue.$axios.get(uri.getPaper+id).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 是否有权限答题
 * @params
 */
function cananswer(paperId) {
  return new Promise((resolve,reject)=>{
    let formData = new FormData();
    formData.append('paperId',paperId)
    Vue.$axios.post(uri.cananswer,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

/**
 * @desc 获取问卷
 * @params
 */
function submitPaper(formData) {
  return new Promise((resolve,reject)=>{
    Vue.$axios.post(uri.submitPaper,formData).then(res=>{
      resolve(res)
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
 * @desc 获取统计数量
 * @params
 */
function getStatisticCount(dateType) {
  return new Promise((resolve,reject)=>{
    let data = {dateType:dateType}
    this.$get(uri.getStatisticCount,{params:data}).then(res=>{
      resolve(res)
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
 * @desc 首页获取资产列表
 * @params
 */
function getAssetTypeTop(customerId) {
  return new Promise((resolve,reject)=>{
    let data = {customerId:customerId}
    this.$get(uri.getAssetTypeTop,{params:data}).then(res=>{
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

/**
 * @desc 跳转节点
 * @params
 */
function getGotoNodes(formData) {
  return new Promise((resolve,reject)=>{
    this.$post(uri.getGotoNodes,formData).then(res=>{
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
 * @desc 退出
 * @params
 */
function logout(formData) {
  return new Promise((resolve,reject)=>{
    this.$postUpload(uri.logout,formData).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}

export {
  getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetTypeTop,getAssetType,getAssetsList,startWorkflow,saveWorkflow,loadWorkflow,updateWorkflow,upload,getNextNodes,getGotoNodes,deleteFile,evaluation,
  paperList,cananswer,submitPaper,getStatisticCount,getPaper,logout
}






