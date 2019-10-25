<template>
  <div class='order-detail'>
    <header>
      <span class="statu">待处理</span>
      <h2>交通厅-打印机故障</h2>
    </header>
    <div class="content">
      <!--基本信息 -->
      <div class="info-container">
        <h2>基本信息</h2>
        <div class="row" v-for="(item,index) in baseInfo" :key="index">
          <span class="title">{{ item.title }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
      </div>
      <!--审批信息 -->
      <div class="info-container">
        <h2>审批信息</h2>
        <div class="row" v-for="(item,index) in auditInfo" :key="index">
          <template v-if="item.title === '评价等级'">
            <span class="title">{{ item.title }}</span>
            <span class="value">
              <van-rate :value="rate(item.value)" />
            </span>
          </template>
          <template v-else>
            <span class="title">{{ item.title }}</span>
            <span class="value">{{ item.value }}</span>
          </template>
        </div>
      </div>
      <!--项目信息 -->
      <div class="info-container">
        <h2>项目信息</h2>
        <div class="row" v-for="(item,index) in projectInfo" :key="index">
          <span class="title">{{ item.title }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
      </div>
      <!--资产信息 -->
      <div class="info-container">
        <h2>资产信息</h2>
        <div class="row" v-for="(item,index) in assetInfo" :key="index">
          <template v-if="item.title === '关联资产'">
            <span class="title">{{ item.title }}</span>
            <div class="value" v-if="item.value.length>0">
              <div v-for="(obj,i) in item.value">{{ obj.assetName }}</div>
            </div>
          </template>
          <template v-else>
            <span class="title">{{ item.title }}</span>
            <span class="value">{{ item.value }}</span>
          </template>
        </div>
      </div>
      <!--附件信息 -->
      <div class="info-container">
        <h2>附件信息</h2>
        <div class="row" v-for="(item,index) in fileInfo" :key="index">
          <span class="title">{{ item.title }}</span>
          <div class="value" v-if="item.value.length>0">
            <div v-for="(obj,i) in item.value">{{ obj.fileName }}</div>
          </div>
        </div>
      </div>
    </div>
    <van-button class="submit-btn" size="large" @click="routeTo">办理</van-button>
  </div>
</template>

<script>
  import {getDetail} from 'controller/orderDetail'
  export default {
    name: 'order_detail',
    data() {
      return {
        baseInfo:[], // 基本信息
        auditInfo:[], // 审批信息
        projectInfo:[], // 项目信息
        assetInfo:[], // 资产信息
        fileInfo:[], // 附件信息
      };
    },
    created() {
      getDetail.bind(this)({
        id:this.$route.params._id
      }).then(res=>{
        this.baseInfo = res.baseInfo
        this.auditInfo = res.auditInfo
        this.projectInfo = res.projectInfo
        this.assetInfo = res.assetInfo
        console.log(this.assetInfo)
        this.fileInfo = res.fileInfo
      })
    },
    methods: {
      rate(rate) {
        let result = 0
        if(rate === '12') result = 1
        if(rate === '11') result = 2
        if(rate === '01') result = 3
        if(rate === '02') result = 4
        if(rate === '04') result = 5
        return result
      },
      routeTo() {
        this.$router.push({
          name:'order_resolver',
          params:{_id:this.$route.params._id}
        })
      },
    }
  }
</script>
<style lang='scss'>
  .order-detail {
    height:100%;
    background:#F2F2F2;
    header {
      display: flex;
      align-items: center;
      padding: 1rem;
      background:#fff;
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
    }
    .info-container {
      margin-top:1rem;
    }
    .content {
      padding:1rem;
      margin-top:1rem;
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
        }
      }
    }
    .submit-btn {
      color:#fff;
      background:#4884fe;
      margin-top:2rem;
    }
  }
</style>