<template>
    <div class="dispose">
      <!--基本信息 -->
      <div class="info-container">
        <h2>基本信息</h2>
        <div class="row">
          <span class="title">工单编号</span>
          <span class="value">{{ fData.billData.code }}</span>
        </div>
        <div class="row">
          <span class="title">客户名称</span>
          <span class="value">{{ fData.billData.customerOrgName }}</span>
        </div>
        <div class="row">
          <span class="title">申请人员</span>
          <span class="value">{{ fData.billData.appUserName }}</span>
        </div>
        <div class="row">
          <span class="title">申请时间</span>
          <span class="value">{{ fData.billData.createDate }}</span>
        </div>
        <!--增加联系方式 05-07 -->
        <div class="row">
          <span class="title">联系方式</span>
          <span class="value">{{ fData.billData.appUserPhone }}</span>
        </div>
        <div class="row">
          <span class="title">业务类型</span>
          <span class="value">{{ fData.billData.workflowRelName }}</span>
        </div>
        <slot name="busiTypeName"></slot>
        <slot name="urgencyValue"></slot>
        <slot name="customerName"></slot>
        <div class="row">
          <!--<span class="title">结束时间</span>-->
          <span class="title">处理完成</span>
          <span class="value">{{ fData.billData.planEndTime }}</span>
        </div>
        <div class="row">
          <span class="title">工单主题</span>
          <span class="value">{{ fData.billData.subject }}</span>
        </div>
        <div class="row">
          <span class="title">工单描述</span>
          <span class="value">{{ fData.billData.billPlan }}</span>
        </div>
        <slot name="billRes"></slot>
        <div v-if="fData.suggestList.length>0">
          <div class="row">
            <span class="title">审批意见</span>
            <span class="value">
              <div v-for="(item,index) in fData.suggestList" :key="index">
                <p>{{item.message}}</p>
                <p>
                  <span v-text="toString(item.createDate)"></span>
                  <strong>{{item.userName}}</strong>
                </p>
              </div>
            </span>
          </div>
        </div>
        <slot name="workOrderSuggest"></slot>
      </div>  
      <!--项目信息 -->
      <div class="info-container">
        <h2>项目信息</h2>
        <div class="row last">
          <span class="title">项目名称</span>
          <span class="value">{{ fData.billData.projectName }}</span>
        </div>
        <!-- <div class="row last">
          <span class="title">子项目名称</span>
          <span class="value">{{ fData.billData.subProjectName }}</span>
        </div> -->
      </div> 
      <!--资产信息 -->
      <div class="info-container">
        <h2>资产信息</h2>
        <!-- 资产分类 -->
        <div class="row">
          <span class="title">资产分类</span>
          <span class="value">{{ fData.billData.assetTypeName }}</span>
        </div>
        <!-- 关联资产 -->
        <slot name="assetsRelList"></slot>
      </div>
      <!--附件信息 -->
      <div class="info-container">
        <h2>附件信息</h2>
        <slot name="fileList"></slot>
      </div> 
    </div> 
</template>

<script>
export default {
  name: 'dispose',
  data() {
    return {
    };
  },
  created(){
  },
  props: {
    fData: {
      type: Object
    }
  },
  methods: {
    toString(time) {
      console.log(time)
      let newTime = time.replace(/-| |:/g, ",");
      let arr = [];
      newTime.split(',').forEach((item,index)=>{
        arr.push(item.replace(/^[0]+/g,""));
      })
      return new Date(arr[0],arr[1],arr[2],arr[3],arr[4],arr[5]).Format("yyyy-MM-dd hh:mm:ss");
    },
  }
}
</script>
<style lang='scss'>
  .dispose{
    padding-bottom: 3.28rem;
    .authenTab {
    background: #fff;
    display: flex;
    height: 2rem;
    line-height: 2rem;
    .auTitle {
      font-size: 1rem;
    }
    .clickUp {
      float: right;
      font-size: 1rem;
      color: #4a79df;
    }
    .fileinput-button {
      position: relative;
      flex: 1;
      input {
        position: absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        -ms-filter: "alpha(opacity=0)";
        font-size: 200px;
        height: 2rem;
      }
    }
  }
  .photoList {
    border-bottom: 1px solid #eee;
    margin: 0 .8rem;
    height: 2.5rem;
    line-height: 2.5rem;
    color: #000;
    .fuj {
      width: 0.86rem;
      height: 0.79rem;
      background: url("~@/assets/fuj.png");
      background-size: 0.86rem 0.79rem;
      display: inline-block;
      margin-right: 0.36rem;
    }
  }
  .delect {
    float: right;
    width: 1.29rem;
    height: 1.29rem;
    background: url("~@/assets/del.png");
    background-size: 1.29rem 1.29rem;
    margin-top: 0.61rem;
  }
  }
  
</style>