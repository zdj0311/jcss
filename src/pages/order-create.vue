<template>
  <div class="order-create">
    <!--以后可能会去掉 -->
    <!--<header class="order-header">
      <img :src="exam" />
      <h2>创建工单</h2>
    </header>-->
    <div id="check">
      <!--基本信息 -->
      <div class="info-container">
        <h2>基本信息</h2>
        <!-- 客户名称 -->
        <form-item name="customerOrg" :columns="customerOrgDic" v-model="customerOrg && customerOrg.text" type="select" 
          label="客户名称" required v-validate="'required'" @confirm="confirm($event,'customerOrg')"></form-item>
        <!-- 业务类型 -->  
        <form-item name="workflowRel" :columns="workflowRelDic" v-model="workflowRel && workflowRel.text" type="select" label="业务类型"
           required @confirm="confirm($event,'workflowRel')"></form-item>
        <!-- 工单类型 -->  
        <form-item name="busiType" :columns="busiTypeDic" v-model="busiType && busiType.text" type="select" label="工单类型"
           required @confirm="confirm($event,'busiType')"></form-item>
        <!-- 紧急程度 -->
        <form-item name="urgency" :columns="urgencyDic" v-model="urgency && urgency.text" type="select" label="紧急程度"
           @confirm="confirm($event,'urgency')"></form-item>
        <!-- 工单主题 -->
        <form-item name="subject" v-validate="'required'" v-model="subject" label="工单主题" required :errorMessage="errors.first('subject')"></form-item>
        <!-- 工单描述 -->
        <form-item name="billPlan" v-validate="'required'" type="textarea" v-model="billPlan" label="工单描述" required 
          :errorMessage="errors.first('billPlan')"></form-item>
        <!--<show-more>-->
          <!-- 申请人 -->
          <!--<form-item name="userName" v-model="user.userName" label="申请人" readonly></form-item>-->
          <!-- 联系方式 -->
          <!--<form-item name="mobile" v-model="user.mobile" label="联系方式" readonly></form-item>-->
        <!--</show-more>-->
      </div>
    <!--资产信息 -->
      <div class="info-container" v-if="assetTypeDic.length>0">
        <h2>资产信息</h2>
        <!-- 资产分类 -->
        <div class="asset-container">
          <h3>资产分类</h3>
          <ul class="ificat">
            <li v-for="(item,index) in assetTypeDic" :key="index" :class="{active:index === itemIndex}" @click="changeAsset(item,index)">
              <img :src="check"/>
              <span :dataId="item.id">{{item.assetsTypeName}}</span>
            </li>
          </ul>
        </div>
        <!-- 关联资产 -->
        <div class="asset-container related-asset" v-if="relatedAsset.length>0">
          <h3>关联资产</h3>
          <ul class="ificat">
          <li v-for="(item,index) in relatedAsset" :key="index">
            <input type="checkbox" :value="item.id" v-model="relatedAssetCheck">
            <span>{{ item.assetsName | assetsNameFilter}}</span>
          </li>
        </ul>
        </div>
      </div>
    <!--项目信息 -->
      <div class="info-container">
        <h2>项目信息</h2>
        <!-- 项目名称 -->
        <form-item name="project" :columns="projectDic" v-model="project && project.text" type="select" 
          label="项目名称" @confirm="confirm($event,'project')"></form-item>
        <!-- 子项目名称 -->
        <form-item name="subProject" :columns="subProjectDic" v-model="subProject && subProject.text" type="select" 
          label="子项目名称" @confirm="confirm($event,'subProject')"></form-item>
      </div>
      <!--下一节点 -->
      <!--<div class="info-container">
        <h2 class="downNode">下一节点</h2>
        <ul class="nextNode">
          <li v-for="(item,index) in nextNodesList" :key="index">
            <input v-if="curNode.choice=='single'" type="radio" v-model="selectNodes" :value="item.componentId" name="nodes">
            <input v-else type="checkbox" v-model="selectNodes" :value="item.componentId">
            <span>{{item.name}}</span>
          </li>
        </ul>
        <ul class="nextUser clearfix">
          <li v-for="(item,index) in chooseUser" :key="index">
            <input v-if="chooseUser.choice=='single'" v-model="selectUsers" class="users" type="radio" :value="item.id" name="users">
            <input v-else v-model="selectUsers" class="users" type="checkbox" :value="item.id">
            <span>{{item.displayName}}</span>
          </li>
        </ul>
      </div>-->
      <van-dialog v-model="showNode" show-cancel-button :before-close="beforeCloseNode">
        <div class="model">
          <div class="model-content">
            <div class="work-con">
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
          </div>
        </div>
      </van-dialog>
    <!--附件信息 -->
      <div class="info-container">
        <h2>附件信息</h2>
        <div class="authenTab">
          <label class="auTitle">上传附件</label>
          <template>
            <span class="fileinput-button">
              <a href="javascript:void(0)" class="clickUp">点击上传</a>
              <input type="file" class="files" multiple="multiple" @change="fileChange($event)">
            </span>
          </template>
        </div>
        <!-- 文件列表 -->
        <ul class="fileList">
          <li class="photoList" v-for="(item,index) in files" :key="index">
            <span class="fuj"></span>
            <label class="auTitle">
              <a :href="addPath(item.url+'?fileName='+item.fileName+'&resourcesName='+item.resourcesName)">{{item.name}}</a>
            </label>
            <div class="delect delete" @click="deleteFile(item.id)"></div>
          </li>
        </ul>
      </div>
      <van-button class="submit-btn" @click="submit" size="large">提交</van-button>
    </div>
  </div>
</template>

<script>
import { getCustomerOrgDic,getBtDic,getWkDicList,getUrgencyDic,getAssetType,getAssetsList,getProjectDic
  ,getProjectSubDic,upload,deleteFile,saveWorkflow,startWorkflow,getNextNodes,getCustomerAndJcAllDeptAndUser
} from "controller/orderCreate"
import tool from "utils/tool"
import showMore from 'components/show-more'
import formItem from 'components/form-item'
import exam from 'assets/img/exam.png'
import check from 'assets/check.png'
export default {
  components: { showMore,formItem },
  data() {
    return {
      exam,check,
      user: '',
      // 表单数据项
      customerOrg:{}, // 当前客户
      busiType:{}, // 当前工单类型
      workflowRel:{}, // 当前业务类型
      urgency:{}, // 当前紧急程度
      subject:'', // 当前事件主题
      billPlan: '', // 当前事件描述
      assetType: {}, // 当前资产
      relatedAssetCheck: [], // 关联资产选中值
      project: {}, // 项目
      subProject: {}, //子项目
      
      // 工作流数据
      curNodeId_: '',
      definitionId_: '',
      wUserType: '',
      flowStatus_: '',
      buttonOptJsonStr: '',
      subProcessId_: '',
      //下一节点
      nextNodesList: '',
      curNode: '',
      selectNodes: '',
      // 字典数据    
      customerOrgDic:[], // 客户字典
      busiTypeDic:[], // 工单类型字典
      workflowRelDic:[],// 业务类型字典
      urgencyDic:[], // 紧急程度
      assetTypeDic:[], // 资产分类
      relatedAsset: [], // 关联资产
      projectDic: [], // 项目字典
      subProjectDic: [], // 子项目字典
      clickAble:true, // 提交按钮是否可点击
      itemIndex:0, // 资产分类默认选中值
      files:[], // 文件列表
      deleteAttachFile: [],
      attachFile:[],
      chooseUser:[], // 选择的人
      confirmNodeId_: '',
      confirmRouteId_: '',
      showNode:false, // 下一节点弹出框
    };
  },
  filters: {
    // 临时采取截取字符串保证样式
    assetsNameFilter(v) {
      let _result = v
      if(v.length>= 8) {
        _result = v.substr(0,7) 
      }
      return _result
    }
  },
  mounted() {
    this.user = this.$store.state.admin.user
    this.initialize()
  },
  methods: {
    initialize() {
      // 获取客户名称
      this.getCustomerOrgDic()
      // 获取紧急程度
      this.getUrgencyDic()
      // 获取工单类型
      this.getBtDic()
    },
    // 获取客户picker
    getCustomerOrgDic(code,index) {
      let i = index || 0
      let codeTemp = null
      getCustomerOrgDic.bind(this)().then(res=>{
        this.customerOrgDic = res
        this.customerOrg = res[i]
        codeTemp = code || this.customerOrg.code
        this.getWkDicList(codeTemp)
        this.getAssetType(codeTemp)
        this.getProjectDic(codeTemp)
      })
    },
    // 获取工单分类 picker
    getBtDic() {
      getBtDic.bind(this)().then(res => {
        if(res.length>0) {
          this.busiTypeDic = res
          this.busiType = res[0]
        }else {
          this.$toast('工单类型不能为空！')
        }
      })
    },
    // 获取业务类型 picker
    getWkDicList(code,index) {
      getWkDicList.bind(this)(code).then(res => {
        if(res.length>0) {
          this.workflowRelDic = res
          this.workflowRel = res[0]
          // 获取工作流
          this.startWorkflow()
        }else {
          this.$toast('业务类型不能为空！')
        }
      })
    },
    // 获取紧急程度  picker
    getUrgencyDic(index) {
      getUrgencyDic.bind(this)("urgency", "jcss").then(res=>{
        if(res.length>0) {
            this.urgencyDic = res
            this.urgency = res[0]
          }else {
            
          }
      })
    },
    // 获取资产分类
    getAssetType(code,index) {
      let i = index || 0
      getAssetType.bind(this)(code).then(res=>{
        this.assetTypeDic = res
        if(res.length>0) {
          this.assetType = {
            code: res[i].id,
            text: res[i].assetsTypeName
          }
        }
        this.getRelatedAsset(code,res[i].id)
      })
    },
    // 获取关联资产列表
    getRelatedAsset(code,id) {
      getAssetsList.bind(this)(code,id).then(res=>{
        this.relatedAsset = res
      })
    },
    // 获取项目列表
    getProjectDic(code,index) {
      let i = index || 0
      getProjectDic.bind(this)(code).then(res=>{
        if(res.length>0) {
          this.projectDic = res
//        this.project = res[i]
          if(this.project.code) {
            this.getProjectSubDic(code,res[i].code)
          }
        }else {
            
        }
      })
    },
    // 获取子项目列表
    getProjectSubDic(code,id) {
      getProjectSubDic.bind(this)(code,id).then(res=>{
        if(res.length>0) {
          this.subProjectDic = res
//        this.subProject = res[0]
        }else {
            
        }
      })
    },
    // 提交工单
    createOrResolver() {
      this.files.forEach((v, index) => {
        this.attachFile += index == 0 ? v.id : "," + v.id;
      })
      let form = new FormData()
      form.append('appUser',this.user.userId)
      form.append('appUserName',this.user.userName)
      form.append('appUserPhone',this.user.mobile)
      form.append('startTimeStr',new Date().Format("yyyy-MM-dd hh:mm:ss"))
      form.append('customerOrg',this.customerOrg.code)
      form.append('customerOrgName',this.customerOrg.text)
      form.append('workflowRelCode',this.workflowRel.code)
      form.append('workflowRelName',this.workflowRel.text)
      form.append('busiTypeCode',this.busiType.code)
      form.append('busiTypeName',this.busiType.text)
      form.append('urgency',this.urgency.code)
      form.append('urgencyValue',this.urgency.text)
      form.append('planStartTimeStr',new Date().Format("yyyy-MM-dd hh:mm:ss"))
      form.append('subject',this.subject)
      form.append('billPlan',this.billPlan)
      form.append('projectId',this.project.code?this.project.code:'')
      form.append('projectName',this.project.text?this.project.text:'')
      form.append('subProjectId',this.subProject.code?this.subProject.code:'')
      form.append('subProjectName',this.subProject.text?this.subProject.text:'')
      form.append('assetTypeId',this.assetType.code)
      form.append('assetTypeName',this.assetType.text)
      form.append('assetsRelList',this.relatedAssetCheck.join(","))
      form.append('attachFile',this.attachFile)
      form.append('deleteAttachFile',this.deleteAttachFile)
      form.append('attachFileMode','EDIT')
      // 工作流
      form.append('workflowBean.curNodeId_',this.curNodeId_)
      form.append('workflowBean.definitionId_',this.definitionId_)
      form.append('workflowBean.confirmUserId_',this.selectUsers)
      form.append('workflowBean.confirmNodeId_',this.confirmNodeId_)
      form.append('workflowBean.confirmRouteId_',this.confirmRouteId_)
      form.append("workflowBean.workflowVar_['wUserType']",this.wUserType)
      // 页面没有，但是后台不传会有异常
      form.append("workflowBean.workflowVar_['wCustomerUserId']",'')
      form.append("workflowBean.suggestId_", "workOrderSuggest")
      form.append("workflowBean.signContainerId_","workOrderSuggest_" + new Date().getTime())
      form.append("workflowBean.submitType_","Submit")
//    form.append('workflowBean.flowStatus_',this.flowStatus_)
//    form.append('workflowBean.buttonOptJsonStr',this.buttonOptJsonStr)
//    form.append('workflowBean.subProcessId_',this.subProcessId)
      saveWorkflow.bind(this)(form).then(res=>{
        this.$toast('创建成功！')
        this.clickAble = true
        this.$router.push({
          name: "order_list",
            params: {
              _type: "Day",
               _mode: "TODO"
            }
        })
      })
      .catch(err=>{
        this.$toast(err.message)
        this.clickAble = true
      })
    },
    // 开始工作流
    startWorkflow() {
      startWorkflow.bind(this)(this.customerOrg.code,this.workflowRel.code)
        .then(res => {
          this.curNodeId_ = res.workflowBean.curNodeId_;
          this.definitionId_ = res.workflowBean.definitionId_;
          this.wUserType = res.wUserType;
          this.flowStatus_ = res.workflowBean.flowStatus_;
          this.buttonOptJsonStr = res.workflowBean.buttonOptJsonStr;
          this.subProcessId_ = res.workflowBean.subProcessId_;
//        this.customer = {
//          code: res.data.customer,
//          text: res.data.customerName
//        };
          this.getNextNodes();
        });
    },
    // 获取下一节点
    getNextNodes() {
      let form = new FormData()
      form.append('curNodeId_',this.curNodeId_)
      form.append('definitionId_',this.definitionId_)
      form.append("workflowVar_['wUserType']",this.wUserType)
      getNextNodes.bind(this)(form).then(res => {
        this.nextNodesList = res.nextNodesList
        this.curNode = res.curNode
        this.selectNodes = res.nextNodesList[0].componentId
        this.toSelectUser()
      })
    },
    // 选人
    toSelectUser() {
      this.chooseUser = [];
      let nextNodeId = this.selectNodes;
      let _this = this;
      this.nextNodesList.forEach(function(v) {
        if (v.componentId == nextNodeId) {
          let confirmSequences = "";
          v.channel.forEach(function(item) {
            if (confirmSequences == "") {
              confirmSequences = item.sequenceId;
            } else {
              confirmSequences += "&" + item.sequenceId;
            }
          });
          _this.confirmNodeId_ = nextNodeId;
          _this.confirmRouteId_ = confirmSequences;
          if (v.type == "end") {
            return;
          }
          if (v.userType == "2") {
            if (v.assignees.length != 0) {
              _this.chooseUser = v.assignees;
              _this.chooseUser.choice = "multiple";
              _this.selectUsers = [];
              _this.selectUsers.push(v.assignees[0].id);
            }
          }
          //配置人员为空,显示人员选择
          if (v.assignees.length == 0) {
            _this.getAllUser(v);
          } else {
            let assigness = v.assignees;
            let assigneesIds = "",
              assigneesNames = "";
            assigness.forEach(function(k) {
              if (assigneesIds != "") {
                if (k.oldName != null) {
                  assigneesIds += "," + k.oldId;
                  assigneesNames +=
                    ",(" + k.oldName + ")委托给(" + k.name + ")";
                } else {
                  assigneesIds += "," + k.id;
                  assigneesNames += "," + k.name;
                }
              } else {
                if (k.oldName != null) {
                  assigneesIds = k.oldId;
                  assigneesNames += "(" + k.oldName + ")委托给(" + k.name + ")";
                } else {
                  assigneesIds = k.id;
                  assigneesNames += k.name;
                }
              }
              _this.selectUsers = "";
              _this.selectUsers = assigneesIds;
            });
          }
        }
      });
    },
    // 获取所有人
    getAllUser(nextNodesList) {
      getCustomerAndJcAllDeptAndUser
        .bind(this)(this.customerOrg.code?this.customerOrg.code:this.customerOrg)
        .then(res => {
          let user = [];
          let assignees = tool.showAll(res, user);
          //单一签核(人员树单选)
          if (nextNodesList.dealType == 4) {
            this.chooseUser = assignees;
            this.chooseUser.choice = "single";
            this.selectUsers = "";
            this.selectUsers = assignees[0].id;
          }
          //多人处理及多人单一签核(人员树多选)
          else {
            this.chooseUser = assignees;
            this.chooseUser.choice = "multiple";
            this.selectUsers = [];
            this.selectUsers.push(assignees[0].id);
          }
        });
    },
    // 选择资产分类
    changeAsset(item,index) {
      this.itemIndex = index;
      this.assetType = {
        'code': item.id,
        'text': item.assetsTypeName
      }
      this.getRelatedAsset(this.customerOrg.code,item.id)
    },
    submit() {
      this.showNode = true
    },
    beforeCloseNode(action, done) {
      if(!this.clickAble) return
      if (action === 'confirm') {
        this.$validator.validateAll().then(result=>{
          if(result) {
            this.clickAble = false
            this.createOrResolver()
          }
          done()
        })
      }else { done() }
    },
    confirm(v,property) {
      this[property] = v
      // 切换客户
      if(property === 'customerOrg') {
        this.getWkDicList(v.code)
        this.getAssetType(v.code)
        this.getProjectDic(v.code)
      }
      // 切换工单列表
      if(property === 'busiType') {
        
      }
      // 切换业务列表
      if(property === 'workflowRel') {
        // 获取工作流
        this.startWorkflow()
      }
      // 切换项目
      if(property === 'project') {
        this.getProjectSubDic(this.customerOrg.code,v.code)
      }
      // 切换子项目
      if(property === 'subProject') {
        
      }
    },
    // 文件上传
    fileChange(e) {
      let files = e.target.files;
      for (var i = 0; i < files.length; i++) {
        var formData = new FormData();
        formData.append("businessId", 0);
        formData.append("businessTable", "ABC_CASES_DATA");
        formData.append("category", "ABC_CASES_DATA");
        formData.append("file", files[i]);
        this.upload(formData);
      }
    },
    // 上传
    upload(formData) {
      upload.bind(this)(formData).then(res => {
        this.files.push(res.files[0]);
      });
    },
    // 删除附件
    deleteFile(id) {
      var formData = new FormData();
      formData.append("ids", id);
      deleteFile
        .bind(this)(formData)
        .then(res => {
          let re = res.data;
          for (let i in re) {
            this.deleteAttachFile.push(i);
            if (re[i] == true) {
              this.files.splice(this.files.findIndex(v => v.id == i), 1);
            }
          }
        });
    },
  }
};
</script>
<style lang='scss'>
  .order-create {
    .order-header {
      display:flex;
      background:#fff;
      margin-bottom:1rem;
      justify-content: center;
      align-items: center;
      padding:.6rem 0;
      img {
        width:30px;
        height:auto;
        margin-right:1rem;
      }
      h2 {
        font-size:1.2rem;
        font-weight: bold;
      }
    }
    background:#f2f2f2;
    .info-container {
      padding-top:1rem;
      background:#fff;
      margin-bottom:1rem;
      h2 {
        font-size: 1.1rem;
        font-weight: bold;
        margin-left: 1rem;
      }
      .related-asset {
        border-top:1px solid #f0f0f0;
      }
      .asset-container {
        padding:1rem 1rem 0 1rem;
        ul {
          padding:.6rem;
        }
        .ificat {
          display: flex;
          flex-wrap: wrap;
        }
        li {
          width: 31%;
          margin-right: 2%;
          margin-top: 0.4rem;
          &:last-child {
            margin-right: 0;
          }
          display:flex;
          align-items:center;
          padding:.4rem;
          color: #000;
          background: #f5f5f5;
          border: solid 1px #e9e9e9;
          img {
            width:1.07rem;
            height:1.07rem;
            background:#ddd;
            margin:0 .6rem;
          }
          &.active {
            /*background: #4a79df;
            color: #fff;*/
           img {
              background:#4a79df;
            }
          }
        }
      }
    }
    .authenTab {
      display:flex;
      padding: 1rem;
      justify-content: space-between;
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
        height: 3.28rem;
      }
    }
  }
  .photoList {
    border-bottom: 1px solid #eee;
    margin: 0 1.1rem;
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
  .submit-btn {
    color:#fff;
    margin-top: 2rem;
    background:#4a79df;
  }
    /* 下一节点*/
    .downNode {
      font-size: 1.1rem;
      font-weight: bold;
      padding:1rem;
    }
    .nextNode {
      display: flex;
      flex-wrap: wrap;
      padding:0 1rem;
      max-height:15vh;
      overflow-y:scroll;
      li {
        width: 49%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #f5f5f5;
        border: solid 1px #e9e9e9;
        border-radius: 3px;
        margin-right: 2%;
        margin-bottom: 0.4rem;
        &:nth-child(even) {
          margin-right: 0;
        }
        padding-left: 0.8rem;
      }
      padding-bottom: 0.8rem;
      border-bottom: dashed 1px #ddd;
    }
    .nextUser {
      display: flex;
      padding:.8rem 1rem 0 1rem;
      flex-wrap: wrap;
      max-height:15vh;
      overflow-y:scroll;
      li {
        width: 49%;
        margin-right: 2%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #f5f5f5;
        border: solid 1px #e9e9e9;
        border-radius: 3px;
        padding-left: 0.8rem;
        margin-bottom: 0.4rem;
        &:nth-child(even) {
          margin-right: 0;
        }
      }
    }
    .model-content {
      
    }
    input[type="radio"],
    input[type="checkbox"] {
      width: 1.07rem;
      height: 1.07rem;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      line-height: 1.07rem;
      position: relative;
      margin-top: -2px;
      margin-right: 0.36rem;
    }
    input[type="radio"]::before,
    input[type="checkbox"]::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      background: #ddd url("~@/assets/check.png");
      width: 100%;
      height: 100%;
      background-size: 1.07rem 1.07rem;
    }
    input[type="radio"]::before {
      border-radius: 50%;
    }
    input[type="radio"]:checked::before,
    input[type="checkbox"]:checked::before {
      content: "";
      background: #4a79df url("~@/assets/check.png");
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: 1.07rem 1.07rem;
    }
    .van-cell {
      border-bottom: 1px solid #F0F0F0;
    }
  }
</style>