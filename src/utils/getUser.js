import axios from 'axios'
import config from 'config'
import tool from 'utils/tool'
import uri from 'utils/uri'
/*
 @params [String] type 请求类型 [proxy dev]
 * */
function getUser(type) {
  if(!type) return axios.get(config.hostname + api + '/api/wx/user/info.action')
  if(type === 'dev') return axios.get(config.hostname + api + '/api/wx/user/info.action')
  if(type === 'proxy') {
    let openid = localStorage.getItem('openid')
    if(openid && openid !== 'success') {
      return axios.get(config.hostname + api + '/api/wx/user/info.action',{params:{openId:openid}})
    }else {
      return new Promise((resolve,reject)=>{
        axios.get(config.hostname + api + 'api/wx/linkBackTest.action',{params: {
          code: tool.getQueryVariable('code'),
          state: 'MOCK'
        }}).then(res=>{
          localStorage.setItem('openid', res.data.data)
          openid = res.data.data
          resolve(axios.get(config.hostname + api + '/api/wx/user/info.action',{params:{openId:openid}}))
        })
      })
    }
  }
}
export default getUser
