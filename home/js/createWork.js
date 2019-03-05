createWork.init = function(){  
    createWork.getUserInfo();
    createWork.getCommon();
}
createWork.getUserInfo = function(){
    $.ajax({
        url: baseUrl + '/api/wx/user/info.action',
        success: function(data){
            if(data.code=='000000'){
                createWork.appUser = data.data.userId;
                createWork.appUserName = data.data.userName;
                createWork.appUserPhone = data.data.mobile;
                createWork.startTime = new Date().Format("yyyy-MM-dd hh:mm:ss");  
                createWork.userBusiType = data.data.userBusiType; 
                $('#appUserName').text(createWork.appUserName);
                $('#appUserPhone').text(createWork.appUserPhone);
                $('#startTime').text(createWork.startTime);
            }
        }
    })
}
createWork.getCommon = function(){
    new rolldate.Date({
        el:'#date4',
        format:'YYYY-MM-DD hh:mm:ss',
        beginYear:2000,
        endYear:2100
    })
    // 客户名称
    createWork.mobileSelect1 = createWork.mobileSelect("customName",function(data){
        
        createWork.getAssetType(data.id);
        createWork.startWorkflow(data.id,$('#busiType').val());
        $('#customName').val(data.id)
        
        createWork.loadDataDic("customer",'/api/jcdept/getCustomerDeptAndUser.action',{nowCustomerOrgId: data.id},createWork.mobileSelect2);
        createWork.loadDataDic("projectId",'/api/wk/dic/projectDicList.action',{customerId: data.id},createWork.mobileSelect5);
       
        
    })
    createWork.loadDataDic("customName",'/api/wk/dic/customerDicList.action',null,createWork.mobileSelect1);
    // 客户负责人
    createWork.mobileSelect2 = createWork.mobileSelect("customer")
    // 工单类型
    createWork.mobileSelect3 = createWork.mobileSelect("busiType",function(data){
        createWork.startWorkflow($('#customName').val(),data.id);
    })
    // 紧急程度
    createWork.mobileSelect4 = createWork.mobileSelect("urgency")
    createWork.loadDataDic("urgency",'/api/wk/dic/dicList.action',{code:'urgency',parentCode:'jcss'},createWork.mobileSelect4);
    // 项目
    createWork.mobileSelect5 = createWork.mobileSelect("projectId",function(data){
        createWork.loadDataDic("subProjectId",'/api/wk/dic/projectSubDicList.action',{customerId: $('#customName').val(),projectId:data.id},createWork.mobileSelect6); 
    })
    // 子项目
    createWork.mobileSelect6 = createWork.mobileSelect("subProjectId")
    
    $("#assetTypeId").on("click","li",function(){
        $(this).addClass("active").siblings().removeClass('active');
        var assetsTypeId = $(this).find('span').data('id');
        createWork.getAssetsList(assetsTypeId)
    });
    
}
createWork.getAssetsList = function(assetsTypeId){
    $.ajax({
        url: baseUrl + '/api/wk/dic/assetsList.action',
        data: {
            customerId:$('#customName').val(),
            assetsTypeId:assetsTypeId
        },
        success: function(data){
            if(data.code=='000000'){
                
                var html="";
                $.each(data.data,function(i,item){
                    html +='<li><input type="checkbox" value="'+item.id+'" ><span>'+item.assetsName+'</span></li>';
                }) 
                $("#assetsRelList").html(html); 
                
            }
        }
    })
}
createWork.getAssetType = function(customerId){
    $.ajax({
        url: baseUrl + '/api/wk/dic/assetsTypeList.action',
        data: {customerId:customerId},
        success: function(data){
            if(data.code=='000000'){
                var html="";
                $.each(data.data,function(i,item){
                    html +='<li><img src="'+baseUrl+item.iconUrl+'">'+
                    '<span data-id="'+item.id+'">'+item.assetsTypeName+'</span><i></i>'+
                    '</li>';
                }) 
                $("#assetTypeId").html(html); 
                $("#assetTypeId li:first-child").addClass('active');
                var assetsTypeId = $("#assetTypeId li.active").find('span').data('id');
                createWork.getAssetsList(assetsTypeId);
         
                $('#subject').val($('#customNameValue').val() + $("#assetTypeId li.active").find('span').text())
                $('#billPlan').val($('#customNameValue').val() + $("#assetTypeId li.active").find('span').text())
            }
        }
    })
}
function insert(){
        var customerOrg = $('#customName').val();
        var customer = $('#customer').val();
        var busiTypeCode = $('#busiType').val();
        var busiTypeName = $('#busiTypeValue').val();
        var subject = $('#subject').val();
        var billPlan = $('#billPlan').val();
        var assetTypeId = $('#assetTypeId li.active').find('span').data('id');
        var urgency = $('#urgency').val();
        var planEndTime = $('#date4').val();
        var projectId = $('#projectId').val();
        var subProjectId = $('#subProjectId').val();
        
        var attachFile = '';
        var deleteAttachFile = $('#deleteAttachFile').val();
        $.each($('#fileList li'),function(i){
            nowIds = $(this).data('id');
            if(i==0){
                attachFile +=nowIds;
            }else{
                attachFile +=","+nowIds;
            }
        })
        var assetsRelList = '';
        $.each($('#assetsRelList input:checked'),function(i){
            nowIds = $(this).attr('value');
            if(i==0){
                assetsRelList +=nowIds;
            }else{
                assetsRelList +=","+nowIds;
            }
            
        })
        
        
        var confirmUserId_ = '';

        $.each($('#selectedUser li'),function(){
            if($(this).index()==0){
                confirmUserId_ += $(this).data('id');
            }else{
                confirmUserId_ += ','+$(this).data('id');
            }
        })
    
        if(createWork.validation(customerOrg,customer,busiTypeCode,subject,billPlan,urgency,planEndTime,assetTypeId,form.confirmNodeId_,confirmUserId_)==false){
            return false;
        }
        
        $.ajax({
            url: baseUrl + '/api/wk/saveWorkflow.action',
            type: 'post',
            contentType: "application/x-www-form-urlencoded; charset=utf-8", 
            data: {
                appUser: createWork.appUser,
                appUserName: createWork.appUserName,
                appUserPhone: createWork.appUserPhone,
                startTimeStr: createWork.startTime,
                customerOrg:customerOrg,
                customer:customer,
                busiTypeCode:busiTypeCode,
                busiTypeName:busiTypeName,
                subject:subject,
                billPlan:billPlan,
                assetTypeId:assetTypeId,
                assetsRelList:assetsRelList,
                urgency:urgency,
                planEndTimeStr:planEndTime,
                projectId:projectId,
                subProjectId:subProjectId,
                attachFile:attachFile,
                deleteAttachFile:deleteAttachFile,
                attachFileMode:'EDIT',
                "workflowBean.curNodeId_":createWork.curNodeId_,
                "workflowBean.definitionId_":createWork.definitionId_,
                "workflowBean.confirmUserId_":confirmUserId_,
                "workflowBean.confirmNodeId_":form.confirmNodeId_,
                "workflowBean.confirmRouteId_":form.confirmRouteId_,
                "workflowBean.submitType_":'SUBMIT',
                "workflowBean.workflowVar_[wUserType]": createWork.userBusiType               
            },
            success: function(data){
                if(data.code=='000000'){
                    if(data.success==true){
                        layer.open({
                            content: '提交成功'
                            ,btn: ['确定']
                            ,yes: function(index){
                                window.location = '../home/tracking.html'
                                layer.close(index);
                            }
                        })
                    }
                }
            }
        })
   
}

createWork.validation = function(customerOrg,customer,busiTypeCode,subject,billPlan,urgency,planEndTime,assetTypeId,confirmNodeId_,confirmUserId_){
    if(customerOrg==''){
        layer.open({
            content: '客户名称不能为空'
        });
        return false;
    }
    if(customer==''){
        layer.open({
            content: '客户负责人不能为空'
        });
        return false;
    }
    if(busiTypeCode==''){
        layer.open({
            content: '工单类型不能为空'
        });
        return false;
    }
    if(subject==''){
        layer.open({
            content: '事件主题不能为空'
        });
        return false;
    }
    if(billPlan==''){
        layer.open({
            content: '事件描述不能为空'
        });
        return false;
    }
    if(urgency==''){
        layer.open({
            content: '紧急程度不能为空'
        });
        return false;
    }
    if(planEndTime==''){
        layer.open({
            content: '工单结束时间不能为空'
        });
        return false;
    }
    if(assetTypeId==''){
        layer.open({
            content: '资产分类不能为空'
        });
        return false;
    }
    if(confirmNodeId_==undefined){
        layer.open({
            content: '请选择节点信息'
        });
        return false;
    }
    if(confirmUserId_==''){
        layer.open({
            content: '请选择人员'
        });
        return false;
    }
    return true;
}
createWork.startWorkflow = function(customerOrg,busiTypeCode){
    if(customerOrg!='' && busiTypeCode!=''){
        $.ajax({
            url: baseUrl + '/api/wk/startWorkflow.action',
            data: {
                customerOrg:customerOrg,
                busiTypeCode:busiTypeCode
            },
            success: function(data){
                if(data.code=='000000'){
                    createWork.curNodeId_ = data.data.workflowBean.curNodeId_;
                    createWork.definitionId_ = data.data.workflowBean.definitionId_;
                    $("#workflowBean\\.flowStatus_").val(data.data.workflowBean.flowStatus_);
                    $("#workflowBean\\.buttonOptJsonStr").val(data.data.workflowBean.buttonOptJsonStr);
                    form.initButton(data.data.workflowBean);
                    $("#workflowBean\\.curNodeId_").val(createWork.curNodeId_);
                    $("#workflowBean\\.definitionId_").val(createWork.definitionId_);
                    $("#wUserType").val(createWork.userBusiType);
                    form.getNextNodes();
                }
            }
        })
    } 
}

createWork.init();