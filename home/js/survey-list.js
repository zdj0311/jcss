var app = new Vue({
    el: '#app',
    data: {
        paperList: []
    },
    methods: {
        getPaperList: function () {
            var _this = this;
            $.ajax({
                url: baseUrl + '/api/wx/question/paperList.action',
                success: function(data){
                    _this.paperList = data;
                }
            })
        }
    }
})

app.getPaperList();

