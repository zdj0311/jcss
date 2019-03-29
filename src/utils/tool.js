import {getNextNodes}from 'controller/order-create'
let getQueryString = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 
//获取地址栏参数
function getQueryVariable(variable) {
  var query = window.location.search;
  query = query.slice(1);
  console.log("格式化url结果----" + query)
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
let showAll = function(data,user){
  all(data,user);
  return user;
}
function all(data,users){
  for (var i=0;i<data.length;i++) {
      if(data[i].subDept){
          all(data[i].subDept,users)
      }
      
      for(var j=0;j<data[i]['user'].length;j++){
          users.push(data[i]['user'][j]);
      }
      
  }
}

// 获取下一节点
let getNextNode = function(){
    var formData = new FormData();
    formData.append('curNodeId_',this.fData && this.fData.workflowBean && this.fData.workflowBean.curNodeId_?this.fData.workflowBean.curNodeId_:this.form.curNodeId_)
    formData.append('definitionId_',this.fData && this.fData.workflowBean && this.fData.workflowBean.definitionId_?this.fData.workflowBean.definitionId_:this.form.definitionId_)
    formData.append("workflowVar_['wUserType']",this.fData && this.fData.wUserType?this.fData.wUserType:this.form.wUserType)
    formData.append("workflowVar_['wCustomerUserId']",this.fData && this.fData.wCustomerUserId?this.fData.wCustomerUserId:'')
    return getNextNodes.bind(this)(formData)   
}
const tool = {
  getQueryString:getQueryString,
  getQueryVariable:getQueryVariable,
  getNextNode:getNextNode,
  showAll:showAll
}


Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export default tool