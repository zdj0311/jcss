import uri from 'utils/uri'
/*
 @desc 获取饼图
 params [formData] @desc dateType 查询筛选条件 [Week 本周，Month 本月，Day 本日]
 * */
function getDetail(params) {
//return new Promise((resolve,reject)=>{
//  this.$get(uri.statistiscByPage,{params:params}).then(res=>{
//    resolve(makeData(res))
//  })
//  .catch(err=>{
//    reject(err)
//  })
//})
return new Promise((resolve,reject)=>{
    setTimeout((res)=>{
      resolve(makeData(res))
    },100)
})
}
function makeData(res) {
  let obj = {
    baseInfo:[], // 基本信息
    auditInfo:[], // 审批信息
    projectInfo:[], // 项目信息
    assetInfo:[], // 资产信息
    fileInfo:[], // 附件信息
  }
  obj.baseInfo = [{
    title:'申请人',
    value:'舒兰市鸭脖王'
  },{
    title:'联系方式',
    value:'舒兰市鸭脖王'
  },{
    title:'状态',
    value:'舒兰市鸭脖王'
  },{
    title:'编码',
    value:'舒兰市鸭脖王'
  },{
    title:'客户负责人',
    value:'舒兰市鸭脖王'
  },{
    title:'工单类型',
    value:'舒兰市鸭脖王'
  },{
    title:'紧急程度',
    value:'舒兰市鸭脖王'
  },{
    title:'开始时间',
    value:'舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王'
  },{
    title:'结束时间',
    value:'舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王'
  },{
    title:'事件主题',
    value:'舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王'
  },{
    title:'事件结果',
    value:'舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王舒兰市鸭脖王'
  }]
   obj.auditInfo = [{
    title:'评价等级',
    value:'舒兰市鸭脖王'
  },{
    title:'客户评语',
    value:'舒兰市鸭脖王'
  }]
  obj.projectInfo = [{
    title:'项目名称',
    value:'舒兰市鸭脖王'
  }]
  obj.assetInfo = [{
    title:'资产分类',
    value:'舒兰市鸭脖王'
  },{
    title:'关联资产',
    value:'舒兰市鸭脖王'
  }]
  obj.fileInfo = [{
    title:'附件列表',
    value:'舒兰市鸭脖王'
  }]
  return obj
}

export {
  getDetail
}






