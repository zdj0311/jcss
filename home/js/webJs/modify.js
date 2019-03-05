var pageName = '修改信息';
var modifyInfo = {};

modifyInfo.get = function(){
    $.ajax({
        url: baseUrl + '/api/wx/user/info.action',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            $("#entityForm #orgName").val(data.data.orgName);
            $("#entityForm #userName").val(data.data.userName);
            $("#entityForm #mobile").val(data.data.mobile);
            $("#entityForm #roomNo").val(data.data.roomNo);
            $("#entityForm #duty").val(data.data.dutyValue);
            $("#entityForm #cardNo").val(data.data.cardNo);
            publicPanel.loadDataDic("entityForm", "selectModel", "dutyId", data.data.duty, 'duty');
        },
        error: function () { },
    });
};
modifyInfo.uncertified = function() {
  var formData = $("#entityForm").serializeArray();
  $.ajax({
    url: baseUrl + "/api/wx/user/maintain.action",
    type: "POST",
    dataType: "json",
    data: formData,
    success: function(data) {
      // console.log(data);
      if (data.success == true) {
        window.location.href = "/jcss/jcss_app/home/authentication.html";
      } else {
        alert("发送失败");
      }
    },
    error: function() {}
  });
};
$(document).ready(function () {
    modifyInfo.get();
    $('#save').click(function () {
        modifyInfo.uncertified();
    });
})