<template>
  <div class='order-detail'>
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
        <div class="row" v-for="(item,index) in suggestInfo" :key="index">
          <span class="title">{{ item.title }}</span>
          <div class="value" v-if="item.value.length>0">
            <div v-for="(obj,i) in item.value">
              <p>{{obj.message}}</p>
              <p>
                <span v-text="toString(obj.createDate)"></span>
                <strong>{{obj.userName}}</strong>
              </p>
            </div>
            <div v-for="(obj,i) in item.value">
              <p>{{obj.message}}</p>
              <p>
                <span v-text="toString(obj.createDate)"></span>
                <strong>{{obj.userName}}</strong>
              </p>
            </div>
          </div>
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
      <!--评价信息 -->
      <div class="info-container">
        <h2>评价信息</h2>
        <div class="row" v-for="(item,index) in auditInfo" :key="index">
          <template v-if="item.title === '客户评价'">
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
      <!--附件信息 -->
      <div class="info-container">
        <h2>附件信息</h2>
        <div class="row" v-for="(item,index) in fileInfo" :key="index">
          <span class="title">{{ item.title }}</span>
          <div class="value" v-if="item.value.length>0">
            <div v-for="(obj,i) in item.value">
              <a :href="addPath(obj.url)">{{obj.fileName}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'detail',
    props: {
      fData: {
        type: Object
      }
    },
    data() {
      return {
        baseInfo:[], // 基本信息
        suggestInfo:[], // 审批信息
        auditInfo:[], // 评价信息
        projectInfo:[], // 项目信息
        assetInfo:[], // 资产信息
        fileInfo:[], // 附件信息
      };
    },
    created() {
      this.makeData(this.fData);
    },
    methods: {
      toString(time) {
        return new Date(time).Format("yyyy-MM-dd hh:mm:ss");
      },
      rate(rate) {
        let result = 0
        if(rate === '12') result = 1
        if(rate === '11') result = 2
        if(rate === '01') result = 3
        if(rate === '02') result = 4
        if(rate === '04') result = 5
        return result
      },
      makeData(res){   
        console.log(res)   
        this.baseInfo = [{
          title:'工单编号',
          value:res.billData.code
        },{
          title:'客户名称',
          value:res.billData.customerOrgName
        },{
          title:'申请人员',
          value:res.billData.appUserName
        },{
          title:'申请时间',
          value:res.billData.createDate
        },{
          title:'业务类型',
          value:res.billData.workflowRelName
        },{
          title:'工单类型',
          value:res.billData.busiTypeName
        },{
          title:'紧急程度',
          value:res.billData.urgencyValue
        },{
          title:'审批人员',
          value:res.billData.customerName
        },{
          title:'结束时间',
          value:res.billData.planEndTime
        },{
          title:'工单主题',
          value:res.billData.subject
        },{
          title:'工单描述',
          value:res.billData.billPlan
        },{
          title:'工单结果',
          value:res.billData.billRes
        }]
        this.suggestInfo = [{
          title:'审批意见',
          value:res.suggestList
        }]
        this.auditInfo = [{
          title:'客户评价',
          value:res.billData.billAssess
        },{
          title:'客户建议',
          value:res.billData.publishSuggest
        }]
        this.projectInfo = [{
          title:'项目名称',
          value:res.billData.projectName
        }]
        this.assetInfo = [{
          title:'资产分类',
          value:res.billData.assetTypeName
        },{
          title:'关联资产',
          value:res.caseAssetsList
        }]
        this.fileInfo = [{
          title:'附件列表',
          value:res.attachList // array
        }]
      }
    }
  }
</script>
<style lang='scss'>
  .order-detail {
    height:100%;
    background:#F2F2F2;
    padding-bottom: 3.28rem;
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
  }
</style>