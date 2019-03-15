import uri from 'utils/uri'
/*
 @desc 获取我的工单
 params [formData] @desc dateType 查询筛选条件 [Week 本周，Month 本月，Day 本日]
 * */
function getStatistic(params) {
  return new Promise((resolve,reject)=>{
    this.$get(uri.statistiscByPage,{params:params}).then(res=>{
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
 @desc 获取流转详情
 params [formData] @desc dateType 查询筛选条件 [Week 本周，Month 本月，Day 本日]
 * */
function getHistory(id) {
    return new Promise((resolve,reject)=>{
      this.$get(uri.getHistory,{params:{id:id}}).then(res=>{
        resolve(makeData(res))
      })
      .catch(err=>{
        reject(err)
      })
    })
  }

  export{
    getStatistic,getHistory
  }