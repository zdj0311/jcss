var form = {};
form.type = {};

//提交相关
form.type["Submit"] = {
    show: function () {
        form.type["Submit"].submit()

    },
    submit: function () {     
        form.submitType_ = "SUBMIT";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();    
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}

//暂存相关
form.type["Save"] = {
    show: function () {     
        layer.open({
            content: '是否要暂存该流程'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                form.type["Save"].submit()
              layer.close(index);
            }
          });  
    },
    submit: function () {       
        form.submitType_ = "SAVE";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}

form.type["GetBack"] = {
    show: function () {
        layer.open({
            content: '是否要拿回该流程'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                form.type["GetBack"].submit()
              layer.close(index);
            }
          });
    },
    submit: function () {
        form.submitType_ = "GETBACK";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}

//退回相关
form.type["Reject"] = {
    show: function () {
        var buttonOptJsonStr = $("#workflowBean\\.buttonOptJsonStr").val();
        if (buttonOptJsonStr == "") {
            layer.open({
                content: '无可退回节点'
                ,btn: '确定'
              });
            return;
        }
        var buttonOptJson = eval("(" + buttonOptJsonStr + ")");
        var rejectNodeList = buttonOptJson.operateBackNode;
        if (typeof rejectNodeList == 'undefined') {
            layer.open({
                content: '无可退回节点'
                ,btn: '确定'
              });
            return;
        }
        var rejectButtonHtml = "<ul class='table'>";
        var curNodeId = $("#workflowBean\\.curNodeId_").val();  
        for (var i = 0; i < rejectNodeList.length; i++) {
            if (rejectNodeList[i].id.toUpperCase() != curNodeId.toUpperCase() && rejectNodeList[i].selected) {
                
                rejectButtonHtml+="<li>";
                rejectButtonHtml+="<input type='radio' name='rejectSelectRadio' value='" + rejectNodeList[i].id + "' />" + rejectNodeList[i].name + "";
                rejectButtonHtml+="</li>";
            }
        }
        rejectButtonHtml+="</ul>";
        layer.open({
            type: 1
            ,content: '<div id="rejectSelectModal">'+rejectButtonHtml+'</div>' 
            ,style: 'width: 600px;'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                var selectNode = $('input[name="rejectSelectRadio"]').filter(':checked');
                if (selectNode.length == 0) {
                    layer.open({
                        content: '请选择退回节点'
                        ,btn: '确定'
                    });
                    return;
                }else{
                    form.confirmNodeId_ = $(selectNode[0]).val()
                    form.type["Reject"].submit()
                    layer.close(index);
                }
            }
          });  
    },
    submit: function () { 
        form.submitType_ = "REJECT";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}
//转办相关
form.type["Move"] = {
    show: function () {
        $.ajax({
            url: baseUrl + '/api/jcdept/getCustomerDeptAndUser.action',
            data: {
                nowCustomerOrgId:$('#customerOrg').val()
            },
            success: function(data){
                var user = [];
                var assigness = form.showAll(data,user);
                var personHtml = '';
                for (var j = 0; j < assigness.length; j++) {
                    personHtml += '<li>'
                        +'<input name="users" type="radio" value='+assigness[j].id+'>'
                        +'<span>'+assigness[j].displayName+'</span>'
                        +'</li>';
                }
                layer.open({
                    type: 1
                    ,content: '<ul id="chooseUserModal">'+personHtml+'</ul>'
                    ,style: 'width: 600px;'
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        var selectUsers = ($('#chooseUserModal input[name="users"]').filter(':checked'));
                        if (selectUsers.length == 0) {
                            layer.open({
                                content: '请选择转办人'
                                ,btn: '确定'
                            });
                            return;
                        }else{
                            $.each($('#chooseUserModal input[name="users"]'),function(){
                                if($(this).index()==0){
                                    form.confirmUserId_ = $(this).val();
                                }else{
                                    form.confirmUserId_ += ','+$(this).val();
                                }
                            })
                            form.type["Move"].submit()
                            layer.close(index);
                        }                        
                    }
                });
            }
        })       
    },
    submit: function () {      
        form.submitType_ = "MOVE";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}
//跳转相关
form.type["Goto"] = {
    show: function () {
        $.ajax({
            type: "POST",
            url: baseUrl + '/api/wk/getGotoNodes.action',
            async: false,
            data: {
                "definitionId_": createWork.definitionId_,
                "subProcessId_": createWork.subProcessId_
            },
            dataType: "json",
            success: function (data) {
                var gotoNodesList = data.data.gotoNodesList;
                var curNodeId = $("#workflowBean\\.curNodeId_").val()
                var gotoSelectHtml = ["<div class='table'>"];
                for (var i = 0; i < gotoNodesList.length; i++) {
                    if (gotoNodesList[i].componentId.toUpperCase().indexOf("USERTASK") != -1 && gotoNodesList[i].componentId.toUpperCase() != curNodeId.toUpperCase()) {
                        gotoSelectHtml.push("<li><input type='radio' name='gotoSelectRadio' value='" + gotoNodesList[i].componentId + "' />" + gotoNodesList[i].name +"</li>");
                    }
                }
                gotoSelectHtml.push("</div>");
                gotoSelectHtml = gotoSelectHtml.join('')
                layer.open({
                    type: 1
                    ,content: '<div id="gotoSelectDiv">'+gotoSelectHtml+'</div>'
                    ,style: 'width: 600px;'
                    ,btn: ['确定', '取消']
                    ,yes: function(index){
                        var selectNode = ($('input[name="gotoSelectRadio"]').filter(':checked'));
                        if (selectNode.length == 0) {
                            layer.open({
                                content: "请选节点信息"
                                ,btn: '确定'
                            });
                            return;
                        }else{
                            form.confirmNodeId_ = $(selectNode[0]).val();
                            form.toSelectGotoUser();
                            layer.close(index);
                        }                        
                    }
                  });
            }
        });
    },
    submit: function () {     
        form.submitType_ = "GOTO";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}
//终止相关
form.type["Stop"] = {
    show: function () {
        layer.open({
            content: '是否要终止该流程'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                form.type["Stop"].submit()
              layer.close(index);
            }
        });
    },
    submit: function () {
        form.submitType_ = "STOP";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
        
    }
}

// 暂停
form.type["Suspend"] = {
    show: function () {   
        layer.open({
            content: '是否要暂停该流程'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                form.type["Suspend"].submit()
                layer.close(index);
            }
        });
    },
    submit: function () {
        form.submitType_ = "SUSPEND";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}
// 恢复
form.type["Resume"] = {
    show: function () {
        layer.open({
            content: '是否要恢复该流程'
            ,btn: ['确定', '取消']
            ,yes: function(index){
                form.type["Resume"].submit()
                layer.close(index);
            }
        });
    },
    submit: function () {
        form.submitType_ = "RESUME";
        form.signInfo_ = $("#workflowBean\\.signInfo_").val();
        form.message_ = $("#workflowBean\\.message_").val();
        form.suggestId_ = $("#workflowBean\\.suggestId_").val();
        var flowStatus = $("#workflowBean\\.flowStatus_").val();
        if (flowStatus == "CREATE") {
            if (insert(flowStatus)) {
            }
        } else {
            if (update(flowStatus)) {
            }
        }
    }
}
var flowVariable = {};
//获得流程表单变量
flowVariable.getFlowVariable = function (curNodeId_, definitionId_) {
    var returnValue = ["{"];
    returnValue.push('"curNodeId_": "' + curNodeId_ + '"');
    returnValue.push(',"definitionId_": "' + definitionId_ + '"');
    $("[flowVariable]").each(function () {
        var item = $(this);
        var key = item.attr("flowVariable");
        returnValue.push(',"workflowVar_[' + key + ']": "' + item.val() + '"');
    })
    returnValue.push("}");
    return returnValue;
}

form.getNextNodes = function(){
    var formDataJson = flowVariable.getFlowVariable($("#workflowBean\\.curNodeId_").val(), $("#workflowBean\\.definitionId_").val()).join('');
    $.ajax({
        url: baseUrl + '/api/wk/getNextNodes.action',
        type: 'post',
        data: eval('(' + formDataJson + ')'),
        success: function(data){
            if(data.code=='000000'){
                var nextNodesList = data.data.nextNodesList
                var choice = data.data.curNode.choice
                var nodesHtml = "";
                for (var i = 0; i < nextNodesList.length; i++) {
                    if (choice == "single") {
                        nodesHtml += "<li><span>"+nextNodesList[i].name+"</span><input type='radio' name='selectNodes' value='" + nextNodesList[i].componentId + "' /></li>";
                    } else {
                        nodesHtml += "<li><span>"+nextNodesList[i].name+"</span><input type='checkbox' name='selectNodes' value='" + nextNodesList[i].componentId + "' /></li>";
                    }
                }
                $("#nodesDiv").html(nodesHtml);
                $("#nodesDiv li:first-child input").attr('checked','checked');
                var nextNodeId = $('input[name="selectNodes"]').filter(':checked').val();
                form.toSelectUser(nextNodesList,nextNodeId);
                $('#nodesDiv').on('click', 'li', function(){
                    var nextNodeId = $(this).find('input[name="selectNodes"]').val();
                    form.toSelectUser(nextNodesList,nextNodeId)
                })
            }
        }
    })
}
form.toSelectGotoUser = function () {
    $.ajax({
        url: baseUrl + '/api/jcdept/getCustomerDeptAndUser.action',
        data: {
            nowCustomerOrgId:$('#customerOrg').val()
        },
        success: function(data){
            var user = [];
            var assigness = form.showAll(data,user);
            var personHtml = '';
            for (var j = 0; j < assigness.length; j++) {
                personHtml += '<li>'
                        +'<input name="users" type="radio" value='+assigness[j].id+'>'
                        +'<span>'+assigness[j].displayName+'</span>'
                        +'</li>';
            }     
            layer.open({
                type: 1
                ,content: '<ul id="gotoUserSelectValue">'+personHtml+'</ul>'
                ,style: 'width: 600px;'
                ,btn: ['确定', '取消']
                ,yes: function(index){
                    var selectUsers = ($('#gotoUserSelectValue input[name="users"]').filter(':checked'));
                    if (selectUsers.length == 0) {
                        layer.open({
                            content: '请选择人员'
                            ,btn: '确定'
                        });
                        return;
                    }else{
                        $.each($('#gotoUserSelectValue input[name="users"]'),function(){
                            if($(this).index()==0){
                                form.confirmUserId_ = $(this).val();
                            }else{
                                form.confirmUserId_ += ','+$(this).val();
                            }
                        })
                        form.type["Goto"].submit();
                        layer.close(index);
                    }
                }
            });
        }
    }) 
},
form.toSelectUser = function(nextNodesList,nextNodeId){ 
        $('#chooseUser').html('');$('#selectedUser').html('');
        for (var x = 0; x < nextNodesList.length; x++) {     
            if (nextNodeId == nextNodesList[x].componentId) {
                var confirmSequences = "";
                $(nextNodesList[x].channel).each(function (index, item) {
                    if (confirmSequences == "") {
                        confirmSequences = item.sequenceId;
                    } else {
                        confirmSequences += "&" + item.sequenceId;
                    }
                })
                form.confirmNodeId_ = nextNodeId;
                form.confirmRouteId_ = confirmSequences;
                if (nextNodesList[x].type == "end") {
                    $('#nextNodesType').val('end');
                    return;
                }
                if (nextNodesList[x].userType == "2") {
                    if (nextNodesList[x].assignees.length != 0) {
                        var assigness = nextNodesList[x].assignees;
                        var str = '';
                        for (var j = 0; j < assigness.length; j++) {
                            str += '<li>'
                                        +'<input name="users" class="users" type="checkbox" value='+assigness[j].id+'>'
                                        +'<span>'+assigness[j].name+'</span>'
                                    +'</li>';
                        }
                        $('#chooseUser').html(str);
                    }
                }
               
                //配置人员为空,显示人员选择
                if (nextNodesList[x].assignees.length == 0) {
                    form.getAllUser(nextNodesList[x]);
                    
                }else{
     
                    var assigness = nextNodesList[x].assignees;
                    var assigneesIds = "", assigneesNames = "";
                    for (var i = 0; i < assigness.length; i++) {
                        if (assigneesIds != "") {
                            if (assigness[i].oldName != null) {
                                assigneesIds += "," + assigness[i].oldId;
                                assigneesNames += ",(" + assigness[i].oldName + ")委托给(" + assigness[i].name + ")";
                            } else {
                                assigneesIds += "," + assigness[i].id;
                                assigneesNames += "," + assigness[i].name;
                            }
                        } else {
                            if (assigness[i].oldName != null) {
                                assigneesIds = assigness[i].oldId;
                                assigneesNames += "(" + assigness[i].oldName + ")委托给(" + assigness[i].name + ")";
                            } else {
                                assigneesIds = assigness[i].id;
                                assigneesNames += assigness[i].name;
                            }
                        }
                    }
                    $('#selectedUser').html("<li data-id=" + assigneesIds + ">" + assigneesNames + "</li>"); 
                    $.each($('#selectedUser li'),function(){
                        if($(this).index()==0){
                            form.confirmUserId_ = $(this).data('id');
                        }else{
                            form.confirmUserId_ += ','+$(this).data('id');
                        }
                    })
                }
            }
        }
}
form.getAllUser = function(nextNodesList){
    $.ajax({
        url: baseUrl + '/api/jcdept/getCustomerAndJcAllDeptAndUser.action',
        success: function(data){
            var user = [];
    
            var assigness = form.showAll(data,user);
            //单一签核(人员树单选)
            if (nextNodesList.dealType == 4) {
                var str = '';
                for (var j = 0; j < assigness.length; j++) {
                    str += '<li>'
                        +'<input name="users" class="users" type="radio" value='+assigness[j].id+'>'
                        +'<span>'+assigness[j].displayName+'</span>'
                        +'</li>';
                }
                $('#chooseUser').html(str);
            }
            //多人处理及多人单一签核(人员树多选)
            else {
                var str = '';
                for (var j = 0; j < assigness.length; j++) {
                    str += '<li>'
                    +'<input name="users" class="users" type="checkbox" value='+assigness[j].id+'>'
                    +'<span>'+assigness[j].displayName+'</span>'
                    +'</li>';
                    }
                $('#chooseUser').html(str);
            }
            $('#chooseUser input[name=users]').click(function(){
                var str = '';
                $.each($('#chooseUser input[name=users]:checked'),function(){
                    var id = $(this).attr('value');
                    var name = $(this).next().text();
                    str+="<li data-id=" + id + ">" + name + "</li>"
                })
                $('#selectedUser').html(str);
            })
            
        }
    })
}

form.showAll = function(data,user){
    all(data,user);
    return user;
}
function all(data,users){
    data.forEach(function(v,k){
        if(v.subDept){
            all(v.subDept,users)
        }
        v.user.forEach(function(j){
            users.push(j);
        })
    })
}
form.initButton = function (workflowBean) {
    var openType = workflowBean.openType_;
    var lastOperType = workflowBean.lastOperType_;
    var buttonJsonStr = workflowBean.buttonJsonStr;
    if (buttonJsonStr == "") {
        return;
    }
    var buttonJson = eval("(" + buttonJsonStr + ")");
    var buttonHtml = [];
    //<button class='btn dark' id='workflowSubmitBtn' type='button'>提交</button>
    //加载待办按钮
    //1 Submit
    //2 Save
    //3 Reject
    //4 Move
    //5 Goto
    //6 Stop
    //7 Suspend
    //8 Resume
    //1001 GetBack
    if (openType == "TODO") {
        var todoButtonList = buttonJson.todoSystemList;
        if (typeof todoButtonList != "undefined") {
            for (var i = 0; i < todoButtonList.length; i++) {
                if (todoButtonList[i].selected) {
                    if("TODO" == openType){
                        //当前是暂停状态，则允许回复和拿回
                        if("SUSPEND" == lastOperType){
                            if(todoButtonList[i].id == '8'){
                                buttonHtml.push("<button class='btn dark' id='workflowButtonId" + todoButtonList[i].id + "' type='button'>" + todoButtonList[i].name + "</button>");
                            }
                        } else{
                            //允许提交，转单，暂停
                            if(todoButtonList[i].id == '1'){
                                buttonHtml.push("<button class='btn dark' id='workflowButtonId" + todoButtonList[i].id + "' type='button'>" + todoButtonList[i].name + "</button>");
                            } else  if(todoButtonList[i].id == '4'){
                                buttonHtml.push("<button class='btn dark' id='workflowButtonId" + todoButtonList[i].id + "' type='button'>" + todoButtonList[i].name + "</button>");
                            } if(todoButtonList[i].id == '7'){
                                buttonHtml.push("<button class='btn dark' id='workflowButtonId" + todoButtonList[i].id + "' type='button'>" + todoButtonList[i].name + "</button>");
                            }
                        }
                    } else if("CREATE" == openType){
                        //创建只允许提交
                        if(todoButtonList[i].id == '1'){
                            buttonHtml.push("<button class='btn dark' id='workflowButtonId" + todoButtonList[i].id + "' type='button'>" + todoButtonList[i].name + "</button>");
                        }
                    } else {
                        buttonHtml.push("<button class='btn dark' id='workflowButtonId" + todoButtonList[i].id + "' type='button'>" + todoButtonList[i].name + "</button>");
                    }
                }
            }
        }
    }
    //加载已办按钮
    else if (openType == "DONE") {
        var doneButtonList = buttonJson.haveSystemList;
        if (typeof doneButtonList != "undefined") {
            for (var i = 0; i < doneButtonList.length; i++) {
                if (doneButtonList[i].selected) {
                    buttonHtml.push("<button class='btn dark' id='workflowButtonId" + doneButtonList[i].id + "' type='button'>" + doneButtonList[i].name + "</button>");
                }
            }
        }
    }
    console.log($("#workflowFormButton"))
    $("#workflowFormButton").html(buttonHtml.join(''));
}    

form.showRoute = function (type) {
    // var workId = $("#workId").val();
    //将意见赋值到隐藏域
    if ((navigator.userAgent.indexOf("Chrome") == -1) && (navigator.userAgent.indexOf("Firefox") == -1) && document.all.DWebSignSeal != null) {
        var v = document.all.DWebSignSeal.GetStoreData();
        var signInfoFlag = $("#workflowBean\\.signInfoFlag_").val();
        if (signInfoFlag == "true") {
            $("#workflowBean\\.signInfo_").val(v);
        }
    }
    var suggestEle = $("[workflowSuggest]").find("textarea");
    if (suggestEle.length > 0) {
        suggestEle = $(suggestEle.get(0));
        $("#workflowBean\\.message_").val(suggestEle.val().replace(/\n|\r\n/g,"<br>").replace(/\s/g,"&nbsp;"));
        $("#workflowBean\\.suggestId_").val(suggestEle.parents("[workflowSuggest]").attr("id"));
        // $("#workflowBean\\.signContainerId_").val(suggestEle.parents("[workflowSuggest]").find("[signContainer]").attr("id"));
    }
    form.type[type].show();
}

// Zepto(function ($) {
//     $("#workflowFormButton").on('click','button',function(){
//         if($(this).attr('id')=='workflowButtonId1'){
//             form.showRoute("Submit");
//         }else if($(this).attr('id')=='workflowButtonId2'){
//             form.showRoute("Save");
//         }else if($(this).attr('id')=='workflowButtonId3'){
//             form.showRoute("Reject");
//         }else if($(this).attr('id')=='workflowButtonId4'){
//             form.showRoute("Move");     
//         }else if($(this).attr('id')=='workflowButtonId5'){
//             form.showRoute("Goto");    
//         }else if($(this).attr('id')=='workflowButtonId6'){
//             form.showRoute("Stop");    
//         }else if($(this).attr('id')=='workflowButtonId7'){
//             form.showRoute("Suspend");       
//         }else if($(this).attr('id')=='workflowButtonId8'){
//             form.showRoute("Resume");
//         }else if($(this).attr('id')=='workflowButtonId1001'){
//             form.showRoute("GetBack");   
//         }
//     }) 
// });
export default form
