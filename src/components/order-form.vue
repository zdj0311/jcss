<template>
    <div class="order-form">
      <div class="evaluation" v-if="mode=='evaluation'">
          <div class="eva-head">

          </div>
          <van-rate v-model="star" icon="like" void-icon="like-o" @change="changeStar"/>
          <van-field type="textarea" v-model="form['publishSuggest']" placeholder="请输入评价"/>
      </div>
      <div class="order" v-else>
        <van-cell-group>
          <template v-for="(item,index) in table">
              <template v-if="item.exist==true">
                <div v-if="item.picker==true" :key="index">
                  <van-field v-model="form[item.key_name]['text']" :label="item.title" placeholder="请选择" @focus="showPicker(item)" readonly/>
                </div>
                <div v-else-if="item.key_name === 'planEndTime' && item.picker==true" :key="index">
                  <van-field v-model="form[item.key_name]" :label="item.title" placeholder="请选择" @focus="showPickerTime" readonly/>
                </div>
                <div v-else-if="item.key_name === 'billRes'">
                  <div v-if="!fData || (fData && fData.workflowConfig.canEditBillRes=='edit')">
                    <van-field :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title" placeholder="请输入"/>
                  </div>
                  <div v-if="fData && fData.workflowConfig.canEditBillRes=='readonly'">
                    <van-field readonly :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title"/>
                  </div>
                </div>
                <div v-else-if="item.key_name === 'workOrderSuggest'">
                  <div v-if="!fData || (fData && fData.workflowConfig.workOrderSuggest=='edit')">
                    <van-field :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title" placeholder="请输入"/>
                  </div>
                  <div v-if="fData && fData.workflowConfig.workOrderSuggest=='readonly'">
                    <van-field readonly :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title"/>
                  </div>
                </div>
                <div v-else-if="item.key_name === 'urgencyValue'">
                  <div v-if="!fData || (fData && fData.workflowConfig.canEditUrgency=='edit')">
                    <van-field v-model="form[item.key_name]['text']" :label="item.title" placeholder="请选择" @focus="showPicker(item)" readonly/>
                  </div>
                  <div v-if="fData && fData.workflowConfig.canEditUrgency=='readonly'">
                    <van-field readonly :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title"/>
                  </div>
                </div>
                <div v-else>
                  <van-field :readonly="item.readonly" :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title" :placeholder="item.readonly?'':'请输入'"/>
                </div>
              </template>
          </template>
        </van-cell-group>
        <van-popup v-model="show" class="pop-container" position="bottom">
          <van-picker :columns="postDic" show-toolbar @cancel="cancel" @confirm="confirm"/>
        </van-popup>
        <van-popup v-model="showTime" class="pop-container" position="bottom">
          <van-datetime-picker v-model="currentDate" type="datetime" @confirm="confirmTime" @cancel="cancelTime"/>
        </van-popup>
          <div class="assets">
          <h2 class="zcflTitle">关联资产</h2>
          <ul class="ificat clearfix tabsList" v-if="!fData">
              <li v-for="(item,index) in assetTypeDic" :key="index" @click="assetsList(item.id,index)" :class="{active:index == itemIndex}">
                <span :dataId="item.id">{{item.assetsTypeName}}</span><i></i>
              </li>
          </ul>
          <ul class="ificat clearfix tabsList" v-else>
              <li v-for="(item,index) in assetTypeDic" :key="index" class="active">
                <span :dataId="item.id">{{item.assetsTypeName}}</span><i></i>
              </li>
          </ul>
          <ul class="ificatList tabs-con on" v-if="!fData">
              <li v-for="(item,index) in assetsDic" :key="index">
                <input type="checkbox" :value="item.id" v-model="assetsRelList"><span>{{item.assetsName}}</span>
              </li>
          </ul>
          <ul class="ificatList tabs-con on" v-else>
              <li v-for="(item,index) in fData.billData.assetsRelList" :key="index">
                <span>{{item.assetsName}}</span>
              </li>
          </ul>
          </div>
          <ul class="authen mb">
              <li>
                  <div class="adDetail-bottom">
                      <h2 class="downNode">下一节点</h2>
                      <ul class="nextNode">
                        <li v-for="(item,index) in nextNodesList" :key="index" @click="toSelectUser()">
                          <input v-if="curNode.choice=='single'" type='radio' v-model='selectNodes' :value='item.componentId'/>
                          <input v-else type='checkbox' v-model='selectNodes' :value='item.componentId'/>
                          <span>{{item.name}}</span>
                        </li>        
                      </ul>
                      <ul class="nextUser clearfix">
                        <li v-for="(item,index) in chooseUser" :key="index">
                          <input v-if="chooseUser.choice=='single'" v-model="selectUsers" class="users" type="radio" :value='item.id'>
                          <input v-else v-model="selectUsers" class="users" type="checkbox" :value='item.id'>
                          <span>{{item.displayName}}</span>
                        </li>
                      </ul>
                  </div>
              </li>
          </ul>
          <ul class="authen nomr">
            <li>
              <div class="authenTab">
                <label class="auTitle">上传附件</label>
                <template v-if="!fData || (fData && fData.workflowConfig.canEditAttach=='edit')">
                  <span class="fileinput-button">
                    <a href="javascript:void(0)" class="clickUp">点击上传</a>
                    <input type="file" class="files" multiple="multiple" @change="fileChange($event)"/>
                  </span>   
                </template>   
              </div>
            </li>
            <ul class="fileList">
              <template v-if="!fData || (fData && fData.workflowConfig.canEditAttach=='edit')">
                <li class="photoList" v-for="(item,index) in files" :key="index">
                  <label class="auTitle">{{item.name}}</label>
                  <div class="delect delete" @click="deleteFile(item.id)">删除</div>
                </li>
              </template>
              <template v-else="fData && fData.workflowConfig.canEditAttach=='readonly'">
                <li class="photoList" v-for="(item,index) in files" :key="index">
                  <label class="auTitle">{{item.name}}</label>
                </li>
              </template>
            </ul>
          </ul>
      </div>
        
        <div class="workflowFormButton">
          <button v-for="(item,index) in button" :key="index" class='btn dark' type='button' @click="subType(item.id)">{{item.name}}</button>
        </div>
    </div>
</template>

<script>
import {getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetType,getAssetsList,startWorkflow,loadWorkflow,updateWorkflow,upload,getNextNodes,deleteFile,evaluation}
 from 'controller/order-create'
 import form from 'utils/form-all'
import tool from 'utils/tool'
export default {
  components: {},
  props: {
    existList: {
      type: Array
    },
    readonlyList: {
      type: Array
    },
    pickerList: {
      type: Array
    },
    create: {
      type: Boolean,
      default: true
    },
    mode: {
      type: String
    }
  },
  data() {
    return {
        fData:null,
        star:1,
        postDic:[],
        customerOrgDic:[],
        btDic:[],
        urgencyDic:[],
        starDic:[],
        customerOrgDic:[],
        customerDic:[],
        projectDic:[],
        projectSubDic:[],
        assetTypeDic:[],
        assetsDic:[],
        keyName:'',
        form:{},
        curNode:{},
        show:false,
        showTime:false,
        button:[],
        chooseUser:[],
        nextNodesList:[],
        selectNodes:'',
        files:[],
        assetsRelList:[],
        itemIndex:null,
        deleteAttachFile:[],
        currentDate: new Date(),
        table:[{
          key_name:'appUserName',
          title:'申请人'
        },{
          key_name:'appUserPhone',
          title:'联系方式'
        },{
          key_name:'startTimeStr',
          title:'申请时间'
        },
        {
          key_name:'customerOrgName',
          title:'客户名称'
        },
        {
          key_name:'customerName',
          title:'客户负责人'
        },
        {
          key_name:'busiTypeName',
          title:'工单类型'
        },
        {
          key_name:'planEndTime',
          title:'工单结束时间'
        },
        {
          key_name:'subject',
          title:'事件主题'
        },
        {
          key_name:'billPlan',
          title:'事件描述',
          type:'textarea'
        },
        {
          key_name:'urgencyValue',
          title:'紧急程度'
        },
        {
          key_name:'projectName',
          title:'项目名称'
        },
        {
          key_name:'subProjectName',
          title:'子项目'
        },
        {
          key_name:'code',
          title:'编码'
        },
        {
          key_name:'billRes',
          title:'事件结果'
        },
        {
          key_name:'billAssess',
          title:'评价等级'
        },
        {
          key_name:'publishSuggest',
          title:'评价',
          type:'textarea'
        },
        {
          key_name:'workOrderSuggest',
          title:'意见',
          type:'textarea'
        },
        ]
    };
  },
  created(){
    if(this.mode=='create'){
      getCustomerOrgDic.bind(this)().then(res=>{
        this.customerOrgDic = res
      })
      getBtDic.bind(this)().then(res=>{
        this.btDic = res
      })
      getUrgencyDic.bind(this)('urgency','jcss').then(res=>{
        this.urgencyDic = res
      })
      this.initTable();
      this.initForm();
    }else{
      // 工作流初始化
      loadWorkflow.bind(this)(tool.getQueryString('id')?tool.getQueryString('id'):280).then(res=>{
        this.fData = res;
        this.initButton(res.workflowBean)
        this.initTable();
        this.initForm(res.billData);
        this.assetTypeDic = [{id:res.billData.assetTypeId,assetsTypeName:res.billData.assetTypeName}]
        this.getNextNodes();
        this.files = res.attachList;
        if(res.workflowConfig.canEditUrgency=='edit'){
          getUrgencyDic.bind(this)('urgency','jcss').then(res=>{
            this.urgencyDic = res
          })
        }
      }) 
      if(this.mode=='evaluation'){
        this.getStar();
      }
    }
  },
  methods: {
      // 显示 picker
      showPicker(item) {
        if(item.key_name=='busiTypeName'){
          this.postDic = this.btDic;
          this.keyName = 'busiTypeName';
        }
        if(item.key_name=='urgencyValue'){
          this.postDic = this.urgencyDic;
          this.keyName = 'urgencyValue';
        }
        if(item.key_name=='customerOrgName'){
          this.postDic = this.customerOrgDic;
          this.keyName = 'customerOrgName';
        }
        if(item.key_name=='customerName'){
          this.postDic = this.customerDic;
          this.keyName = 'customerName';
        }
        if(item.key_name=='projectName'){
          this.postDic = this.projectDic;
          this.keyName = 'projectName';
        }
        if(item.key_name=='subProjectName'){
          this.postDic = this.projectSubDic;
          this.keyName = 'subProjectName';
        }
        this.show = true
      },
      showPickerTime() {
        this.showTime = true;
      },
      // picker 取消时触发
      cancel() {
        this.show = false
      },
      cancelTime() {
        this.showTime = false
      },
      confirmTime(v){
        this.form['planEndTime'] = new Date(v).Format("yyyy-MM-dd hh:mm:ss");;
        this.showTime = false
      },
      // picker 确定时触发
      confirm(v) {
        let _this = this;
        this.form[this.keyName] = v;
        if(this.keyName=='customerOrgName'){
          getCustomerDic.bind(this)(v.code).then(res=>{
            var user = [];
            user = form.showAll(res,user); 
            user.forEach(function(v,k) { 
              _this.customerDic.push({
                code: v.id,
                text: v.displayName
              });
            });
          })
          getProjectDic.bind(this)(v.code).then(res=>{
            this.projectDic = res
          })
          getAssetType.bind(this)(v.code).then(res=>{
            this.assetTypeDic = res;
            this.itemIndex = 0;
            this.form.assetTypeId = this.assetTypeDic[0].id;
            this.form.assetTypeName = this.assetTypeDic[0].assetsTypeName;
            this.assetsList(this.form.assetTypeId,this.itemIndex)
          })
          if(this.form['busiTypeName']!=''){
            this.startWorkflow();
          }
        }
        if(this.keyName=='projectName'){
          getProjectSubDic.bind(this)(this.form['customerOrgName'].code,v.code).then(res=>{
            this.projectSubDic = res
          })
        }
        if(this.keyName=='busiTypeName' && this.form['customerOrgName']!=''){
          this.startWorkflow();
        }
        this.show = false
      },
      initTable() {
        this.table.forEach((item,index)=>{
          item.exist = true;
          item.message = '';
          item.readonly = false;
          item.picker = false;
          if(this.readonlyList && this.readonlyList.includes(index)){
            item.readonly = true;
          }
          if(this.existList && this.existList.includes(index)){
            item.exist = false;
          }
          if(this.pickerList && this.pickerList.includes(index)){
            item.picker = true;
          }
        })
      },   
      initForm(billData){
        if(!billData){
          this.table.forEach((item,index)=>{
            if(item.exist && item.exist==true){
              this.form[item.key_name] = '';
            }
          })
          let user = this.$store.state.admin.user
          this.form.appUser = user.userId;
          this.form.appUserName = user.userName;
          this.form.appUserPhone = user.mobile;
          this.form.startTimeStr = new Date().Format("yyyy-MM-dd hh:mm:ss");
        }else{
          this.form = billData;
        }
      },
      // 初始化按钮
      initButton(workflowBean){
        let _this = this;
        let openType = workflowBean.openType_;
        let lastOperType = workflowBean.lastOperType_;
        let buttonJsonStr = workflowBean.buttonJsonStr;
        if (buttonJsonStr == "") {
            return;
        }
        let buttonJson = eval("(" + buttonJsonStr + ")");
        //<button class='btn dark' id='workflowSubmitBtn' type='button'>提交</button>
        //加载待办按钮
        //1 Submit
        //2 Save
        //3 Reject
        //4 Move
        //5 Goto
        //6 Stop
        //7 Suspend
        //8 Resume
        //1001 GetBack
        if (openType == "TODO") {
          var todoButtonList = buttonJson.todoSystemList;
          if (typeof todoButtonList != "undefined") {
              todoButtonList.forEach(function(v,k){
                if(v.selected){
                  if("TODO" == openType){
                    //当前是暂停状态，则允许回复和拿回
                    if("SUSPEND" == lastOperType){
                      if(v.id=='8'){
                        _this.button.push(v)
                      }
                    }else{
                      //允许提交，转单，暂停
                      if(v.id=='1' || v.id=='4' || v.id=='7'){
                        _this.button.push(v)
                      }
                    }
                  }else if("CREATE"==openType){
                    //创建只允许提交
                    if(v.id=='1'){
                      _this.button.push(v)
                    }
                  }else{
                    _this.button.push(v)
                  }
                }
              })
          }
        }
        //加载已办按钮
        else if (openType == "DONE") {
          var doneButtonList = buttonJson.haveSystemList;
          if (typeof doneButtonList != "undefined") {
            doneButtonList.forEach(function(v,k){
              if(v.selected){
                _this.button.push(v)
              }
            })
          }
       }
      },
      // 开始工作流
      startWorkflow(){
        let _this = this;
        startWorkflow.bind(this)(this.form['customerOrgName'].code,this.form['busiTypeName'].code).then(res=>{
          _this.initButton(res.workflowBean);
          _this.form.curNodeId_ = res.workflowBean.curNodeId_;
          _this.form.definitionId_ = res.workflowBean.definitionId_;
          _this.form.wUserType = res.wUserType;
          _this.form.flowStatus_ = res.workflowBean.flowStatus_
          _this.getNextNodes();
        })
      },
      // 获取资产分类
      assetsList(assetsTypeId,index){
        this.itemIndex = index;
        getAssetsList.bind(this)(this.form['customerOrgName'].code,assetsTypeId).then(res=>{
            this.assetsDic = res
        })
      },
      // 按钮提交
      subType(id){
        if(id=='1'){
          this.showRoute("Submit")
        }else if(id=='2'){
          this.showRoute("Save")
        }else if(id=='3'){
          this.showRoute("Reject")
        }else if(id=='4'){
          this.showRoute("Move")
        }else if(id=='5'){
          this.showRoute("Goto")
        }else if(id=='6'){
          this.showRoute("Stop")
        }else if(id=='7'){
          this.showRoute("Suspend")
        }else if(id=='8'){
          this.showRoute("Resume")
        }else if(id=='1001'){
          this.showRoute("GetBack")
        }
      },
      getForm(){
        this.selectUsers = Array.isArray(this.selectUsers)?this.selectUsers.join(','):this.selectUsers;
        this.assetsRelList = this.assetsRelList.join(',');
        let _this = this;
        this.form.attachFile = '';
        this.files.forEach(function(v,index){
          _this.form.attachFile+=index==0?v.id:','+v.id
        })
        var formData = new FormData();
        formData.append('nowCustomerOrgId', this.fData?this.fData.nowCustomerOrgId:'')
        formData.append('id', this.form.id)
        formData.append('modifyDateStr', this.form.modifyDate)
        formData.append('appUser', this.form.appUser)
        formData.append('appUserName', this.form.appUserName)
        formData.append('appUserPhone', this.form.appUserPhone)
        formData.append('startTimeStr', this.form.startTimeStr)
        formData.append('status', this.form.status)
        formData.append('statusValue', this.form.statusValue)
        formData.append('code', this.form.code)
        formData.append('customerOrg', this.fData?this.fData.billData.customerOrg:this.form.customerOrgName.code)
        formData.append('customerOrgName', this.fData?this.fData.billData.customerOrgName:this.form.customerOrgName.text)
        formData.append('customer', this.fData?this.fData.billData.customer:this.form.customerName.code)
        formData.append('customerName', this.fData?this.fData.billData.customerName:this.form.customerName.text)
        formData.append('busiTypeCode', this.fData?this.fData.billData.busiTypeCode:this.form.busiTypeName.code)
        formData.append('busiTypeName', this.fData?this.fData.billData.busiTypeName:this.form.busiTypeName.text)
        formData.append('urgency', this.fData?this.fData.billData.urgency:this.form.urgencyValue.code)
        formData.append('urgencyValue', this.fData?this.fData.billData.urgencyValue:this.form.urgencyValue.text)
        formData.append('planStartTimeStr', this.form.startTime)
        formData.append('planEndTimeStr', this.form.planEndTime)
        formData.append('subject', this.form.subject)
        formData.append('billPlan', this.form.billPlan)
        formData.append('projectId', this.fData?this.fData.billData.projectId:this.form.projectName.code)
        formData.append('projectName', this.fData?this.fData.billData.projectName:this.form.projectName.text)
        formData.append('subProjectId', this.fData?this.fData.billData.subProjectId:this.form.subProjectName.code)
        formData.append('subProjectName', this.fData?this.fData.billData.subProjectName:this.form.subProjectName.text)
        formData.append('assetTypeId', this.form.assetTypeId)
        formData.append('assetTypeName', this.form.assetTypeName)
        formData.append('billAssess', this.form.billAssess)
        formData.append('publishSuggest', this.form.publishSuggest)
        formData.append('assetsRelList', this.assetsRelList)
        formData.append('attachFile', this.form.attachFile)
        formData.append('deleteAttachFile', this.deleteAttachFile)
        formData.append('attachFileMode', this.form.attachFileMode?this.form.attachFileMode:'EDIT')
        formData.append("workflowBean.curNodeId_",this.fData && this.fData.workflowBean?this.fData.workflowBean.curNodeId_:this.form.curNodeId_)
        formData.append("workflowBean.definitionId_",this.fData && this.fData.workflowBean?this.fData.workflowBean.definitionId_:this.form.definitionId_)
        formData.append("workflowBean.confirmUserId_",this.selectUsers)
        formData.append("workflowBean.confirmNodeId_",this.form.confirmNodeId_)
        formData.append("workflowBean.confirmRouteId_",this.form.confirmRouteId_)
        formData.append("workflowBean.workflowVar_['wUserType']", this.fData && this.fData.wUserType?this.fData.wUserType:this.form.wUserType)
        formData.append("workflowBean.workflowVar_['wCustomerUserId']", this.fData && this.fData.wCustomerUserId?this.fData.wCustomerUserId:'')
        formData.append("workflowBean.taskId_",this.fData && this.fData.workflowBean?this.fData.workflowBean.taskId_:'')
        formData.append("workflowBean.instanceId_",this.fData && this.fData.workflowBean?this.fData.workflowBean.instanceId_:'')
        formData.append("workflowBean.signInfo_",this.fData && this.fData.workflowBean?this.fData.workflowBean.signInfo_:'')
        formData.append("workflowBean.message_",this.form['workOrderSuggest'])
        formData.append("workflowBean.suggestId_",'workOrderSuggest')
        formData.append("workflowBean.submitType_",this.form.submitType_)
        return formData;
      },
      // 意见域
      showRoute(type){
        if(type=='Submit'){
          this.form.submitType_ = "SUBMIT";
          let flowStatus = this.fData?this.fData.workflowBean.flowStatus_:this.form.flowStatus_;
          if (flowStatus == "CREATE") {
              this.$emit('insest', this.getForm())
          } else {
              this.$emit('update', this.getForm())
          }
        }
      },
      // 获取下一节点
      getNextNodes(){
        tool.getNextNode.bind(this)().then(res=>{
            this.nextNodesList = res.nextNodesList;
            this.curNode = res.curNode;
            this.selectNodes = res.nextNodesList[0].componentId;  
            this.show = true;
            this.toSelectUser();
        })
      },
      // 选人
      toSelectUser(){
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
              }
            }
            //配置人员为空,显示人员选择
            if(v.assignees.length == 0) {
              _this.getAllUser(v);    
            }else{
              let assigness = v.assignees;
              let assigneesIds = "", assigneesNames = "";
              assigness.forEach(function(k){
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
                _this.selectUsers = '';
                _this.selectUsers=assigneesIds;
              })
            } 
          }
        })
      },
      // 获取所有人
      getAllUser(nextNodesList){
        getCustomerDic.bind(this)().then(res=>{
          let user = [];
          let assignees = form.showAll(res,user); 
          //单一签核(人员树单选)
          if (nextNodesList.dealType == 4) {
            this.chooseUser = assignees;
            this.chooseUser.choice = 'single'
            this.selectUsers = '';
            this.selectUsers = assignees[0].id;
          }
          //多人处理及多人单一签核(人员树多选)
          else {
            this.chooseUser = assignees;
            this.chooseUser.choice = 'multiple'
            this.selectUsers.push(assignees[0].id);
          }
        })
      },
      // 上传
      fileChange(e){
        let files = e.target.files;
        for(var i=0;i<files.length;i++){
            var formData = new FormData();
            formData.append('businessId',0);
            formData.append('businessTable','ABC_CASES_DATA');
            formData.append('category','ABC_CASES_DATA');
            formData.append('file',files[i]);
            this.upload(formData);
        }
      },
      // 上传
      upload(formData){
        upload.bind(this)(formData).then(res=>{
          this.files.push(res.files[0]);
        })
      },
      // 删除附件
      deleteFile(id){
        var formData = new FormData();
        formData.append('ids',id);
        deleteFile.bind(this)(formData).then(res=>{
          let re = res.data;
          for(let i in re){           
            this.deleteAttachFile.push(i);
            if(re[i]==true){
              this.files.splice(this.files.findIndex(v => v.id == i), 1)
            } 
          }          
        })
      },
      getStar(){
        evaluation.bind(this)('pj_level','jcss').then(res=>{
          this.starDic = res
          console.log(res)
        })
      },
      changeStar(score){
        switch(score){                            
          case 5:               
            this.zname = '非常满意';                
            break; 
          case 4:               
            this.zname = '比较满意';               
            break;
          case 3:               
            this.zname = '满意'; 
            break;
          case 2:               
            this.zname = '不满意';              
            break;   
          case 1:               
            this.zname = '非常不满意';              
            break;                                  
          default:
        }
        this.form.billAssess=s;
      }
  }
};
</script>
<style lang='scss'>
body{
  background:#f2f2f2;
}
.evaluation{
  .eva-head{
    background:#fff;
    border-top:solid 1px #eee;
    border-bottom:solid 1px #eee;
    padding: 1.8rem 0;
  }
}
.order-form{
  
  .adDetail-bottom{
    background:#fff;
    border-top:solid 1px #eee;
    border-bottom:solid 1px #eee;
    padding:0 1.1rem;
    padding-bottom: 1.1rem;
    .downNode{
      font-size: 1rem;
      font-weight: bold;
      color:#000;
      height: 3.2rem;
      line-height: 3.2rem;
      margin: 0;
      font-weight: normal;
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
        li{
          width:32%;
          margin-right:2%;
          height:2.5rem;
          line-height: 2.5rem;
          background:#f5f5f5;
          border:solid 1px #e9e9e9;
          border-radius: 3px;
          padding-left:0.8rem;
          &:last-child{
            margin-right:0;
          }
        }
      }
  }  
  .van-field__label {
    color: #000;
  }
  .authen li .authenTab{
    padding: 0 1.1rem;
    border-bottom:1px solid #eee; 
    border-top:1px solid #eee; 
    background:#fff;
    margin-top:0.8rem;
    display: flex;
    height: 3.28rem;
    line-height: 3.28rem;
    .auTitle{
      font-size:1rem;
    }
    .clickUp{
      float:right;
      font-size: 1rem;
      color:#4a79df;
    }
    .fileinput-button{
      position: relative;
      flex:1;
      input {
        position: absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        -ms-filter: 'alpha(opacity=0)';
        font-size: 200px;
        height: 3.28rem;
      }
    }
    
  }
  
}
.authen{
  background:#fff;
.photoList{
      border-bottom:1px solid #ccc;
      padding: 1rem 1.1rem;
      padding-left: 1rem;
    }
    .delect{
      float: right;
    }
}
.workflowFormButton{
  display: flex;
}
.workflowFormButton button{
    flex: 1;
    background: #4a79df;
    font-size: 1.28rem;
    color: #fff;
    border: none;
    margin-top: 1.1rem;
    height: 3.28rem;
    line-height: 3.28rem;
}
.assets{
  background:#fff;
  padding:0 1.1rem;
  .zcflTitle{
    height: 3.28rem;
    border-top:solid 1px #eee;
    border-bottom:solid 1px #eee;
    line-height:3.28rem;
    background:#fff;
    font-size:1rem;
    color:#000;
    font-weight: normal;
  }
  .ificat{
    display: flex;
    padding-bottom:1rem;
    li{
      width:32%;
      margin-right:2%;
      &:last-child{
        margin-right:0;
        
      }
      height:2.58rem;
        line-height: 2.58rem;
        font-size:1rem;
        color:#000;
        background:#f5f5f5;
        border:solid 1px #e9e9e9;
        text-align: center;
        &.active{
          background:#4a79df;
          color:#fff;
        }
    }
  }
}
</style>