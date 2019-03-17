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
import {cananswer,paperList} from 'controller/order-create'
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
//        this.cananswer()
            this.$router.push({
                name:'survey_detail',
                params:{'id':id}
            })
        },
        cananswer() {
        let id = this.$route.params.id;
        cananswer.bind(this)(id).then(res => {
          res = res.data;
          if(res.code == '000000') {
            this.getPaper();
          } else {
            Dialog.alert({
              message: res.message
            }).then(() => {
              this.$router.push({
                name: 'survey_list'
              })
            });
          }
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