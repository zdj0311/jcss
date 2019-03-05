var authPanel = {};

authPanel.submitState = false;

//判断认证状态
authPanel.get = function () {
    $.ajax({
        url: baseUrl + '/api/wx/user/info.action',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            $("#reset").hide();
            $("#save").hide();
            $("#divButt").hide();
            $("#save").html("开始认证");
            if (data.data.userStatus == "UNRegister") {
                // 未注册
                $('#auth img').attr("src", staticBaseUrl + "/home/images/wrz.png");
                publicPanel.loadDataDic("entityForm", "selectModel", "dutyId", null, 'duty');
                $("#reset").show();
                $("#save").show();
                $("#divButt").show();
            } else if (data.data.userStatus == "register") {
                // 待审核
                $("#auth img").attr("src", staticBaseUrl + "/home/images/drz.png" );
                $('input:text').attr("readonly", "readonly");
                authPanel.bandData(data.data);
                $("#auhx").html($("#dutyValue").val());
                $("#auhx").show();
                $("#dutyValue").hide();
            } else if (data.data.userStatus == "created") {
                // 已注册
                $("#auth img").attr("src", staticBaseUrl + "/home/images/yesrz.png");
                authPanel.bandData(data.data);
                $("#save").show();
                $("#save").html("修改信息");
                $("#divButt").show();
            } else {
                // 不通过
                $("#auth img").attr("src",staticBaseUrl + "/home/images/czsb.png");
                authPanel.bandData(data.data);
                $("#save").show();
                $("#reset").hide();
                $("#save").html("重新认证");
                $("#divButt").show();
            }
        },
        error: function () {
        },
    });
};

authPanel.bandData = function (data) {
    publicPanel.loadDataDic("entityForm", "selectModel", "dutyId", data.duty, 'duty');
    //认证失败后 回显值
    $("#entityForm #orgName").val(data.orgIdValue);
    $("#entityForm #userName").val(data.userName);
    $("#entityForm #mobile").val(data.mobile);
    $("#entityForm #roomNo").val(data.roomNo);
    $("#entityForm #duty").val(data.dutyValue);
    $("#entityForm #cardNo").val(data.cardNo);
};

authPanel.uncertified = function() {
    if (authPanel.submitState) { 
        return 
    }
    authPanel.submitState = true;
    publicPanel.clearValidateStatus();
    if ($("#entityForm").valid()) {
        var formData = $("#entityForm").serializeArray();
        $.ajax({
            url: baseUrl + "/api/wx/user/maintain.action",
            type: "POST",
            dataType: "json",
            data: formData,
            success: function(data) {
                authPanel.submitState = false;
                if (data.success == true) {
                    publicPanel.messagebox('发送成功');
                    window.location.href = "/jcss/jcss_app/home/authentication.html";
                } else {
                    publicPanel.messagebox('发送失败');                    
                }
            },
            error: function () { 
                authPanel.submitState = false;
            }
        });
    } else {
        authPanel.submitState = false;
    }
};

$(document).ready(function () {
    authPanel.get();
    $("#reset").click(function() {
        $("#entityForm")[0].reset();
    });
    $('#save').click(function () {
        authPanel.uncertified();
    });
});

/****************** JQuery Validate ********************/
jQuery.validator.addMethod("common_check_carCode", function (value, element) {
    if (value == null || value == "") {
        return true;
    }
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
}, "请输入正确身份证号");

$("#entityForm").validate({
    ignore: 'ignore',
    //focusCleanup: true,
    //onkeyup: false,
    rules: {
        orgName: {
            required: true
        },
        userName: {
            required: true
        },
        mobile:{
            required: true,
            number: true,
            maxlength:11,
            minlength:11
        },
        cardNo: {
            common_check_carCode: true
        },
    },
    messages:{
        orgName: {
            required: '请输入客户名称'
        },
        userName: {
            required: "请输入姓名"
        },
        mobile: {
            required: "请输入联系电话",
            number: "联系电话仅可以输入数字",
            maxlength: "请输入正确联系电话",
            minlength: "请输入正确联系电话"
        }
    },
    errorPlacement: function (error, element) {
        publicPanel.messagebox(error[0].innerText);
        //element.closest("td").append(error);
    }
});