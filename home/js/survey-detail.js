
var app1 = new Vue({
    el: '#app1',
    data: {
        paper: [],
        question: [],
        page:1,
        pageSize:2,
        num:0,
        totalNum:0,
        w:0,
        q:{},
    },
    watch: {
        question: function(){
            var _this = this;
            this.$nextTick(function(){
                $('.ans li').each(function(i,item){                    
                    var inputName = $(item).find('input').attr('name');
                    $('input[name='+inputName+']').each(function(j,k){
                        if(_this.q[inputName].indexOf($(k).next().attr('dataid'))!=-1){
                            $(k).prop('checked',true);
                        }else{
                            $(k).prop('checked',false);
                        }
                    })
                })
            })
        }
    },
    methods: {
        getPaper: function () {
            var _this = this;
            var id = this.getQueryString('id');
            $.ajax({
                url: baseUrl + '/api/wx/question/paper/'+id+'.action',
                success: function(data){
                    _this.paper = data;
                    _this.totalNum = data.questionCollect.length;
                    _this.getQuestion();
                    $.each(data.questionCollect,function(i,item){
                        _this.q['ans'+item.id] = '';
                    })
                }
            })
        },
        getPrevQuestion: function(){
            this.page--;
            this.getQuestion();    
        },
        getNextQuestion: function(){ 
            this.page++;
            this.getQuestion();
        },
        getQuestion: function(){
            this.question = [];
            for(var i=this.pageSize;i>0;i--){   
                if(this.paper.questionCollect[this.page*this.pageSize-i]!=undefined){
                    this.question.push(this.paper.questionCollect[this.page*this.pageSize-i]) 
                }           
            }  
            if(this.page==1 && this.page==(Math.ceil(this.paper.questionCollect.length/this.pageSize))){
                $('.prev').removeClass('dark');
                $('.prev').prop('disabled',true);
                $('.next').hide();
                $('#submit').show();
            }else if(this.page==1 && this.page!=(Math.ceil(this.paper.questionCollect.length/this.pageSize))){
                $('.prev').removeClass('dark');
                $('.prev').prop('disabled',true);
                $('.next').show();
                $('#submit').hide();
            }else if(this.page!=1 && this.page==(Math.ceil(this.paper.questionCollect.length/this.pageSize))){
                $('.prev').addClass('dark');
                $('.prev').prop('disabled',false);
                $('.next').hide();
                $('#submit').show();
            }else{
                $('.prev').addClass('dark');
                $('.prev').prop('disabled',false);
                $('.next').show();
                $('#submit').hide();
            }
        },
        getQueryString: function(name){
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
            var r = window.location.search.substr(1).match(reg); 
            if (r != null) return unescape(r[2]); 
            return null; 
        },
        cananswer: function(){
            var _this = this;
            var id = this.getQueryString('id');
            $.ajax({
                type: 'post',
                url: baseUrl + '/api/wx/question/check/cananswer.action',
                data: {paperId: id},
                success: function(data){
                    if(data.code=='000000'){
                        _this.getPaper();
                    }else{
                        layer.open({
                            content: data.message
                            ,btn: '确定'
                            ,yes: function(index){
                                window.location.href = 'survey-list.html'
                            }
                        })
                    }
                }
            })
        },
        progress: function($e){
            var inputName = $($e.currentTarget).attr('name');
            var dataid = '';
            $('input[name='+inputName+']:checked').each(function(i,item){
                dataid += $(item).next().attr('dataid')
            })
            this.q[inputName] = dataid;
            this.num = this.attributeCount(this.q);
            this.w = $('.pro').width()*(this.num/this.totalNum)
        },
        attributeCount: function(obj) {
            var count = 0;
            for(var i in obj) {
                if(obj.hasOwnProperty(i) && obj[i]!='') {  
                    count++;
                }
            }
            return count;
        },
        submit: function(){
            var _this = this;
            var id = this.getQueryString('id');
            var txt = '';
            $.each(this.paper.questionCollect,function(i,item){
                txt += item.id + '_' + _this.q['ans'+item.id] + ',';
            })
           
            $.ajax({
                type: 'post',
                url: baseUrl + '/api/wx/question/submit.action',
                data: {paperId: id,txt: txt},
                success: function(data){
                    if(data.code=='000000'){
                        layer.open({
                            content: data.message
                            ,btn: '确定'
                            ,yes: function(index){
                                window.location.href = 'survey-list.html'
                            }
                        })
                    }else{
                        layer.open({
                            content: data.message
                            ,btn: '确定'
                        })
                    }
                }
            })
        }
    }
})

app1.cananswer();
$('#submit').click(function(){
    app1.submit();
})
$('.ans').on('click','input',function($e){
    app1.progress($e);
})


