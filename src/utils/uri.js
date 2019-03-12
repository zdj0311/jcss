export default{
  getUserInfo:'jcss/api/wx/user/info.action', // 获取用户信息、审核状态 支持无用户状态
  getPostDic:'jcss/api/wx/user/dic.action', // 获取职务字典列表
  bindUser:'jcss/api/wx/user/maintain.action', // 绑定用户
  getStatisticCount:'jcss/api/wk/statistiscCount.action', // 获取工单数量
  getStatistic:'jcss/api/wk/statistisc.action', // 获取饼状统计图、工单列表
  getCustomerOrgDic:'jcss/api/wk/dic/customerDicList.action', // 获取客户名称字典列表
  getCustomerDic:'jcss/api/jcdept/getCustomerDeptAndUser.action', // 获取客户负责人字典列表
  getBtDic:'jcss/api/wk/dic/btDicList.action', // 获取工单类型字典列表
  getUrgencyDic:'jcss/api/wk/dic/dicList.action', // 获取紧急程度字典列表
  getProjectDic:'jcss/api/wk/dic/projectDicList.action', // 获取项目字典列表
  getProjectSubDic:'jcss/api/wk/dic/projectSubDicList.action', // 获取子项目字典列表
  upload:'jcss/api/wx/attach/upload.action', // 上传
  getAssetType:'jcss/api/wk/dic/assetsTypeList.action', // 获取资产列表
  getAssetsList:'jcss/api/wk/dic/assetsList.action', // 获取子资产列表
  startWorkflow:'jcss/api/wk/startWorkflow.action', // 开始创建工作流
  saveWorkflow:'jcss/api/wk/saveWorkflow.action', // 保存工单
  loadWorkflow:'jcss/api/wk/loadWorkflow.action', // 获取工单
  updateWorkflow:'jcss/api/wk/updateWorkflow.action', // 修改工单
}
