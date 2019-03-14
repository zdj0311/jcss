<template>
    <div class="survey-list">
        <ul class="sur-list">
           <li v-for="(item,index) in paperList" :key="index" @click="toDetail(item.id)">
                <div class="list-icon"></div>
                <div class="list-con">
                    <div class="name">{{item.paperName}}</div>
                    <div class="date">{{item.createDate}}</div>
                </div>        
           </li>
        </ul>
    </div>
</template>
<script>
import {paperList} from 'controller/order-create'
export default {
    data() {
        return {
            paperList:[],
        };
    },
    created(){
        this.getPaperList();
    },
    methods: {
        getPaperList(){
            var _this = this;
            paperList.bind(this)().then(res=>{
                this.paperList = res.data;
            })
        },
        toDetail(id){
            this.$router.push({
                name:'survey_detail',
                params:{'id':id}
            })
        }
    },
 }    
</script>
<style lang='scss'>
.survey-list{
    .sur-list{
    padding:0 1rem;
}
.sur-list li{
    height:4.8rem;
    font-size: 1rem;
    color:#000;
    border-bottom:solid 1px #eee;
    padding:.1.9rem 0;
}
.sur-list li .name{
    line-height: 1.62rem;
}
.sur-list li .date{
    font-size: 1rem;
    color:#999;
    line-height: 1.35rem;
}
.sur-list li .list-icon{
    width: 1rem;
    height: 1.3rem;
    // background: url('../images/list-icon.png') no-repeat;
    margin-top: .133333rem;
    margin-right: .266667rem;
}
.sur-list li a{
    display: flex;
}
.sur-list li .list-con{
    flex: 1;
    width:100%;
}
}
</style>