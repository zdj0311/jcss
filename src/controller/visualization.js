import uri from 'utils/uri'
/*
 @desc 获取饼图
 params [formData] @desc dateType 查询筛选条件 [Week 本周，Month 本月，Day 本日]
 * */
function getStatistic(params) {
  return new Promise((resolve,reject)=>{
    this.$get(uri.getStatistic,{params:params}).then(res=>{
      resolve(makeData(res))
    })
    .catch(err=>{
      reject(err)
    })
  })
}
function makeData(res) {
  return res
}
/*
 @desc 获取统计数量
 params [formData] @desc dateType 查询筛选条件 [Week 本周，Month 本月，Day 本日]
 * */
function getStatisticCount(params) {
  return new Promise((resolve,reject)=>{
    this.$get(uri.getStatisticCount,{params:params}).then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}
export {
  getStatistic,getStatisticCount
}






