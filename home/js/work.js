var createWork = {};
Zepto(function ($) {
    //展开收起
    $(".drop").on("click",function(){
        if($(this).hasClass("dropDown")){
            $(".unfold").css("height","100%");
            $(this).html("收起选添项<i></i>").removeClass("dropDown")
        }else{
            $(".unfold").css("height","0px");
            $(this).html("展开选添项<i></i>").addClass("dropDown")
        }
    });
    $('#files').change(function(){
        var files = document.getElementById('files').files
        for(var i=0;i<files.length;i++){
            var formData = new FormData();
            formData.append('businessId',0);
            formData.append('businessTable','ABC_CASES_DATA');
            formData.append('category','ABC_CASES_DATA');
            formData.append('file',files[i]);
            createWork.upload(formData);
        }
    })
    $('#fileList').on('click','.delete',function(){
        var id = $(this).parent().data('id');
        $.ajax({
            type: 'post',
            url: baseUrl+"/api/wx/attach/delete.action",  
            data: {ids:id},
            success: function(data){
               for(i in data){
                   if(data[i]==true);
                   $('#fileList').find('li[data-id="'+i+'"]').remove();
                   if($('#deleteAttachFile').val()==''){
                      $('#deleteAttachFile').val(i)
                   }else{
                      $('#deleteAttachFile').val($('#deleteAttachFile').val()+','+i)
                   }
               }
               
            }
        })
      
      })
    
});
Date.prototype.Format = function (fmt) { //author: meizz 
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

createWork.loadDataDic = function(elementId,url,param,mobileSelect){
    $.ajax({
        url: baseUrl + url,
        data: param,
        success : function(data) {
        
            if(elementId!='projectId' && elementId!='subProjectId' && elementId!='customer'){
                $('#'+elementId).val(data.data[0].code);
                $('#'+elementId+'Value').val(data.data[0].name);
                
            }
           
            var dataNew = [];
            if(elementId=='customer'){
                var user = [];
                user = form.showAll(data,user);
                
                for(var i=0;i<user.length;i++){
                    dataNew[i] = {
                        id: user[i]['id'],
                        value: user[i]['displayName']
                    };
                }
                
            }else if(data.data && data.data.length>0){
            
                for(var i=0;i<data.data.length;i++){
                
                    if(elementId=='projectId'){
                        dataNew[i] = {
                            id: data.data[i]['id'],
                            value: data.data[i]['projectName'],
                        };
                    }else if(elementId=='subProjectId'){
                        dataNew[i] = {
                            id: data.data[i]['id'],
                            value: data.data[i]['subProjectName'],
                        };
                    }else{
                        dataNew[i] = {
                            id: data.data[i]['code'],
                            value: data.data[i]['name'],
                        };
                    }
                    
                }
                
            
                if(elementId=='customName'){
        
                    createWork.getAssetType(data.data[0].code);
                    createWork.startWorkflow(data.data[0].code,$('#busiType').val());
                    $('#customName').val(data.data[0].code)
                    
                    createWork.loadDataDic("customer",'/api/jcdept/getCustomerDeptAndUser.action',{nowCustomerOrgId: data.data[0].code},createWork.mobileSelect2);
                    createWork.loadDataDic("projectId",'/api/wk/dic/projectDicList.action',{customerId: data.data[0].code},createWork.mobileSelect5);
                
                    createWork.loadDataDic("busiType",'/api/wk/dic/btDicList.action',null,createWork.mobileSelect3);
                
                }
    
                if(elementId=='busiType'){
                    createWork.startWorkflow($('#customName').val(),$('#busiType').val());
                }
            
            }
        
            mobileSelect.updateWheel(0,dataNew);
            
        }
    });
}
createWork.mobileSelect = function(elementId,callback){
    return new MobileSelect({
        trigger: '#'+elementId+'Value',
        wheels: [
            {data:[{'id':'',value:''}]}
        ],
        transitionEnd:function(indexArr, data){
            //console.log(data);
        },
        callback:function(indexArr, data){
            $('#'+elementId).val(data[0].id);
            $('#'+elementId+'Value').val(data[0].value);
            if(callback){
                callback(data[0]);
            }
        }
    });
}


createWork.upload = function(formData){
$.ajax({
        type: "POST",
        data: formData,   
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        mimeType:"multipart/form-data",      
        url: baseUrl+"/api/wx/attach/upload.action",      
        success: function (data) {
            
            var str = '';
            $.each(data.files,function(i,item){
                str+='<li class="photoList" data-id="'+item.id+'"><label class="auTitle">'+item.name+'</label><div class="delect delete"></div></li>'
            })
            $('#fileList').append(str);
        },
    });

}

