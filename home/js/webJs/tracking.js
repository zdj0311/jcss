
var page=0;
var pagesize;
var isloading = true;
var html =""
var dzt="null"
function liClick(obj, zt){
    page = 0;
    html = "";   
    document.querySelector(".dixian").innerHTML = "------加载中-------"
    $("#all").html(" ");
   
    $(obj).parent(".tabsList").find("li").eq($(obj).index()).addClass("active").siblings().removeClass('active');
    dzt=zt;
    // isloading = true;
    // if(!isloading) return;   
    getDate(page,zt);
};
function getDate (page,zt) {
    $.ajax({
        url: baseUrl + "/api/wk/queryList.action?rowIndex="+page+"&pageMode=" + zt,
        type: "GET",
        dataType: "json",
        success: function(data) {
            isloading = false;
            

            if (data.data.data == null || data.data.data.length == 0 || !data.data ) {
               // $("#all").html("暂无数据");
               document.querySelector(".dixian").innerHTML = "-------我是有底线的-------"
                isloading = true;
                return;
            }     
            if (data.data.data == null || data.data.data.length == 0 || !data.data && page==0) {
                alert(1)
                $("#all").html("<p>------暂无数据------</p>")
                 isloading = true;
                 return;
             }
             if(data.data.data.length<5 && page==0){
                document.querySelector(".dixian").innerHTML = "-------我是有底线的-------" 
             }
             var cname = ""
            for (var i = 0; i < data.data.data.length; i++) {
                var datas = data.data.data[i];
              
                switch(datas.status)
                {              
                    case 0:               
                    cname = " colY";               
                           break;              
                    case 2:               
                    cname = " colW";                 
                           break;               
                    case 3:               
                    cname = " colW";               
                    break; 
                    case 5:               
                    cname = " colP";               
                    break;
                    case 10:               
                    cname = " colB";               
                            break;              
                    case 15:               
                    cname = " colW";                 
                            break;               
                    case 99:               
                    cname = " colB";               
                            break;               
                    case 89:               
                    cname = " colB";                 
                            break;               
                    case 90:               
                    cname = " colB";               
                            break;               
                    default:
                }
                if(datas.slaResStatus=="超时")
                {
                    var slaResStatus ="("+ datas.slaResStatus+")";
                    var redcs = " redcs"
                    
                }else{
                    var slaResStatus = '';
                    var redcs = " "
                }
                html += '<div class="untreated clearfix">';             
                html += '<h2 class="notTitle txt-cut bBott ' + redcs + '"><span class="noHandle' +cname +'">'+datas.statusValue+'</span>' + datas.subject + slaResStatus + "</h2>"; 
                html += '<table class="pubTable">';
                html += "<tbody>";
                html += "<tr>";
                html += "<th>工单类型：</th>";
                html += "<td>" + datas.busiTypeName + "</td>";
                html += "<th>处理人：</th>";
                html += "<td>" + datas.workflowBean.curUserName +"</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th>创建时间：</th>";
                html += '<td colspan="3">' + datas.actStartTime + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<th>解决时间：</th>";
                html += '<td colspan="3">' + datas.planEndTime + "</td>";
                html += "</tr>";
                html += "</tbody>";
                html += "</table>";
                if (zt == "TODO"){
                    html += '<a class="handle" href="/jcss_app/home/handleWork.html?id=' + datas.id + '">立即处理</a>';
                } else{
                    html += '<a class="handle" href="/jcss_app/home/completeWork.html?id=' + datas.id + '">查看详细</a>';
                }
                html += "</div>";
            }
            $("#all").html(html);
        },
        error: function() {
         console.log(0)
        }
    });
}
getDate(page,"null");
window.onload = function () {
   
    function getScrollTop() {
        var scrollTop = 0;
        scrollTop = document.querySelector(".labModel").scrollTop
        return scrollTop;
    }   
    function getClientHeight() {
        var clientHeight = 0;  
            clientHeight = document.querySelector(".labModel").clientHeight;   
        return clientHeight;
    }
    function getScrollHeight() {
        return document.querySelector("#all").clientHeight;
    }
    document.querySelector(".labModel").onscroll = function() {
        if(getScrollTop() + getClientHeight() +10 > getScrollHeight()) {
            document.querySelector(".dixian").style.display = "block"        
            if(isloading) return;
            isloading = true;
            // page++;
            var numlength = document.getElementById("all").children.length;
            getDate(numlength,dzt);                        
        }       
    }       
}
// 获取待处理气泡
function qipao(){
    $.ajax({
        url: baseUrl + "/api/wk/queryCountList.action?pageMode=TODO",
        type: "GET",
        dataType: "json",
        success: function(data) {
          document.querySelector(".num").innerHTML = data.data  
        },
        error:function(){

        }
    })
}
qipao()