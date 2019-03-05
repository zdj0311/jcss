createWork.init = function(){
    createWork.loadWorkflow();
    createWork.addRelAssetsListDlg();
}
createWork.addRelAssetsListDlg = function(){
    $('#addRelAssetsListDlgButton').click(function(){
        $.ajax({
            url: baseUrl + '/api/wk/dic/assetsList.action',
            data: {
                customerId:createWork.customerOrg,
                assetsTypeId:createWork.assetTypeId
            },
            success: function(data){
                if(data.code=='000000'){
                    
                    var html="";
                    $.each(data.data,function(i,item){
                        html +='<li><input type="checkbox" value="'+item.id+'" ><span>'+item.assetsName+'</span></li>';
                    }) 
                    layer.open({
                        type: 1
                        ,content: '<ul id="assetsRelListModal">'+html+'</ul>'
                        ,style: 'width: 600px;'
                        ,btn: ['确定', '取消']
                        ,yes: function(index){
                            var assets=$('#assetsRelListModal li input').filter(':checked');
                            if(assets.length>0){
                                var str='';                         
                                $.each(assets,function(i,item){
                                    str +='<li data-id="'+$(item).val()+'"><div class="delect delete-assets"></div><span>'+$(item).next().text()+'</span></li>';
                                })
                                $('#assetsRelList').html(str);
                                layer.close(index);
                            }else{
                                layer.open({
                                    content: '请选择要关联的设备'
                                    ,btn: '确定'
                                  });
                            }
                            
                        }
                    });
                }
            }
        })
    })
    $('#assetsRelList').on('click','.delete-assets',function(){
        var id = $(this).parents('li').data('id');
        $('#assetsRelList').find('li[data-id="'+id+'"]').remove();
    })
}
createWork.getCommon = function(){ 
    createWork.mobileSelect4 = createWork.mobileSelect("urgency")
    createWork.loadDataDic("urgency",'/api/wk/dic/dicList.action',{code:'urgency',parentCode:'jcss'},createWork.mobileSelect4);   
}
createWork.getQueryString = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 
createWork.loadWorkflow = function(){
    $.ajax({
        url: baseUrl + '/api/wk/loadWorkflow.action',
        data: {
            id: createWork.getQueryString('id') || 147
        },
        success: function(data){
            if(data.code=='000000'){
                var billData = data.data.billData;
                createWork.appUser = billData.appUser;
                createWork.appUserName = billData.appUserName;
                createWork.appUserPhone = billData.appUserPhone;
                createWork.startTime = billData.actStartTime;  
                createWork.modifyDate = billData.modifyDate;
                createWork.status = billData.status;
                createWork.statusValue = billData.statusValue;
                createWork.code = billData.code;
                createWork.customerOrg = billData.customerOrg;
                createWork.customerOrgName = billData.customerOrgName;
                createWork.customer = billData.customer;
                createWork.customerName = billData.customerName;
                createWork.busiTypeCode = billData.busiTypeCode;
                createWork.busiTypeName = billData.busiTypeName;
                createWork.urgency = billData.urgency;
                createWork.urgencyValue = billData.urgencyValue;
                
                createWork.planStartTime = billData.planStartTime;
                createWork.planEndTime = billData.planEndTime;
                $('#appUserName').text(createWork.appUserName);
                $('#appUserPhone').text(createWork.appUserPhone);
                $('#startTime').text(createWork.startTime);
                $('.customerOrg').val(billData.customerOrg);
              
             
                createWork.subject = billData.subject;
                createWork.billPlan = billData.billPlan;
                createWork.projectId = billData.projectId;
                createWork.projectName = billData.projectName;
                createWork.subProjectId = billData.subProjectId;
                createWork.subProjectName = billData.subProjectName;
                createWork.assetTypeId = billData.assetTypeId;
                createWork.assetTypeName = billData.assetTypeName;
                
                createWork.billAssess = billData.billAssess;
                createWork.publishSuggest = billData.publishSuggest;

                $('.statusValue').text(billData.statusValue);
                $('#code').text(billData.code);
                $('#customerOrgName').text(billData.customerOrgName);
                $('#customerName').text(billData.customerName);
                $('#busiTypeName').text(billData.busiTypeName);
                $('#urgency').val(billData.urgency);
                $('#urgencyValue').text(billData.urgencyValue);
                $('#planEndTime').text(billData.planEndTime);
                $('.subject').text(billData.subject);
                $('#billPlan').text(billData.billPlan);
                $('#projectName').text(billData.projectName);
                $('#subProjectName').text(billData.subProjectName);
                $('#assetTypeName').text(billData.assetTypeName);
                form.initButton(data.data.workflowBean);
                createWork.curNodeId_ = data.data.workflowBean.curNodeId_;
                createWork.definitionId_ = data.data.workflowBean.definitionId_;
                $("#workflowBean\\.curNodeId_").val(createWork.curNodeId_);
                $("#workflowBean\\.definitionId_").val(createWork.definitionId_);
                
                createWork.subProcessId_ = data.data.workflowBean.subProcessId_;
                createWork.taskId_ = data.data.workflowBean.taskId_;
                createWork.instanceId_ = data.data.workflowBean.instanceId_;
                createWork.wUserType = data.data.wUserType;
                createWork.wCustomerUserId = data.data.wCustomerUserId;
                $("[flowVariable]").each(function () {
                    var item = $(this);
                    var key = item.attr("flowVariable");
                    $(this).val(createWork[key])
                })
                // 资产
                var html="";
                $.each(data.data.caseAssetsList,function(i,item){
                    html +='<li data-id="'+item.id+'"><div class="delect delete-assets"></div><span>'+item.assetName+'</span></li>';
                }) 
                $("#assetsRelList").html(html); 
                // 附件
                var str = '';
                $.each(data.data.attachList,function(i,item){
                    str+='<li class="photoList" data-id="'+item.id+'"><a href="'+baseUrl+item.url+'"><label class="auTitle">'+item.name+'</label></a><div class="delect"></div></li>'
                })
                $('#fileList').append(str);

                $("#workflowBean\\.signInfo_").val(data.data.workflowBean.signInfo_);
                $("#workflowBean\\.flowStatus_").val(data.data.workflowBean.flowStatus_);
                $("#workflowBean\\.buttonOptJsonStr").val(data.data.workflowBean.buttonOptJsonStr);

                form.getNextNodes();


                // 是否可编辑
                createWork.isEdit(data.data.workflowConfig.canEditBillRes,'billResult',billData.billRes)// 事件结果
                createWork.isEdit(data.data.workflowConfig.canEditEvaluate,'publishSuggest',billData.publishSuggest)// 评价
                createWork.isEdit(data.data.workflowConfig.canEditEvaluate,'publishSuggestScore',billData.billAssess)// 评价等级
                createWork.isEdit(data.data.workflowConfig.canEditUrgency,'urgencyEdit',billData.urgencyValue)// 紧急程度
                createWork.isEdit(data.data.workflowConfig.workOrderSuggest,'workOrderSuggest','')// 意见
                createWork.isEdit(data.data.workflowConfig.canEditAttach,'uploadFile','')// 附件
                createWork.isEdit(data.data.workflowConfig.canRelAssets,'addRelAssetsListDlgButton','')// 资产
            }
        }
    })
}
createWork.isEdit = function(canEdit,elementId,value){
    if(elementId=='addRelAssetsListDlgButton'){
        if(canEdit=='edit'){
            $('#'+elementId).show();
        }else if(canEdit=='readonly'){
            $('#'+elementId).hide();
            $('.delete-assets').hide();
        }else if(canEdit=='hidden'){
            $('#'+elementId).parents('li').html('')
        }else{
            $('#'+elementId).prev().find('i').html('*');
            $('#'+elementId).show();
        }
    }else if(elementId=='uploadFile'){
        if(canEdit=='edit'){
            $('#'+elementId).show();
            $('attachFileMode').val('EDIT');
        }else if(canEdit=='readonly'){
            $('#'+elementId).hide();
            $('.delete').hide();
        }else if(canEdit=='hidden'){
            $('#'+elementId).parents('li').html('')
        }else{
            $('#'+elementId).prev().find('i').html('*');
            $('#'+elementId).show();
        }
    }else if(elementId=='publishSuggestScore'){
        var readOnlyValue = null;
        if(canEdit=='edit'){
            $('#publishSuggestScore').html('<div id="score-demo"></div>');
        }else if(canEdit=='readonly'){
            $('#publishSuggestScore').html('<div id="score-demo"></div>');
            readOnlyValue = true;
        }else if(canEdit=='hidden'){
            $('#publishSuggestScore').parents('li').html('')
        }else{
            $('#publishSuggestScore').prev().find('i').html('*');
            $('#publishSuggestScore').html('<div id="score-demo"></div>');
        }
        $.ajax({
            url: baseUrl+'/api/wk/dic/dicList.action',
            data: {
                code: 'pj_level',
                parentCode: 'jcss'
            },
            success: function(data){
                if(data.code=='000000'){
                    var score,name='';
                    $.each(data.data,function(i,item){  
                        if(value==item.code){
                            name = item.name;
                        } 
                    })
                    switch(name){              
                        case '':               
                            score = ''         
                            break;              
                        case "null":               
                            score = '';                  
                            break;               
                        case '非常满意':               
                            score = 5;                
                            break; 
                        case '比较满意':               
                            score = 4;               
                            break;
                        case '满意':               
                            score = 3; 
                            break;
                        case '不满意':               
                            score = 2;              
                            break;   
                        case '非常不满意':               
                            score = 1;              
                            break;                                  
                            default:
                    } 
                    
                    $('#score-demo').raty({
                        score: score,
                        readOnly:readOnlyValue,
                        click: function(score, evt) {
                            var zname,zscore;
                            switch(score){                            
                                case 5:               
                                    zname = '非常满意';                
                                    break; 
                                case 4:               
                                    zname = '比较满意';               
                                    break;
                                case 3:               
                                    zname = '满意'; 
                                    break;
                                case 2:               
                                    zname = '不满意';              
                                    break;   
                                case 1:               
                                    zname = '非常不满意';              
                                    break;                                  
                                    default:
                            } 
                            $.each(data.data,function(i,item){  
                                if(zname==item.name){
                                    zscore = item.code;
                                } 
                            })
                            $('#billAssess').val(zscore)
                        }
                    });
                }
            }
        })
        
    }else if(elementId=='urgencyEdit'){
        if(canEdit=='edit'){
            $('#'+elementId).html('<input type="hidden" id="urgency"><input type="text"  placeholder="请选择" value='+value+' readonly id="urgencyValue">');
            createWork.getCommon();
        }else if(canEdit=='readonly'){
            $('#'+elementId).html('<input type="hidden" id="urgency"><input type="text"  placeholder="请选择" value='+value+' readonly id="urgencyValue">');
        }else if(canEdit=='hidden'){
            $('#'+elementId).parent('li').html('')
        }else{
            $('#'+elementId).prev().find('i').html('*');
            $('#'+elementId).html('<input type="hidden" id="urgency"><input type="text"  placeholder="请选择" value='+value+' readonly id="urgencyValue">');
            createWork.getCommon();
        }
    }else{
        if(canEdit=='edit'){
            $('#'+elementId).html('<textarea placeholder="请输入" value='+value+'></textarea>')
        }else if(canEdit=='readonly'){
            $('#'+elementId).html('<textarea placeholder="请输入" readonly style="background:#efefef" value='+value+'></textarea>')
        }else if(canEdit=='hidden'){
            $('#'+elementId).parents('li').html('')
        }else{
            $('#'+elementId).prev().find('i').html('*');
            $('#'+elementId).html('<textarea placeholder="请输入" value='+value+'></textarea>')
        }
    }
}
function update(){
        createWork.urgency = $('#urgency').val();
        createWork.urgencyValue = $('#urgencyValue').val();
        createWork.publishSuggest = $('#publishSuggest').val();
        createWork.billAssess = $('#billAssess').val();

        var attachFile = '';
        var deleteAttachFile = $('#deleteAttachFile').val();
        var attachFileMode = $('#attachFileMode').val();
        $.each($('#fileList li'),function(i){
            nowIds = $(this).data('id');
            if(i==0){
                attachFile +=nowIds;
            }else{
                attachFile +=","+nowIds;
            }
        })

        
        var assetsRelList = '';
        $.each($('#assetsRelList li'),function(i){
            nowIds = $(this).data('id');
            if(i==0){
                assetsRelList +=nowIds;
            }else{
                assetsRelList +=","+nowIds;
            }
            
        })
    
        if(form.submitType_=='SUBMIT'){
            if(form.confirmNodeId_==undefined){
                layer.open({
                    content: '请选择节点信息'
                    ,btn: '确定'
                });
                return false;
            }
            if(form.confirmUserId_=='' && $('#nextNodesType').val()!='end'){
                layer.open({
                    content: '请选择人员'
                    ,btn: '确定'
                });
                return false;
            }
        }
        
        $.ajax({
            url: baseUrl + '/api/wk/updateWorkflow.action',
            type: 'post',
            contentType: "application/x-www-form-urlencoded; charset=utf-8", 
            data: {
                id: createWork.getQueryString('id') || 117,
           
                modifyDateStr: createWork.modifyDate,
                appUser: createWork.appUser,
                appUserName: createWork.appUserName,
                appUserPhone: createWork.appUserPhone,
                status: createWork.status,
                statusValue: createWork.statusValue,
                code: createWork.code,
                customerOrg: createWork.customerOrg,
                customerOrgName: createWork.customerOrgName,
                customer: createWork.customer,
                customerName: createWork.customerName,
                busiTypeCode: createWork.busiTypeCode,
                busiTypeName: createWork.busiTypeName,
                urgency: createWork.urgency,
                urgencyValue: createWork.urgencyValue,
                planStartTimeStr: createWork.planStartTime,
                planEndTimeStr: createWork.planEndTime,
                subject: createWork.subject,
                billPlan: createWork.billPlan,
                projectId: createWork.projectId,
                projectName: createWork.projectName,
                subProjectId: createWork.subProjectId,
                subProjectName: createWork.subProjectName,
                assetTypeId: createWork.assetTypeId,
                assetTypeName: createWork.assetTypeName,
                billAssess: createWork.billAssess,
                publishSuggest: createWork.publishSuggest,
                assetsRelList:assetsRelList,
                attachFile:attachFile,
                deleteAttachFile:deleteAttachFile,
                attachFileMode:attachFileMode,

                "workflowBean.curNodeId_":createWork.curNodeId_,
                "workflowBean.definitionId_":createWork.definitionId_,
                "workflowBean.confirmUserId_":form.confirmUserId_,
                "workflowBean.confirmNodeId_":form.confirmNodeId_,
                "workflowBean.confirmRouteId_":form.confirmRouteId_,
                "workflowBean.workflowVar_['wUserType']": createWork.wUserType,
                "workflowBean.workflowVar_['wCustomerUserId']": createWork.wCustomerUserId,
                "workflowBean.taskId_":createWork.taskId_,
                "workflowBean.instanceId_":createWork.instanceId_,
                "workflowBean.signInfo_":form.signInfo_, 
                "workflowBean.message_":form.message_,
                "workflowBean.suggestId_":form.suggestId_,
                "workflowBean.submitType_":form.submitType_   
               

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

createWork.init();