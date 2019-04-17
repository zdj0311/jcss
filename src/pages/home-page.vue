<template>
  <div class="home-page">
    <div class="banner-r" :style="{backgroundImage:'url('+banner+')'}"></div>
    <div class="create">
      <!-- <div class="create-head">
        <div class="head-a">
          <span class="head-icon icon-l"></span>
          <span class="head-font">历史工单</span>
        </div>
        <div class="head-b" @click="routerToHistory">
          <span class="head-font">查看历史</span>
          <span class="head-icon icon-arrow"></span>
        </div>
      </div>  -->
      <div class="create-head head-create">
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
            <span class="l-f">{{it.assetsTypeName}}报单</span>         
          </div>
        </van-swipe-item>
      </van-swipe> 
      <van-dialog v-model="show" show-cancel-button :before-close="beforeClose">
        <div class="model">
          <div class="model-header" v-if="form.assets">
            <span class="l-icon"><img :src="kicon"/></span>
            <span class="l-f">创建工单确认</span>   
          </div>
          <div class="model-content">
            <div class="line">
              <div class="con-line">
                <label>资产分类：</label>
                <span>{{form.assets?form.assets.assetsTypeName:''}}报单</span>
              </div>
              <div class="con-line">
                <label>联系人：</label>
                <span>{{user.userName}}</span>
              </div>
              <div class="con-line">
                <label>联系电话：</label>
                <span>{{user.mobile}}</span>
              </div>
            </div>
            <div class="work-con" v-if="nextNodesList.length!=1">
              <h2 class="downNode">下一节点</h2>
              <ul class="nextNode">
                <li v-for="(item,index) in nextNodesList" :key="index">
                  <input v-if="curNode.choice=='single'" type='radio' v-model='selectNodes' :value='item.componentId' name="nodes" @change="toSelectUser"/>
                  <input v-else type='checkbox' v-model='selectNodes' :value='item.componentId' @change="toSelectUser"/>
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
            <div class="work-des">感谢使用嘉诚运维服务平台，您的工单创建成功后，我们将第一时间处理，您的满意是我们前进的动力。</div>
          </div>
        </div>
      </van-dialog>
    </div>  
    <div class="create work">
      <div class="create-head" ref="create">
        <div class="head-a">
          <span class="head-icon icon-a"></span>
          <span class="head-font">我的工作</span>
        </div>
        <van-tabs v-model="active" @click="selectTab">
          <van-tab v-for="(item,index) in statistics" :key="index">
            <div slot="title">
              <span class="filter-ico"></span>
              <span class="filter-f">{{item.name}}</span>
            </div>
            <ul class="work-con">
              <li v-for="(item,index) in census" :key="index" @click="toList(item)" 
                :style="{backgroundColor:item.bg,backgroundImage:'url('+ item.bimg +')',backgroundRepeat:'no-repeat',backgroundPosition:'right bottom',backgroundSize:'40%'}">
                <!--<span :class="['ico',item.img]"></span>
                <div class="w-con">
                  <span class="w-num">{{getNum(item.value)?getNum(item.value):0}}</span>
                  <span class="w-f">{{item.name}}</span>
                </div>-->
                <header>{{item.name}}</header>
                <span class="number">{{getNum(item.value)?getNum(item.value):0}}</span>
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
  import kicon from 'assets/kicon.png'
  import { Dialog } from 'vant';
  import tool from 'utils/tool'
  import $ from 'jquery'
  import {getCustomerDic,getWkDicList,getCustomerAndJcAllDeptAndUser,getBtDic,startWorkflow,saveWorkflow,getAssetTypeTop,getAssetType,getStatisticCount,getUrgencyDic} from 'controller/order-create'
  import form from 'utils/form-all'
  export default {
    name: 'home_page',
    data() {
      return {
        user:{},
        banner,
        kicon,
        census:[{name:'我的待办',value:'TODO',img:'c-ico',bg:'#985ffc',bimg:'static/img/todo.png'},
        {name:'在办工单',value:'UN_END',img:'b-ico',bg:'#4884fe',bimg:'static/img/un_end.png'},
        {name:'超时工单',value:'OUTTIME',img:'d-ico',bg:'#f07616',bimg:'static/img/outtime.png'},
        {name:'完成工单',value:'END',img:'b-ico',bg:'#13baf1',bimg:'static/img/end.png'}],
        assetsArray:[],
        statistics: [{name:'本日',value:'Day'},{name:'本周',value:'Week'},{name:'本月',value:'Month'},{name:'全部',value:'All'}],
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
    mounted() {
      this.user = this.$store.state.admin.user;
      this.getInfo();
      this.selectTab(this.active);
    },
    methods: {
      getInfo(){
        getAssetTypeTop.bind(this)(this.user.orgId).then(res=>{
          let copyArr =  res.slice(0,res.length)
          let len = Math.ceil(res.length/3);
          for(var i=0;i<len;i++){
             this.assetsArray.push(copyArr.splice(0,3))
          }
        })
        getUrgencyDic.bind(this)("urgency", "jcss").then(res=>{
          this.form.urgency = res.length>0?res[0].code:'';
          this.form.urgencyValue = res.length>0?res[0].text:'';
        })
        getBtDic.bind(this)().then(res=>{
          this.form.busiTypeCode = res.length>0?res[0].code:'';
          this.form.busiTypeName = res.length>0?res[0].text:'';
        })
      },
      getNum(status){
        return this.statisticsCount[status];
      },
      selectTab(index) {
        let dateType = this.statistics[index]['value'];
        this.dateType = dateType;
        getStatisticCount.bind(this)(dateType).then(res=>{
          this.statisticsCount = res;
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
            _mode: item.value,
          }
        })
      },
      createOrder(it,e){
        this.form.assets = it;
        this.form.customerOrg = it.customerId;
        this.form.customerOrgName = it.customerIdValue;
        getWkDicList.bind(this)(this.form.customerOrg).then(res=>{
          this.form.workflowRelCode = res.length>0?res[0].code:'';
          this.form.workflowRelName = res.length>0?res[0].text:'';
          if(res.length==0){
            Dialog.alert({
              message: "无业务类型，不可创建工单"
            });
            return false;
          }
          startWorkflow.bind(this)(this.form.customerOrg,this.form.workflowRelCode).then(res=>{
            this.form.curNodeId_ = res.workflowBean.curNodeId_;
            this.form.definitionId_ = res.workflowBean.definitionId_;
            this.form.wUserType = res.wUserType;
            tool.getNextNode.bind(this)().then(res=>{
              this.nextNodesList = res.nextNodesList;
              this.curNode = res.curNode;
              this.selectNodes = res.nextNodesList[0].componentId;  
              this.toSelectUser();
              this.show = true;
            })
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
                _this.selectUsers = [];
                _this.selectUsers.push(v.assignees[0].id);
              }
            }
            //配置人员为空,显示人员选择
            console.log(v.assignees.length)
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
        getCustomerAndJcAllDeptAndUser.bind(this)(this.form.customerOrg).then(res=>{
          let user = [];
          let assignees = tool.showAll(res,user); 
          //单一签核(人员树单选)
          if (nextNodesList.dealType == 4) {
            this.chooseUser = assignees;
            this.chooseUser.choice = 'single'
            this.selectUsers = "";
            this.selectUsers = assignees[0].id;
          }
          //多人处理及多人单一签核(人员树多选)
          else {
            this.chooseUser = assignees;
            this.chooseUser.choice = 'multiple'
            this.selectUsers = [];
            this.selectUsers.push(assignees[0].id);
          }
        })
      },
      getForm(){
        var formData = new FormData();
        formData.append('customerOrg',this.form.customerOrg)
        formData.append('customerOrgName',this.form.customerOrgName)
        formData.append('busiTypeCode',this.form.busiTypeCode)
        formData.append('busiTypeName',this.form.busiTypeName)
        formData.append('workflowRelCode',this.form.workflowRelCode)
        formData.append('workflowRelName',this.form.workflowRelName)
        formData.append('subject',this.form.customerOrgName+this.form.assets.assetsTypeName)
        formData.append('billPlan',this.form.customerOrgName+this.form.assets.assetsTypeName)
        formData.append('assetTypeId',this.form.assets.id)
        formData.append('assetTypeName',this.form.assets.assetsTypeName)
        formData.append('urgency',this.form.urgency)
        formData.append('urgencyValue',this.form.urgencyValue)
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
            this.$router.push({
              name:'order_list',
              params:{
                _type:'Day',
                _mode:'UN_END'
              }
            })
            done();
          })
        } else {
          done();
        }
      },
      saveWork(done){
        var formData = this.getForm();
          saveWorkflow.bind(this)(formData).then(res=>{
            this.$router.push({
              name:'order_list',
              params:{
                _type:'Day',
                _mode:'UN_END'
              }
            })
          if(done){
            done();
          } 
        })
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
    height:calc(100% - 50px);
    overflow:scroll;  
    .banner-r{
      width: 100%;
      height: 52vw;
      background-size: 100% 52vw;
    }
    .create{   
      // border-top:solid 1px #eee;
      border-bottom:solid 1px #eee;
      .head-create{
      }
      .create-head{
        background: #fff;
        display: flex;
        justify-content: space-between;
        padding: 0.8rem 1.2rem;
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
          &.icon-l{
            background: url('~@/assets/icon-l.png') no-repeat;
            background-size: 1.3rem 1.3rem;
          }
        }
        .head-b{
          .head-font{
            font-size: 1.1rem;
            color: #999;
            margin-right: 5px;
            font-weight: normal;
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
            padding: 0 1px;
            .filter-ico{
              width: 1rem;
              height: 1rem;
              border-radius: 50%;
              background: #ddd url('~@/assets/duih.png') no-repeat .15rem .25rem;
              background-size: .8rem .5rem;
              display: inline-block;
              margin-right: 0px;
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
              justify-content: space-around;
              width: 100%;
              li{
                color:#fff;
                padding: .71rem;
                border-radius: 3px;
                /*width: 32%;
                margin-right: 2%;
                height: 4.8rem;
                background: #f5f5f5;
                border-radius: 3px;
                position: relative;
                padding: .71rem;
                &:nth-child(3){
                  margin-right: 0;
                }*/
                .ico{
                
                  width: 1.86rem;
                  height: 1.86rem;
                  background: url('~@/assets/work1.png') no-repeat;
                  background-size: 1.86rem 1.86rem;
                  display: inline-block;
                }
                .d-ico{
                  background: url('~@/assets/work2.png') no-repeat;
                  background-size: 1.86rem 1.86rem;
                }
                .b-ico{
                  background: url('~@/assets/work3.png') no-repeat;
                  background-size: 1.86rem 1.86rem;
                }
                 .number {
                   font-size:1.4rem;
                 }
                .w-num {
                  font-size: 1.7rem;
                  color: #fff;
                  display: block;
                  text-align: right;
                }
                .w-f{
                  font-size: 1rem;
                  color: #fff;
                  margin-top: 0.2rem;
                  display: inline-block;
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
      .van-swipe{
        margin-bottom: 0.8rem;
        background: #fff;
        padding-bottom: 1.6rem;
        .van-swipe-item{
          display: flex;
          flex-wrap: wrap;
          .l-list{
            border-right: solid 1px #eee;
            border-top: solid 1px #eee;
            border-bottom: solid 1px #eee;
            width: 33.3%;
            text-align: center;
            padding: 1.07rem 0;
            &:nth-child(even){
              margin-right: 0;
            }
            .l-icon{
              width: 3rem;
              height: 3rem;
              display: inline-block;
              vertical-align: middle;
              margin-top: -3px;
              display: block;
              margin: 0 auto;
              img{
                width: 100%;
                height: 100%;
              }
            }
            .l-f{
              font-size: 1rem;
              color: #000;
              margin-left: .4rem;
              margin-top: .71rem;
              display: inline-block;
            }
          }
          // 将背景颜色值定义成变量
            // $purple : #573bc2;
            // $blue : #2a3dc6;
            // $orange : #ea4b3a;
            // $lightblue : #0d85db;

            //将背景颜色以键值对的形式存在map中
            // $bgcolorlist : (
            //     1: $purple,
            //     2: $blue,
            //     3: $orange,
            //     4: $lightblue,
            //   );

            // 使用SASS each语法为每一个li设置background-color
            // @each $i, $color in $bgcolorlist {
            //     .l-list:nth-child(#{$i}) {
            //       background: linear-gradient(to bottom right, $color , lighten($color, 20%));
            //     }
            // }
        }
      }
      .van-swipe__indicators{
        bottom:5px;
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
      padding-bottom: 0.8rem;
      background:#fff;
      margin-bottom:0.8rem;
      .create-head{
        display: block;
      }
    }
    .model{
      .model-header{
        height: 3.04rem;
        line-height: 3.04rem;
        background: #4a79df;
        padding-left: 0.8rem;
        .l-icon{
          display: inline-block;
          vertical-align: middle;
          margin-top: 5px;
          img{
            width: 1.29rem;
            height: 1.5rem;
          }
        }
        .l-f{
          font-size: 1.14rem;
          font-weight: bold;
          color: #fff;
          margin-left: .71rem;
        }
      }
      .model-content{
        padding:0.8rem;
        .line{
          border-bottom:solid 1px #ddd;
          padding-bottom:0.8rem;
        }
        .con-line{
          font-size: 1rem;
          display: flex;
          label{
            display: inline-block;
            line-height: 2rem;
            padding-right: 0.4rem;
            width:31%;
            text-align: right;
          }
          span{
            line-height: 2rem;
          }
        }
        .work-con{
          padding-top: 0.8rem;
        }
        .downNode{
          font-size: 1rem;
          margin-bottom: 0.8rem;
          color:#000;
        }
        .nextNode{
          display: flex;
          flex-wrap: wrap;
          max-height: 15vh;
          overflow-y: scroll;
          li{
            width:49%;
            height:2.5rem;
            line-height: 2.5rem;
            background:#f5f5f5;
            border:solid 1px #e9e9e9;
            border-radius: 3px;
            font-size: 1rem;
            margin-right:2%;
            margin-bottom:0.4rem;
            &:nth-child(even){
              margin-right:0;
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
          max-height: 15vh;
          overflow-y: scroll;
          padding-bottom: 0.8rem;
          border-bottom: solid 1px #ddd;
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
        .work-des{
          color: #999999;
          font-size: 1rem;
          padding: 0.8rem 0 0.4rem 0;
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