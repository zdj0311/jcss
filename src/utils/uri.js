let api = '/jcss/'

export default{
  getUserInfo:api + 'api/wx/user/info.action', // 获取用户信息、审核状态 支持无用户状态
  getPostDic:api + 'api/wx/user/dic.action', // 获取职务字典列表
  bindUser:api + 'api/wx/user/maintain.action', // 绑定用户
  getStatisticCount:api + 'api/wk/statistiscCount.action', // 获取工单数量
  getStatistic:api + 'api/wk/statistisc.action', // 获取饼状统计图、工单列表
  statistiscByPage:api + 'api/wk/statistiscByPage.action', // 获取分页饼状统计图、工单列表
  getCustomerOrgDic:api + 'api/wk/dic/customerDicList.action', // 获取客户名称字典列表
  getCustomerDic:api + 'api/jcdept/getCustomerDeptAndUser.action', // 获取客户负责人字典列表
  getBtDic:api + 'api/wk/dic/btDicList.action', // 获取工单类型字典列表
  getUrgencyDic:api + 'api/wk/dic/dicList.action', // 获取紧急程度字典列表
  getProjectDic:api + 'api/wk/dic/projectDicList.action', // 获取项目字典列表
  getProjectSubDic:api + 'api/wk/dic/projectSubDicList.action', // 获取子项目字典列表
  upload:api + 'api/wx/attach/upload.action', // 上传
  getAssetType:api + 'api/wk/dic/assetsTypeList.action', // 获取资产列表
  getAssetsList:api + 'api/wk/dic/assetsList.action', // 获取子资产列表
  startWorkflow:api + 'api/wk/startWorkflow.action', // 开始创建工作流
  saveWorkflow:api + 'api/wk/saveWorkflow.action', // 保存工单
  loadWorkflow:api + 'api/wk/loadWorkflow.action', // 获取工单
  updateWorkflow:api + 'api/wk/updateWorkflow.action', // 修改工单
  getNextNodes:api + 'api/wk/getNextNodes.action', // 获取下一节点
  evaluation: api + 'api/wk/dic/dicList.action', //评价
  paperList: api + 'api/wx/question/paperList.action', //调查问卷列表
  cananswer: api + 'api/wx/question/check/cananswer.action', //是否有权限答题
  submitPaper: api + 'api/wx/question/submit.action' // 提交问卷
}
