<template>
    <div class="survey-list">
        <ul v-if="paperList.length>0" class="sur-list">
           <li v-for="(item,index) in paperList" :key="index" @click="toDetail(item.id)">
              <header class="header">
                <img :src="exam"/>
                <span>{{item.paperName}}</span>
              </header>
              <time class="date">{{item.createDate}}</time>    
           </li>
        </ul>
        <empty v-else></empty>
    </div>
</template>
<script>
  
import exam from 'assets/img/exam.png'
import {paperList} from 'controller/order-create'
import {getVisited} from 'controller/surveyList'
import empty from 'components/empty'
export default {
    components: { empty },
    data() {
        return {
            paperList:[],
            exam
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
          getVisited.bind(this)({id:id}).then(res => {
            this.$router.push({
              name:'survey_detail',
              params:{_id:id}
            })
          })
          .catch(err=>{
            console.log(err)
            this.$dialog.alert({
              message: err.message
            });
          })
        },
    },
 }    
</script>
<style lang='scss'>
.survey-list{
  height:100%;
  background:#F2F2F2;
  .sur-list{
    
  }
  .sur-list li {
    margin-bottom:1rem;
    background:#fff;
    padding:1rem;
  }
  .header {
      display:flex;
      align-items: center;
      padding:.8rem;
    }
    .header img {
      width:20px;
      height:20px;
    }
    .header span {
      font-size:1.1rem;
      font-weight: bold;
      margin-left:.8rem;
    }
    .date {
      color:#969799;
      padding:1rem;
    }
}
</style>