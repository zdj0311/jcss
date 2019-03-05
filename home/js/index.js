var jcss = new Vue({
    el: '#jcssIndex',
    data: {
        assetsArray: []
    },
    methods: {
        isLogin: function () {
            var _this = this;
            $.ajax({
                url: baseUrl + '/api/wx/question/paperList.action',
                success: function(data){
                    _this.paperList = data;
                }
            })
        },
        getInfo: function() {
            var _this = this;
            $.ajax({
                url: baseUrl + '/api/wx/user/info.action',
                success: function(data){
                    if(data.code=='000000'){
                        var customerId = data.data.orgId;
                        $.ajax({
                            url: baseUrl + '/api/wk/dic/assetsTypeList.action',
                            data: {customerId:customerId},
                            success: function(data){
                                if(data.code=='000000'){ 
                                    let copyArr =  data.data.slice(0,data.data.length)
                                    _this.assetsArray = []
                                    var len = Math.ceil(data.data.length/4);
                                    for(var i=0;i<len;i++){
                                        newArr.push(copyArr.splice(0,4))
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    }
})

jcss.getInfo();