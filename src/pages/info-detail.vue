<template>
  <div class='info-detail'>
    <div class="content">
      <!--基本信息 -->
      <div class="info-container">
        <h2>信息发布</h2>
        <div class="row" v-for="(item,index) in baseInfo" :key="index">
          <span class="title">{{ item.title }}</span>
          <span class="value" v-html="item.value"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getInfo} from 'controller/infoDetail'
  export default {
    name: 'info-detail',
    data() {
      return {
        baseInfo:[], // 基本信息
      };
    },
    created() {
      getInfo.bind(this)({
        id:this.$route.params.id || 9
      }).then(res=>{
        this.makeData(res);
      })
    },
    methods: {
      toString(time) {
        return new Date(time).Format("yyyy-MM-dd hh:mm:ss");
      },
      makeData(res){   
        console.log(res)   
        this.baseInfo = [{
          title:'标题',
          value:res.warnTitle
        },{
          title:'类型',
          value:res.warnType
        },{
          title:'范围',
          value:res.warnScope
        },{
          title:'简介',
          value:res.warnBrief
        },{ 
          title:'内容',
          value:res.warnContent
        },{
          title:'发布时间',
          value:res.createDate
        }]
      }
    
    }
  }
</script>
<style lang='scss'>
  .info-detail {
    height:100%;
    background:#F2F2F2;
    padding-bottom: 3.28rem;
    header {
      display: flex;
      align-items: center;
      padding: 1rem;
      background:#fff;
    }
    .info-container {
        padding: 1rem;
        background: #fff;
    }
    .statu {
      color: #fff;
      padding: .3rem .8rem;
      background: linear-gradient(left, #4a79df, #7db6ff);
      border-radius: 5px;
    }
    h2 {
      font-size: 1.1rem;
      font-weight: bold;
      margin-left: 1rem;
      margin-bottom:0;
    }
    .content {
      background:#fff;
      h2 {
        font-size: 1rem;
        font-weight: bold;
        margin-left:.8rem;
        margin-bottom:.8rem;
      }
      .row {
        display:flex;
        padding:.3rem 0;
        border-top:1px solid #eeeeee;
        border-left:1px solid #eeeeee;
        border-right:1px solid #eeeeee;
        &:last-child {
          border-bottom:1px solid #eeeeee;
        }
        .title {
          flex:1;
          border-right:1px solid #eeeeee;
          padding:0 .8rem;
        }
        .value {
          flex:3;
          display:flex;
          flex-flow: column;
          justify-content: center;
          padding:0 .8rem;
          font-size: .9rem;
          p{
            margin-bottom:.4rem;
          }
        }
      }
    }
    .submit-btn {
      color:#fff;
      background:#4884fe;
      margin-top:2rem;
    }
    .van-popup{
      width:80%;
    }
  }
</style>