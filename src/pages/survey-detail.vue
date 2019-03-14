<template>
    <div class="survey-detail">
        <div class="sur">
            <div class="sur-head">
                <span class="s-h">{{paper.paperName}}</span>
            </div>
            <div class="sur-progress">
                <div class="pro" ref="pro"><div class="pro-f" ref="prof"></div></div>
                <div class="gre"><span>{{num}}</span>/{{totalNum}}</div>
            </div>
        </div>
        <div class="ans">
            <ul>
                <li v-for="(item,index) in question" :key="index">
                        <div class="ans-q">{{item.name}}</div>
                        <div class="ans-a" v-if="item.type=='SINGLE'">
                            <div class="ans-l">
                                <input type="radio" class="ans1" value="A" :id="'ans1'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans1'+item.id">{{item.A}}</label>
                            </div>
                            <div class="ans-l">
                                <input type="radio" class="ans2" value="B" :id="'ans2'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans2'+item.id">{{item.B}}</label>
                            </div>
                            <div class="ans-l" v-if="item.C!=''">
                                <input type="radio" class="ans3" value="C" :id="'ans3'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans3'+item.id">{{item.C}}</label>
                            </div>
                            <div class="ans-l" v-if="item.D!=''">
                                <input type="radio" class="ans4" value="D" :id="'ans4'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans4'+item.id">{{item.D}}</label>
                            </div>
                        </div>
                        <div class="ans-a" v-if="item.type=='MULTIP'">
                            <div class="ans-l">
                                <input type="checkbox" class="ans1" value="A" :id="'ans1'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans1'+item.id">{{item.A}}</label>
                            </div>
                            <div class="ans-l">
                                <input type="checkbox" class="ans2" value="B" :id="'ans2'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans2'+item.id">{{item.B}}</label>
                            </div>
                            <div class="ans-l" v-if="item.C!=''">
                                <input type="checkbox" class="ans3" value="C" :id="'ans3'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans3'+item.id">{{item.C}}</label>
                            </div>
                            <div class="ans-l" v-if="item.D!=''">
                                <input type="checkbox" class="ans4" value="D" :id="'ans4'+item.id" :name="'ans'+item.id" v-model="q['ans'+item.id]" @change="getNum"/>
                                <label :for="'ans4'+item.id">{{item.D}}</label>
                            </div>
                        </div>
                    </li>
            </ul>
        </div>
        <div class="buttGroup">
            <template v-if="(page==1 && paper.questionCollect && page==Math.ceil(paper.questionCollect.length/pageSize))">
                <button class="btn prev" @click="getPrevQuestion" disabled>上一页</button>
                <button class="btn dark" @click="submit">提交</button>
            </template>
            <template v-else-if="(page==1 && paper.questionCollect && page!=Math.ceil(paper.questionCollect.length/pageSize))">
                <button class="btn prev" @click="getPrevQuestion" disabled>上一页</button>
                <button class="btn dark next"  @click="getNextQuestion">下一页</button>
            </template>
            <template v-else-if="(page!=1 && paper.questionCollect && page==Math.ceil(paper.questionCollect.length/pageSize))">
                <button class="btn dark prev" @click="getPrevQuestion">上一页</button>
                <button class="btn dark" @click="submit">提交</button>
            </template>
            <template v-else>
                <button class="btn dark prev" @click="getPrevQuestion">上一页</button>
                <button class="btn dark next"  @click="getNextQuestion">下一页</button>
            </template>
        </div> 
    </div>
</template>
<script>
import {cananswer,submitPaper} from 'controller/order-create'
import config from 'config'
import { Dialog } from 'vant';
import Vue from 'vue'
import axios from 'axios'
export default {
    data() {
        return {
            paper: [],
            question: [],
            page:1,
            pageSize:2,
            num:0,
            totalNum:0,
            q:{},
        } 
    },
    created(){
        this.cananswer();
    },
    methods: {
        getPaper() {
            let id = this.$route.params.id;
            let _this = this;
            Vue.$axios.get(config.hostname + 'jcss/api/wx/question/paper/'+id+'.action').then(res=>{
                res = res.data;
                _this.paper = res;
                _this.totalNum = res.questionCollect.length;
                _this.getQuestion();
                res.questionCollect.forEach(function(v){
                    if(v.type=='SINGLE'){
                        _this.q['ans'+v.id] = '';
                        _this.$set(_this.q,'ans'+v.id,'')
                    }else if(v.type=='MULTIP'){
                        _this.q['ans'+v.id] = [];
                        _this.$set(_this.q,'ans'+v.id,[])
                    }
                })
            })
        },
        getPrevQuestion(){
            this.page--;
            this.getQuestion();    
        },
        getNextQuestion(){ 
            this.page++;
            this.getQuestion();
        },
        getQuestion(){
            this.question = [];
            for(var i=this.pageSize;i>0;i--){   
                if(this.paper.questionCollect[this.page*this.pageSize-i]!=undefined){
                    this.question.push(this.paper.questionCollect[this.page*this.pageSize-i]) 
                }           
            }  
        },
        cananswer(){
            let id = this.$route.params.id;
            cananswer.bind(this)(id).then(res=>{
                res = res.data;
                if(res.code=='000000'){
                     this.getPaper();
                }else{
                    Dialog.alert({
                        message: res.message
                    }).then(() => {
                        this.$router.push({name:'survey_list'})
                    });
                }
            })
        },
        submit(){
            var _this = this;
            var id = this.$route.params.id;
            var txt = '';
            console.log(this.q)
            this.paper.questionCollect.forEach(function(item,index){
                txt += index==0?item.id + '_' + _this.q['ans'+item.id]:','+item.id + '_' + _this.q['ans'+item.id];
            })
            var formData = new FormData();
            formData.append('paperId',id);
            formData.append('txt',txt);
            // submitPaper.bind(this)(formData).then(res=>{
            //     res = res.data;
            //     if(res.code=='000000'){
            //         Dialog.alert({
            //             message: res.message
            //         }).then(() => {
            //             this.$router.push({name:'survey_list'})
            //         });
            //     }else{
            //         Dialog.alert({
            //             message: res.message
            //         }).then(() => {});
            //     }
            // })
        },
        getNum(){
            let len = 0;
            for(let i in this.q){
                if(this.q[i]!=''){
                   len++
                }
            }
            this.num = len;
            this.$refs.prof.style.width = this.num/this.totalNum*this.$refs.pro.clientWidth+'px';
        }
    }
 }    
</script>
<style lang='scss'>
.sur-list li{
    height: .933333rem;
    line-height: .933333rem;
}
.sur{
    padding: .266667rem .4rem;
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
}
.sur .sur-head{
    display: flex;
    justify-content: space-between;
}
.sur .sur-head .s-h{
    font-size: 1rem;
    color:#000;
}
.ans{
    padding: 0 .4rem;
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    margin-top: .266667rem;
    padding-bottom: 1.293333rem;
}
.ans li{
    padding: .266667rem 0 .4rem;
    border-bottom: solid 1px #eee;
}
.ans .ans-q{
    font-size: 1rem;
    color:#000;
    margin-bottom: .266667rem;
}
.ans .ans-l{
    width:100%;
    height: 2.4rem;
    margin-top: 0.4rem;
    line-height: 2.4rem;
    font-size: 1rem;
    color:#000;
    padding-left: 0.8rem;
}
.ans .ans-l.active{
    background: #05a5f1;
    color:#fff;
}
.ans input[type="radio"] + label::before,.ans input[type="checkbox"] + label::before {
    content: "A"; /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    font-size: .8rem;
    color:#fff;
    width: 1rem;
    height: 1rem;
    margin-top: -4px;
    margin-right: 1em;
    border-radius: 50%;
    background: #ddd;
    text-indent: .14em;
    line-height: 1; 
    margin-right: .7rem;
    padding-left: 3px;
    padding-top: 2px;
}
.ans input[type="checkbox"] + label::before{
    border-radius:0;
}
.ans input[type="radio"].ans2 + label::before,.ans input[type="checkbox"].ans2 + label::before {
    content: "B"; 
}
.ans input[type="radio"].ans3 + label::before,.ans input[type="checkbox"].ans3 + label::before {
    content: "C"; 
}
.ans input[type="radio"].ans4 + label::before,.ans input[type="checkbox"].ans4 + label::before {
    content: "D"; 
}
.ans input[type="radio"]:checked + label::before,.ans input[type="checkbox"]:checked + label::before{
    background: #05a5f1;
}
.ans input[type="radio"],.ans input[type="checkbox"] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    
}
.sur-progress{
    margin-top: .4rem;
    display: flex;
}
.pro{
    width: 100%;
    height: 1rem;
    // background: url('../images/bg.jpg') repeat;
    border: solid 1px #eee;
    position: relative;
}
.pro-f{
    position: absolute;
    left:0;
    top:0;
    background: #90d300;
    height: 1rem;
}
.buttGroup{
    display: flex;
    padding:0 0.8rem;
    .btn {
        width:49%;
        height: 3.28rem;
        line-height:3.28rem;
        color: #fff;
        font-size: 1.28rem;
        border: none;
        background: #ccc;
        border-radius: 3px;
        &:first-child{
            margin-right:2%
        }
    }
}

.btn.dark{
    background: #05a5f1;
}
.gre{
    font-size: 1rem;
    color:#666;
    margin-top: -0.106667rem;
    margin-left: .7rem;
}
.gre span{
    color:#90d300;
}
.sur-app{
    background:#fff;
}

</style>