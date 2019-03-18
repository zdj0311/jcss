import uri from 'utils/uri'
/*
 @desc 获取饼图
 params [formData] @desc dateType 查询筛选条件 [Week 本周，Month 本月，Day 本日]
 * */
function getDetail(params) {
return new Promise((resolve,reject)=>{
    this.$get(uri.loadWorkflow,{params:params}).then(res=>{
      resolve(makeData(res))
    })
    .catch(err=>{
      reject(err)
    })
})
//return new Promise((resolve,reject)=>{
//  setTimeout((res)=>{
//    resolve(makeData(res))
//  },100)
//})
}
function makeData(res) {
  console.log(res)
  let obj = {
    baseInfo:[], // 基本信息
    auditInfo:[], // 审批信息
    projectInfo:[], // 项目信息
    assetInfo:[], // 资产信息
    fileInfo:[], // 附件信息
  }
        
  obj.baseInfo = [{
    title:'申请人',
    value:res.billData.appUserName
  },{
    title:'联系方式',
    value:res.billData.appUserPhone
  },{
    title:'状态',
    value:'舒兰市鸭脖王'
  },{
    title:'编码',
    value:res.billData.code
  },{
    title:'客户负责人',
    value:res.billData.customerName
  },{
    title:'工单类型',
    value:res.billData.busiTypeName
  },{
    title:'紧急程度',
    value:res.billData.urgencyValue
  },{
    title:'开始时间',
    value:res.billData.planStartTime
  },{
    title:'结束时间',
    value:res.billData.planEndTime
  },{
    title:'事件主题',
    value:res.billData.subject
  },{
    title:'事件结果',
    value:res.billData.billRes
  }]
   obj.auditInfo = [{
    title:'评价等级',
    value:res.billData.billAssess
  },{
    title:'客户评语',
    value:res.billData.publishSuggest
  }]
  obj.projectInfo = [{
    title:'项目名称',
    value:res.billData.projectName
  }]
  obj.assetInfo = [{
    title:'资产分类',
    value:res.billData.assetTypeName
  },{
    title:'关联资产',
    value:res.caseAssetsList
  }]
  obj.fileInfo = [{
    title:'附件列表',
    value:res.attachList // array
  }]
  return obj
}

export {
  getDetail
}






