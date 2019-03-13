<template>
    <div class="order-form">
      <van-cell-group>
        <template v-for="(item,index) in table" v-if="item.exist==true">
            <van-field v-if="item.picker==true" v-model="form[item.key_name]['text']" :label="item.title" placeholder="请选择" :error-message="item.message" @focus="showPicker(item)" readonly/>
            <!-- <van-field v-if="item.key_name === 'planEndTime'" 
            v-model="form[item.key_name]['text']" :label="item.title" :placeholder="item.placeholder" :error-message="item.message" @focus="showPicker" readonly/> -->
            <van-field v-else :readonly="item.readonly" :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title" placeholder="请输入" :error-message="item.message" @blur="item.validate(form,table,index)"/>
        </template>
      </van-cell-group>
      <van-popup v-model="show" class="pop-container" position="bottom">
        <van-picker :columns="postDic" show-toolbar @cancel="cancel" @confirm="confirm"/>
      </van-popup>
      <div>
        <h2 class="zcflTitle">资产列表</h2>
        <ul class="ificat clearfix tabsList">
            <li v-for="(item,index) in assetTypeDic" :key="index" @click="assetsList(item.id)">
              <span :dataId="item.id">{{item.assetsTypeName}}</span><i></i>
            </li>
            
        </ul>
        <ul class="ificatList tabs-con on">
            <li v-for="(item,index) in assetsDic" :key="index">
              <input type="checkbox" :value="item.id" ><span>{{item.assetsName}}</span>
            </li>
        </ul>
      </div>
      <ul class="authen mb">
            <li>
                <div class="adDetail-bottom">
                    <h2 class="downNode">节点选择</h2>
                    <ul id="nodesDiv">
                                
                    </ul>
                    
                    <div>
                        <ul class="nextNode clearfix" id="chooseUser"></ul>
                        <ul class="nextNode clearfix" id="selectedUser"></ul>
                    </div>
                </div>
            </li>
        </ul>
        <div class="workflowFormButton">
          <button v-for="(item,index) in button" :key="index" class='btn dark' type='button' @click="subType(item.id)">{{item.name}}</button>
        </div>
    </div>
</template>

<script>
import {getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetType,getAssetsList,startWorkflow,loadWorkflow,updateWorkflow,upload}
 from 'controller/order-create'
//  import form from 'utils/form-all'
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
    let validateEmpty= function(form,table,index) {
        let item = table[index]
        if(!form[item.key_name]) {
            item.message = '请输入';
        }
    }  
    return {
        postDic:[],
        customerOrgDic:[],
        btDic:[],
        urgencyDic:[],
        customerOrgDic:[],
        customerDic:[],
        projectDic:[],
        projectSubDic:[],
        assetTypeDic:[],
        assetsDic:[],
        keyName:'',
        form:{},
        show:false,
        button:[],
        fData:{},
        table:[{
          key_name:'appUserName',
          title:'申请人',
          validate:validateEmpty
        },{
          key_name:'appUserPhone',
          title:'联系方式',
          validate:validateEmpty
        },{
          key_name:'startTimeStr',
          title:'申请时间',
          validate:validateEmpty
        },
        {
          key_name:'customerOrgName',
          title:'客户名称',
          validate:validateEmpty
        },
        {
          key_name:'customerName',
          title:'客户负责人',
          validate:validateEmpty
        },
        {
          key_name:'busiTypeName',
          title:'工单类型',
          validate:validateEmpty
        },
        {
          key_name:'planEndTime',
          title:'工单结束时间',
          validate:validateEmpty
        },
        {
          key_name:'subject',
          title:'事件主题',
          validate:validateEmpty
        },
        {
          key_name:'billPlan',
          title:'事件描述',
          type:'textarea',
          validate:validateEmpty
        },
        {
          key_name:'urgency',
          title:'紧急程度',
          validate:validateEmpty
        },
        {
          key_name:'projectName',
          title:'项目名称',
          validate:validateEmpty
        },
        {
          key_name:'subProjectName',
          title:'子项目',
          validate:validateEmpty
        },
        {
          key_name:'code',
          title:'编码',
          validate:validateEmpty
        },
        {
          key_name:'billRes',
          title:'事件结果',
          validate:validateEmpty
        },
        {
          key_name:'billAssess',
          title:'评价等级',
          validate:validateEmpty
        },
        {
          key_name:'publishSuggest',
          title:'评价',
          type:'textarea',
          validate:validateEmpty
        },
        {
          key_name:'workOrderSuggest',
          title:'意见',
          type:'textarea',
          validate:validateEmpty
        },
        ]
    };
  },
  created(){
    console.log(this.mode)
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
      this.initForm();
    }else if(this.mode=='edit'){
      // 工作流初始化
      loadWorkflow.bind(this)(tool.getQueryString('id')?tool.getQueryString('id'):276).then(res=>{
        this.fData = res;
        this.initButton(res.workflowBean)
        this.initForm(res.billData);
      }) 
    }
    this.initTable();
  },
  methods: {
      // 显示 picker
      showPicker(item) {
        if(item.key_name=='busiTypeName'){
          this.postDic = this.btDic;
          this.keyName = 'busiTypeName';
        }
        if(item.key_name=='urgency'){
          this.postDic = this.urgencyDic;
          this.keyName = 'urgency';
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
      // picker 取消时触发
      cancel() {
        this.show = false
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
            this.assetTypeDic = res
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
          this.form.curNodeId_ = res.workflowBean.curNodeId_;
          this.form.definitionId_ = res.workflowBean.definitionId_;
          this.form.wUserType = res.wUserType;
        })
      },
      // 获取资产分类
      assetsList(assetsTypeId){
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
        return {
          nowCustomerOrgId: this.form.nowCustomerOrgId,
          id: this.form.id,
          modifyDateStr: this.form.modifyDate,
          appUser: this.form.appUser,
          appUserName: this.form.appUserName,
          appUserPhone: this.form.appUserPhone,
          startTimeStr: this.form.startTimeStr,
          status: this.form.status,
          statusValue: this.form.statusValue,
          code: this.form.code,
          customerOrg: this.form.customerOrgName.code,
          customerOrgName: this.form.customerOrgName.text,
          customer: this.form.customerName.code,
          customerName: this.form.customerName.text,
          busiTypeCode: this.form.busiTypeName.code,
          busiTypeName: this.form.busiTypeName.text,
          urgency: this.form.urgency.code,
          urgencyValue: this.form.urgency.text,
          planStartTimeStr: this.form.planStartTime,
          planEndTimeStr: this.form.planEndTime,
          subject: this.form.subject,
          billPlan: this.form.billPlan,
          projectId: this.form.projectName.code,
          projectName: this.form.projectName.text,
          subProjectId: this.form.subProjectName.code,
          subProjectName: this.form.subProjectName.text,
          assetTypeId: this.form.assetTypeId,
          assetTypeName: this.form.assetTypeName,
          billAssess: this.form.billAssess,
          publishSuggest: this.form.publishSuggest,
          assetsRelList:this.form.assetsRelList,
          attachFile:this.form.attachFile,
          deleteAttachFile:this.form.deleteAttachFile,
          attachFileMode:this.form.attachFileMode,

          "workflowBean.curNodeId_":this.fData?this.fData.workflowBean.curNodeId_:this.form.curNodeId_,
          "workflowBean.definitionId_":this.fData?this.fData.workflowBean.definitionId_:this.form.definitionId_,
          "workflowBean.confirmUserId_":this.form.confirmUserId_,
          "workflowBean.confirmNodeId_":this.form.confirmNodeId_,
          "workflowBean.confirmRouteId_":this.form.confirmRouteId_,
          "workflowBean.workflowVar_['wUserType']": this.fData?this.fData.wUserType:this.form.wUserType,
          "workflowBean.workflowVar_['wCustomerUserId']": this.fData?this.fData.wCustomerUserId:'',
          "workflowBean.taskId_":this.fData?this.fData.workflowBean.taskId_:'',
          "workflowBean.instanceId_":this.fData?this.fData.workflowBean.instanceId_:'',
          "workflowBean.signInfo_":this.fData?this.fData.workflowBean.signInfo_:'', 
          "workflowBean.message_":this.form.message_,
          "workflowBean.suggestId_":this.form.suggestId_,
          "workflowBean.submitType_":this.form.submitType_
        }
      },
      // 意见域
      showRoute(type){
        if(type=='Submit'){
          console.log(this.getForm())
        }
      },
  }
};
</script>
<style lang='scss'>
.order-form{
  // .zcflTitle{
  //     width: 2.266667rem;
  //     display: inline-block;
  //     position: relative;
  //     text-align: left;
  //     padding-right: .3rem;
  //     font-size: .426667rem;
  //     font-weight: inherit;
  // }
  // .zcflTitle {
  //     width: 2.9rem !important;
  // }
  // .zcflTitle i{
  //     position: absolute;
  //     top: 0;
  //     color: #f00;
  // }
}

</style>