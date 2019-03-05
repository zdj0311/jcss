// var completeWork = {};
// var pageId = getUrlParam("id");
// completeWork.getDate = function () {
//     $.ajax({
//         url: baseUrl + '/api/wx/user/info.action',
//         type: 'POST',
//         dataType: 'json',
//         success: function (data) {
//             // alert(data.data.userName);
//             var loginName = data.data.userName;
//             return loginName;
//         },
//         error: function () { },
//     });
// }
// $(document).ready(function () {
//     completeWork.getDate();
// })

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

(function () {
    $.ajax({
        url: baseUrl + '/api/wk/loadWorkflow.action',
        data: {
            id: getQueryString("id") || 116
        },

        success: function (data) {
            var cname = ''
            switch (data.data.billData.status) {
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
            var content = '<span class="noHandle' + cname + '">' + data.data.billData.statusValue + '</span>' + data.data.billData.subject

            $("#title").html(content);
            $("#appUserName").html(data.data.billData.appUserName);
            $("#appUserPhone").html(data.data.billData.appUserPhone);
            $("#statusValue").html(data.data.billData.statusValue);
            $("#code").html(data.data.billData.code);
            $("#customerOrgName").html(data.data.billData.customerOrgName);
            $("#customerName").html(data.data.billData.customerName);
            $("#busiTypeName").html(data.data.billData.busiTypeName);
            $("#urgency").html(data.data.billData.urgencyValue);
            $("#planStartTime").html(data.data.billData.planStartTime);
            $("#planEndTime").html(data.data.billData.planEndTime);
            $("#subject").html(data.data.billData.subject);
            $("#billPlan").html(data.data.billData.billPlan);
            $("#publishSuggest").html(data.data.billData.publishSuggest);
            $("#projectName").html(data.data.billData.projectName);
            $("#subProjectName").html(data.data.billData.subProjectName);
            $("#assetTypeName").html(data.data.billData.assetTypeName);


            if (data.data.billData.billAssess || data.data.billData.billAssess != null) {
                var billAssess;
                var strhtml = "";
                var pjsrc = "images/stars2.png"
                if (data.data.billData.billAssess == "-1") {
                    billAssess = 2
                } else if (data.data.billData.billAssess == "1") {
                    billAssess = 3
                } else if (data.data.billData.billAssess == "2") {

                    billAssess = 4
                } else if (data.data.billData.billAssess == "4") {
                    billAssess = 5
                }

                for (var i = 0; i < billAssess; i++) {
                    strhtml += "<img src=" + pjsrc + ">"
                }

                $(".atar_Show").html(strhtml)

            } else {
                $("#atar_Show1").hide()
                $("#py").hide()
            }




            if (data.data.caseAssetsList.length != 0 || data.data.caseAssetsList) {
                var str = ""
                for (var i = 0; i < data.data.caseAssetsList.length; i++) {
                    str += "<li>" + "[" + data.data.caseAssetsList[i].assetCode + "]" + data.data.caseAssetsList[i].assetName + "</li>"
                }
                $("#zichan").html(str)
            }

            if (data.data.attachList.length != 0 || data.data.attachList) {
                var str = ""
                for (var i = 0; i < data.data.attachList.length; i++) {
                    str += '<div class="photoName">' + '<a href=' + baseUrl + data.data.attachList[i].url + '>' + data.data.attachList[i].name + '</a>' + '</div>'
                }
                $(".enclosure").html(str);


            }


        }
    })
})()