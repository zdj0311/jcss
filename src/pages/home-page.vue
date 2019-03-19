<template>
  <div class="home-page">
    <div class="banner-r" :style="{backgroundImage:'url('+banner+')'}"></div>
    <div class="create">
      <div class="create-head">
        <div class="head-a">
          <span class="head-icon icon"></span>
          <span class="head-font">快速创建工单</span>
        </div>
        <div class="head-b" @click="routerTo">
          <span class="head-font">手动创建</span>
          <span class="head-icon icon-arrow"></span>
        </div>
      </div> 
      <van-swipe :autoplay="0">
        <van-swipe-item v-for="(item, index) in assetsArray" :key="index">
          <div class="l-list" v-for="(it, index) in item" :key="index" @click="createOrder(it,$event)">
            <span class="l-icon"><img :src="addPath(it.iconUrl)"/></span>
            <span class="l-f">{{it.assetsTypeName}}</span>         
          </div>
        </van-swipe-item>
      </van-swipe> 
      <van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
        <div class="model">
          <div class="model-header" v-if="form.assets">
            <span class="l-icon"><img :src="addPath(form.assets.iconUrl)"/></span>
            <span class="l-f">{{form.assets.assetsTypeName}}</span>   
          </div>
          <div class="model-content">
            <h2 class="downNode">下一节点</h2>
              <ul class="nextNode">
                <li v-for="(item,index) in nextNodesList" :key="index">
                  <input v-if="curNode.choice=='single'" type='radio' v-model='selectNodes' :value='item.componentId' name="nodes"/>
                  <input v-else type='checkbox' v-model='selectNodes' :value='item.componentId'/>
                  <span>{{item.name}}</span>
                </li>        
              </ul>
              <ul class="nextUser clearfix">
                <li v-for="(item,index) in chooseUser" :key="index">
                  <input v-if="chooseUser.choice=='single'" v-model="selectUsers" class="users" type="radio" :value='item.id' name="users">
                  <input v-else v-model="selectUsers" class="users" type="checkbox" :value='item.id'>
                  <span>{{item.displayName}}</span>
                </li>
              </ul>
          </div>
        </div>
      </van-dialog>
    </div>  
    <div class="create work">
      <div class="create-head" ref="create">
        <div class="head-a">
          <span class="head-icon icon-a"></span>
          <span class="head-font">工作统计</span>
        </div>
        <van-tabs v-model="active" @click="selectTab">
          <van-tab v-for="(item,index) in statistics" :key="index">
            <div slot="title">
              <span class="filter-ico"></span>
              <span class="filter-f">{{item.name}}</span>
            </div>
            <ul class="work-con">
              <li v-for="(item,index) in census" :key="index" @click="toList(item)">
                <span :class="['ico',item.img]"></span>
                <div class="w-con">
                  <span class="w-num">{{getNum(item.value)}}</span>
                  <span class="w-f">{{item.name}}</span>
                </div>
              </li>
            </ul>
          </van-tab>
        </van-tabs>
      </div>
    </div>      
  </div>
</template>

<script> 
  import banner from 'assets/banner.jpg'
  import { Dialog } from 'vant';
  import tool from 'utils/tool'
  import $ from 'jquery'
  import {getCustomerDic,getBtDic,startWorkflow,saveWorkflow,getAssetType,getStatisticCount} from 'controller/order-create'
  import form from 'utils/form-all'
  export default {
    name: 'home_page',
    data() {
      return {
        banner,
        census:[{name:'创建工单',value:'CREATE',img:'c-ico'},{name:'待办工单',value:'TODO',img:'d-ico'},{name:'办理工单',value:'DONE',img:'b-ico'}],
        assetsArray:[],
        statistics: [{name:'本日',value:'Day'},{name:'本周',value:'Week'},{name:'本月',value:'Month'}],
        active: 0,
        statisticsCount: {},
        show: false,
        form: {},
        nextNodesList:[],
        curNode:{},
        selectNodes:'',
        chooseUser:[],
        selectUsers:[],
        dateType:''
      }
    },
    watch:{
      selectNodes(){
        this.toSelectUser();
      }
    },
    mounted() {
      this.getInfo();
      this.selectTab(this.active);
    },
    methods: {
      getInfo(){
        let _this = this;
        getAssetType.bind(this)(_this.$store.state.admin.user.orgId).then(res=>{
          let copyArr =  res.slice(0,res.length)
          let len = Math.ceil(res.length/4);
          for(var i=0;i<len;i++){
             _this.assetsArray.push(copyArr.splice(0,4))
          }
        })
        getBtDic.bind(this)().then(res=>{
          this.form.busiTypeCode = res[0].code;
          this.form.busiTypeName = res[0].text;
        })
      },
      getNum(status){
        return this.statisticsCount[status];
      },
      selectTab(index) {
        let dateType = this.statistics[index]['value'];
        this.dateType = dateType;
        let _this = this;
        getStatisticCount.bind(this)(dateType).then(res=>{
          _this.statisticsCount = res;
        })
      },
      routerTo() {
        this.$router.push({
          name: 'order_create'
        })
      },
      toList(item){
        this.$router.push({
          name: 'order_list',
          params: {
            _type: this.dateType,
            _mode: item.value
          }
        })
      },
      createOrder(it,e){
        this.form.assets = it;
        let bg = $(e.currentTarget).css('background')
        startWorkflow.bind(this)(this.$store.state.admin.user.orgId,this.form.busiTypeCode).then(res=>{
          this.form.curNodeId_ = res.workflowBean.curNodeId_;
          this.form.definitionId_ = res.workflowBean.definitionId_;
          this.form.wUserType = res.wUserType;
          tool.getNextNode.bind(this)().then(res=>{
            this.nextNodesList = res.nextNodesList;
            this.curNode = res.curNode;
            this.selectNodes = res.nextNodesList[0].componentId;  
            this.show = true;
            $('.model-header').css('background',bg+'')
            this.toSelectUser();
          })
        })
      },
      // 选人
      toSelectUser(){
        this.chooseUser = [];
        let nextNodeId = this.selectNodes;
        let _this = this;
        this.nextNodesList.forEach(function(v){
          if (v.componentId == nextNodeId) { 
            let confirmSequences = "";
            v.channel.forEach(function(item) {
              if(confirmSequences == "") {
                confirmSequences = item.sequenceId;
              }else{
                confirmSequences += "&" + item.sequenceId;
              }
            })
            _this.form.confirmNodeId_ = nextNodeId;
            _this.form.confirmRouteId_ = confirmSequences;
            if(v.type == "end") {
              return;
            }
            if (v.userType == "2") {
              if (v.assignees.length != 0) {
                _this.chooseUser = v.assignees;
                _this.chooseUser.choice = 'multiple'
              }
            }
            //配置人员为空,显示人员选择
            if(v.assignees.length == 0) {
              _this.getAllUser(v);    
            }else{
              let assignees = v.assignees;
              let assigneesIds = "", assigneesNames = "";
              assignees.forEach(function(k){
                if(assigneesIds!= ""){
                  if (k.oldName!= null) {
                    assigneesIds+= "," + k.oldId;
                    assigneesNames+=",(" + k.oldName + ")委托给(" + k.name + ")";
                  } else {
                    assigneesIds += "," + k.id;
                    assigneesNames += "," + k.name;
                  }
                }else{
                  if (k.oldName != null) {
                    assigneesIds = k.oldId;
                    assigneesNames += "(" + k.oldName + ")委托给(" + k.name + ")";
                  } else {
                    assigneesIds = k.id;
                    assigneesNames += k.name;
                  }
                }
                _this.selectUsers = assigneesIds;
              })
            } 
          }
        })
      },
      // 获取所有人
      getAllUser(nextNodesList){
        getCustomerDic.bind(this)().then(res=>{
          let user = [];
          let assignees = tool.showAll(res,user); 
          //单一签核(人员树单选)
          if (nextNodesList.dealType == 4) {
            this.chooseUser = assignees;
            this.chooseUser.choice = 'single'
          }
          //多人处理及多人单一签核(人员树多选)
          else {
            this.chooseUser = assignees;
            this.chooseUser.choice = 'multiple'
          }
          this.selectUsers = assignees[0].id;
        })
      },
      getForm(){
        var formData = new FormData();
        formData.append('customerOrg',this.$store.state.admin.user.orgId)
        formData.append('customerOrgName',this.$store.state.admin.user.orgIdValue)
        formData.append('busiTypeCode',this.form.busiTypeCode)
        formData.append('busiTypeName',this.form.busiTypeName)
        formData.append('subject',this.$store.state.admin.user.orgIdValue+this.form.assets.assetsTypeName)
        formData.append('billPlan',this.$store.state.admin.user.orgIdValue+this.form.assets.assetsTypeName)
        formData.append('assetTypeId',this.form.assets.id)
        formData.append('assetTypeName',this.form.assets.assetsTypeName)
        formData.append('attachFileMode','EDIT')
        formData.append("workflowBean.curNodeId_",this.form.curNodeId_)
        formData.append("workflowBean.definitionId_",this.form.definitionId_)
        formData.append("workflowBean.confirmUserId_",this.selectUsers)
        formData.append("workflowBean.confirmNodeId_",this.form.confirmNodeId_)
        formData.append("workflowBean.confirmRouteId_",this.form.confirmRouteId_)
        formData.append("workflowBean.submitType_",'SUBMIT')
        formData.append("workflowBean.workflowVar_[wUserType]",this.form.wUserType)
        return formData;
      },
      beforeClose(action, done) {
        if (action === 'confirm') {
          var formData = this.getForm();
          saveWorkflow.bind(this)(formData).then(res=>{
            this.$router.push({name:'order_list'})
            done();
          })
        } else {
          done();
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  body{
    background: #F2F2F2;
  }
  .home-page {  
    .banner-r{
      width: 100%;
      height: 52vw;
      background-size: 100% 52vw;
    }
    .create{
      background: #fff;
      margin-top: 0.8rem;
      border-top:solid 1px #eee;
      border-bottom:solid 1px #eee;
      padding:0 1.2rem;
      .create-head{
        display: flex;
        justify-content: space-between;
        padding: 0.8rem 0;
        .head-font{
          font-size: 1.1rem;
          font-weight: bold;
          color: #333;
          margin-left: 5px;
        }
        .head-icon{
          width: 1.3rem;
          height: 1.3rem;
          background: url('~@/assets/icon-c.png') no-repeat;
          background-size: 1.3rem 1.3rem;
          display: inline-block;
          vertical-align: middle;
          margin-top: -3px;
          &.icon-a{
            background: url('~@/assets/icon-w.png') no-repeat;
            background-size: 1.3rem 1.3rem;
          }
        }
        .head-b{
          .head-font{
            font-size: 1.1rem;
            color: #999;
            margin-right: 5px;
          }
          .icon-arrow{
            width: 0.4rem;
            height: 0.8rem;
            background: url('~@/assets/icon-arrow.png') no-repeat;
            background-size: .4rem .8rem;
          }
        }
        .van-tabs{
          padding-top: 0px;
          margin-top: -1.6rem;
          .van-hairline--top-bottom::after {
            border-width: 0px 0;
          }
          .van-tabs__line{
            background-color: transparent;
          }
          .van-tabs__wrap{
            height: 1.5rem;
            float: right;
            position: relative;
            margin-bottom: 0.8rem;
          }
          .van-tab{
            line-height: 1.5rem;
            .filter-ico{
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              background: #ddd url('~@/assets/duih.png') no-repeat .15rem .25rem;
              background-size: .8rem .5rem;
              display: inline-block;
              margin-right: 5px;
              vertical-align: middle;
              margin-top: -3px;
            }
            .filter-f{
              font-size: 1rem;
              color: #666;
              display: inline-block;
            }
            .filter-f{
              font-size: 1rem;
              color: #666;
              display: inline-block;
            }
          }
          .van-tab--active{
            .filter-ico{
              background: #4a79df url('~@/assets/duih.png') no-repeat .15rem .25rem;
              background-size: .8rem .5rem;
            }
            .filter-f{
              color: #4a79df;
            }
          }
          .van-tabs__content{
            .work-con {
              display: flex;
              width: 100%;
              li{
                width: 32%;
                margin-right: 2%;
                height: 4.8rem;
                background: #f5f5f5;
                border-radius: 5px;
                position: relative;
                &:nth-child(3){
                  margin-right: 0;
                }
                .ico{
                  width: 3.75rem;
                  height: 3.2rem;
                  background: url('~@/assets/work1.png') no-repeat;
                  background-size: 3.75rem 3.2rem;
                  display: inline-block;
                }
                .d-ico{
                  background: url('~@/assets/work2.png') no-repeat;
                  background-size: 3.75rem 3.2rem;
                }
                .b-ico{
                  background: url('~@/assets/work3.png') no-repeat;
                  background-size: 3.75rem 3.2rem;
                }
                .w-num{
                  font-size: 1.7rem;
                  color: #000;
                  display: block;
                  text-align: right;
                }
                .w-f{
                  font-size: 1rem;
                  color: #666;
                }
                .w-con{
                  position: absolute;
                  left: 2.8rem;
                  top: .4rem;
                }
              }
            }
          }
        }
      }
      .van-swipe-item{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 1.6rem;
        .l-list{
          margin-bottom: .8rem;
          width: calc(50% - .4rem);
          margin-right: .8rem;
          border-radius: 5px;
          height: 4.46rem;
          line-height: 4.46rem;
          padding-left: .8rem;
          
          &:nth-child(even){
            margin-right: 0;
          }
          .l-icon{
            width: 3rem;
            height: 3rem;
            display: inline-block;
            vertical-align: middle;
            margin-top: -3px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .l-f{
            font-size: 1rem;
            color: #fff;
            margin-left: .4rem;
          }
        }
        // 将背景颜色值定义成变量
          $purple : #573bc2;
          $blue : #2a3dc6;
          $orange : #ea4b3a;
          $lightblue : #0d85db;

          //将背景颜色以键值对的形式存在map中
          $bgcolorlist : (
              1: $purple,
              2: $blue,
              3: $orange,
              4: $lightblue,
            );

          // 使用SASS each语法为每一个li设置background-color
          @each $i, $color in $bgcolorlist {
              .l-list:nth-child(#{$i}) {
                background: linear-gradient(to bottom right, $color , lighten($color, 20%));
              }
          }
      }
      .van-swipe__indicators{
        .van-swipe__indicator{
          background-color: #ddd;
          width: 0.8rem;
          height: 0.8rem;
        }
        .van-swipe__indicator--active{
          background-color: #4a79df;
        }
      }
    }
    .work{
      padding-bottom: 0.2rem;
      .create-head{
        display: block;
      }
    }
    .model{
      .model-header{
        height:5.18rem;
        background: linear-gradient(to bottom right, #573bc2 , #9639b4);
        line-height: 5.18rem;
        padding-left: 0.8rem;
        .l-icon{
          width: 3rem;
          height: 3rem;
          display: inline-block;
          vertical-align: middle;
          margin-top: -3px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .l-f{
          font-size: 1.5rem;
          font-weight: bold;
          color: #fff;
          margin-left: 0.8rem;
        }
      }
      .model-content{
        padding:0.8rem;
        .downNode{
          font-size: 1rem;
          margin-bottom: 0.8rem;
          color:#000;
        }
        .nextNode{
          display: flex;
          li{
            width:49%;
            height:2.5rem;
            line-height: 2.5rem;
            background:#f5f5f5;
            border:solid 1px #e9e9e9;
            border-radius: 3px;
            font-size: 1rem;
            &:first-child{
              margin-right:2%;
            }
            padding-left:0.8rem;
          }
          padding-bottom:0.8rem;
          border-bottom:dashed 1px #ddd;
        }
        .nextUser{
          display: flex;
          padding-top:0.8rem;
          flex-wrap: wrap;
          li{
            width:49%;
            margin-right:2%;
            height:2.5rem;
            line-height: 2.5rem;
            background:#f5f5f5;
            border:solid 1px #e9e9e9;
            border-radius: 3px;
            padding-left:0.8rem;
            margin-bottom: 0.4rem;
            font-size: 1rem;
            &:nth-child(even){
              margin-right: 0;
            }
          }
        }
      }
    }
    input[type="radio"],input[type="checkbox"]{
      width: 1.07rem;
      height: 1.07rem;
      display: inline-block;
      text-align: center;
      vertical-align: middle; 
      line-height: 1.07rem;
      position: relative;
      margin-top:-2px;
      margin-right: .36rem;
    }
    input[type="radio"]::before,input[type="checkbox"]::before{
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      background: #ddd url('~@/assets/check.png');
      width: 100%;
      height: 100%;
      background-size:1.07rem 1.07rem;
    }
    input[type="radio"]::before{
      border-radius: 50%;
    }
    input[type="radio"]:checked::before,input[type="checkbox"]:checked::before{
      content: "";
      background: #4a79df url('~@/assets/check.png');
      position: absolute;
      top: 0;
      left: 0;
      width:100%;
      height: 100%;
      background-size:1.07rem 1.07rem;
    }
  }
</style>