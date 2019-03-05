var publicPanel = {};

// 获取地址参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");  
    var r = window.location.search.substr(1).match(reg);   
    if (r != null) return unescape(r[2]); return null; 
}
/**
 * 动态引入js，目的是为了给js加入随机数脚本
 * @param {*} url 
 * @param {*} callback 
 */
publicPanel.loadJs = function(url, callback) {
    var done = false;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.language = 'javascript';
    // script.charset = "utf-8";
    if(url.indexOf("?") > -1){
        url = url + "&rand=" + Math.random();
    }else{
        url = url + "?rand=" + Math.random();
    }
    script.src = url;
    // 等于 url ready 方法
    script.onload = script.onreadystatechange = function () {
        if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            //方法名
            if (callback) {
                callback.call(script);
            }
        }
    };
    document.getElementsByTagName("body")[0].appendChild(script);
};  
// 获取职务名称
publicPanel.loadDataDic = function(formId, elementId, dicCode, defaultValue, clickShowElement){
    var elementObj = $('#' + elementId);
    if(formId != null){
        elementObj = $('#' + formId + ' #' + elementId);
    }
    $.ajax({
        url: baseUrl + '/api/wx/user/dic.action',
        type : 'POST',
        dataType : 'json',
        data: {
            code : dicCode
        },
        success : function(data) {
            console.log(data);
            var html = "";
            var defaultCode = "";
            var defaultV = "";
            for (var i = 0; i < data.data.length; i++) {
                var datas = data.data[i];
                html += "<li onclick='publicPanel.selectClick(\"" + formId + "\", \"" + clickShowElement + "\", \"" + datas.code + "\", \"" + datas.name + "\");'>" + datas.name + "</li>"
                if (defaultValue != null && defaultValue == datas.code) {
                  defaultCode = datas.code;
                  defaultV = datas.value;
                }
            }
            elementObj.html(html);
            if(defaultValue != null){
                publicPanel.selectClick(formId, clickShowElement, defaultCode, defaultV);
            }
        },
        error : function() {
        },
    });
};

publicPanel.selectClick = function(formId, elementId, code, value){
    var elementObj = $('#' + elementId);
    if (formId != null) {
        elementObj = $('#' + formId + ' #' + elementId);
    }
    elementObj.val(code);
    var elementValueObj = $('#' + elementId + "Value");
    if (formId != null) {
        elementValueObj = $('#' + formId + ' #' + elementId + "Value");
    }
    elementValueObj.val(value);
    $(".selectTan").hide();
}

publicPanel.validateStatus = false;
publicPanel.messagebox = function (mess) {
    if (publicPanel.validateStatus) return;
    publicPanel.validateStatus = true;
    $("#showError").html(mess);
    $(".verification").show().delay(1800).hide(300);
}

publicPanel.clearValidateStatus = function(){
    publicPanel.validateStatus = false;
}

$(function(){
    //选择框
    $(".sele").on("click",function(){
        $(this).parents(".authenTab").next(".selectTan").show();
        $("body").css("overflow", "hidden");
    });
    $(".sure").on("click",function(){
        $(this).parents(".selectTan").hide();
        $(this).parents(".selectTan").prev(".authenTab").find(".sele").val("");
        $("body").css("overflow", "auto")
    })
    //展开收起
    $(".drop").on("click",function(){
        if($(this).hasClass("dropDown")){
            $(".unfold").css("height","100%");
            $(this).html("收起选添项").removeClass("dropDown")
        }else{
            $(".unfold").css("height","0.15rem");
            $(this).html("展开选添项").addClass("dropDown")
        }
    });
});
