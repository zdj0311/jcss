<template>
  <div class="order-form">
    <div class="evaluation" v-if="mode=='evaluation'">
      <div class="eva-head">
        {{fData && fData.billData.statusValue}}{{fData && fData.billData.customerOrgName}}-{{fData && fData.billData.subject}}
        事件结果{{fData && fData.billData.billRes}}
      </div>
      <div class="eva-content">本次服务的评价
        <van-rate v-model="star" icon="like" void-icon="like-o" @change="changeStar"/>
        {{zname}}
        <van-field type="textarea" v-model="form['publishSuggest']" placeholder="请输入评价"/>
      </div>
    </div>
    <div class="order" v-else>
      <van-cell-group>
        <template v-for="(item,index) in table">
          <template v-if="item.exist==true">
           <div v-if="item.picker==true && item.key_name !== 'planEndTime'" :key="index">
              <van-field
                v-model="form[item.key_name]['text']"
                :label="item.title"
                placeholder="请选择"
                @focus="showPicker(item)"
                readonly
                :required="item.required"
                :error-message="item.message" 
                @blur="item.validate?item.validate(index):''"
              />
            </div>
           <div v-else-if="item.key_name === 'planEndTime' && item.picker==true" :key="index">
              <van-field
                v-model="form[item.key_name]"
                :label="item.title"
                placeholder="请选择"
                @focus="showPickerTime"
                readonly
              />
            </div>
            <div v-else-if="item.key_name === 'billRes'">
              <div v-if="!fData || (fData && fData.workflowConfig.canEditBillRes=='edit')">
                <van-field
                  :type="item.type?item.type:'input'"
                  v-model="form[item.key_name]"
                  :label="item.title"
                  placeholder="请输入"
                />
              </div>
              <div v-if="fData && fData.workflowConfig.canEditBillRes=='readonly'">
                <van-field
                  readonly
                  :type="item.type?item.type:'input'"
                  v-model="form[item.key_name]"
                  :label="item.title"
                />
              </div>
            </div>
            <div v-else-if="item.key_name === 'workOrderSuggest'">
              <div v-if="!fData || (fData && fData.workflowConfig.workOrderSuggest=='edit')">
                <van-field
                  :type="item.type?item.type:'input'"
                  v-model="form[item.key_name]"
                  :label="item.title"
                  placeholder="请输入"
                />
              </div>
              <div v-if="fData && fData.workflowConfig.workOrderSuggest=='readonly'">
                <van-field
                  readonly
                  :type="item.type?item.type:'input'"
                  v-model="form[item.key_name]"
                  :label="item.title"
                />
              </div>
            </div>
            <div v-else-if="item.key_name === 'urgencyValue'">
              <div v-if="!fData || (fData && fData.workflowConfig.canEditUrgency=='edit')">
                <van-field
                  v-model="urgencyValueText"
                  :label="item.title"
                  placeholder="请选择"
                  @focus="showPicker(item)"
                  readonly
                />
              </div>
             <div v-if="fData && fData.workflowConfig.canEditUrgency=='readonly'">
                <van-field
                  readonly
                  :type="item.type?item.type:'input'"
                  v-model="form[item.key_name]"
                  :label="item.title"
                />
              </div>
            </div>
            <div v-else>
              <van-field
                :readonly="item.readonly"
                :type="item.type?item.type:'input'"
                v-model="form[item.key_name]"
                :label="item.title"
                :placeholder="item.readonly?'':'请输入'"
                :required="item.required"
                :error-message="item.message" 
                @blur="item.validate?item.validate(index):''"
              />
            </div>
          </template>
        </template>
      </van-cell-group>
      <van-popup v-model="show" class="pop-container" position="bottom">
        <van-picker :columns="postDic" show-toolbar @cancel="cancel" @confirm="confirm"/>
      </van-popup>
      <van-popup v-model="showTime" class="pop-container" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          @confirm="confirmTime"
          @cancel="cancelTime"
        />
      </van-popup>
      <div class="assets">
        <h2 class="zcflTitle">关联资产</h2>
        <ul class="ificat clearfix tabsList" v-if="!fData">
          <li
            v-for="(item,index) in assetTypeDic"
            :key="index"
            @click="assetsList(item.id,index)"
            :class="{active:index == itemIndex}"
          >
            <span :dataId="item.id">{{item.assetsTypeName}}</span>
            <i></i>
          </li>
        </ul>
        <ul class="ificat clearfix tabsList" v-else>
          <li v-for="(item,index) in assetTypeDic" :key="index" class="active">
            <span :dataId="item.id">{{item.assetsTypeName}}</span>
            <i></i>
          </li>
        </ul>
        <ul class="ificatList tabs-con on" v-if="!fData">
          <li v-for="(item,index) in assetsDic" :key="index">
            <input type="checkbox" :value="item.id" v-model="assetsRelList">
            <span>{{item.assetsName}}</span>
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
              <li v-for="(item,index) in nextNodesList" :key="index">
                <input
                  v-if="curNode.choice=='single'"
                  type="radio"
                  v-model="selectNodes"
                  :value="item.componentId"
                  name="nodes"
                >
                <input v-else type="checkbox" v-model="selectNodes" :value="item.componentId">
                <span>{{item.name}}</span>
              </li>
            </ul>
            <ul class="nextUser clearfix">
              <li v-for="(item,index) in chooseUser" :key="index">
                <input
                  v-if="chooseUser.choice=='single'"
                  v-model="selectUsers"
                  class="users"
                  type="radio"
                  :value="item.id"
                  name="users"
                >
                <input v-else v-model="selectUsers" class="users" type="checkbox" :value="item.id">
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
                <input type="file" class="files" multiple="multiple" @change="fileChange($event)">
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
      <button
        v-for="(item,index) in button"
        :key="index"
        class="btn dark"
        type="button"
        @click="subType(item.id)"
      >{{item.name}}</button>
    </div>
    <van-dialog v-model="showReject" show-cancel-button :before-close="beforeCloseReject">
      <ul class="table">
        <li v-for="(item,index) in rejectNodeList" :key="index">
          <template v-if="isReject(item)"> 
            <input type="radio" name="rejectSelectRadio" :value="item.id" v-model="nodeReject">
            {{item.name}}
          </template>
        </li>
      </ul>
    </van-dialog>
    <van-dialog v-model="showGoto" show-cancel-button :before-close="beforeCloseGoto">
      <ul class="table">
        <li v-for="(item,index) in gotoNodesList" :key="index">
          <template v-if="isGoto(item)">
            <input type="radio" name="gotoSelectRadio" :value="item.componentId" v-model="nodeGoto">
            {{item.name}}
          </template>
        </li>
      </ul>
    </van-dialog>
    <van-dialog v-model="showMove" show-cancel-button :before-close="beforeCloseMove">
      <ul class="table">
        <li v-for="(item,index) in userMove" :key="index">
          <input name="users" type="radio" :value="item.id" v-model="usersMove">
          <span>{{item.displayName}}</span>
        </li>
      </ul>
    </van-dialog>
  </div>
</template>

<script>
import {
  getCustomerOrgDic,
  getBtDic,
  getCustomerDic,
  getUrgencyDic,
  getProjectDic,
  getProjectSubDic,
  getAssetType,
  getAssetsList,
  startWorkflow,
  loadWorkflow,
  updateWorkflow,
  upload,
  getNextNodes,
  getGotoNodes,
  deleteFile,
  evaluation
} from "controller/order-create";
import tool from "utils/tool";
import { Dialog } from "vant";
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
    modeView: {
      type: String
    },
    required: {
      type: Array
    }
  },
  data() {
    return {
      check:[],
      gotoNodesList: [],
      showGoto: false,
      nodeGoto: [],
      userMove: [],
      showMove: false,
      usersMove: "",
      showReject: false,
      rejectNodeList: [],
      nodeReject: "",
      fData: null,
      star: 0,
      postDic: [],
      customerOrgDic: [],
      btDic: [],
      urgencyDic: [],
      starDic: [],
      customerOrgDic: [],
      customerDic: [],
      projectDic: [],
      projectSubDic: [],
      assetTypeDic: [],
      assetsDic: [],
      keyName: "",
      form: {},
      curNode: {},
      show: false,
      showTime: false,
      button: [],
      chooseUser: [],
      nextNodesList: [],
      selectNodes: "",
      files: [],
      assetsRelList: [],
      itemIndex: null,
      deleteAttachFile: [],
      currentDate: new Date(),
      mode: "",
      zname: "",
      scores: [
        { zscore: "5", name: "非常满意" },
        { zscore: "4", name: "比较满意" },
        { zscore: "3", name: "满意" },
        { zscore: "2", name: "不满意" },
        { zscore: "1", name: "非常不满意" }
      ],
      table: [
        {
          key_name: "appUserName",
          title: "申请人"
        },
        {
          key_name: "appUserPhone",
          title: "联系方式"
        },
        {
          key_name: "startTimeStr",
          title: "申请时间"
        },
        {
          key_name: "customerOrgName",
          title: "客户",
          validate:this.validateEmpty
        },
        {
          key_name: "busiTypeName",
          title: "工单类型",
          validate:this.validateEmpty
        },
        {
          key_name: "customerName",
          title: "客户负责人"
        },
        {
          key_name: "planEndTime",
          title: "工单结束时间"
        },
        {
          key_name: "subject",
          title: "事件主题",
          validate:this.validateEmpty,
          readonly: false
        },
        {
          key_name: "billPlan",
          title: "事件描述",
          type: "textarea",
          validate:this.validateEmpty,
          readonly: false
        },
        {
          key_name: "urgencyValue",
          title: "紧急程度"
        },
        {
          key_name: "projectName",
          title: "项目名称"
        },
        {
          key_name: "subProjectName",
          title: "子项目"
        },
        {
          key_name: "code",
          title: "编码"
        },
        {
          key_name: "billRes",
          title: "事件结果"
        },
        {
          key_name: "billAssess",
          title: "评价等级"
        },
        {
          key_name: "publishSuggest",
          title: "评价",
          type: "textarea"
        },
        {
          key_name: "workOrderSuggest",
          title: "意见",
          type: "textarea"
        }
      ]
    };
  },
  watch:{
    selectNodes(){
      this.toSelectUser();
    }
  },
  created() {
    if (this.modeView == "create") {
      getCustomerOrgDic
        .bind(this)()
        .then(res => {
          this.customerOrgDic = res;
        });
      getBtDic
        .bind(this)()
        .then(res => {
          this.btDic = res;
        });
      getUrgencyDic
        .bind(this)("urgency", "jcss")
        .then(res => {
          this.urgencyDic = res;
        });
      this.initTable();
      this.initForm();
    } else {
      // 工作流初始化
      loadWorkflow
        .bind(this)(this.$route.id?this.$route.id: 20)
        .then(res => {
          this.fData = res;
          this.initButton(res.workflowBean);
          this.initTable();
          this.initForm(res.billData);
          this.assetTypeDic = [
            {
              id: res.billData.assetTypeId,
              assetsTypeName: res.billData.assetTypeName
            }
          ];
          this.getNextNodes();
          this.files = res.attachList;
          if (res.workflowConfig.canEditUrgency == "edit") {
            this.urgencyValueText = this.form.urgencyValue?this.form.urgencyValue:'';
            getUrgencyDic
              .bind(this)("urgency", "jcss")
              .then(res => {
                this.urgencyDic = res; 
              });
          }
          // 是否跳评价页
          if(res.workflowBean.openType_=='VIEW' && res.workflowConfig.canEditEvaluate=='edit'){
            this.mode = "evaluation";
            this.getStar();
          }
        });
    }
  },
  methods: {
    // 显示 picker
    showPicker(item) {
      if (item.key_name == "busiTypeName") {
        this.postDic = this.btDic;
        this.keyName = "busiTypeName";
      }
      if (item.key_name == "urgencyValue") {
        this.postDic = this.urgencyDic;
        this.keyName = "urgencyValue";
      }
      if (item.key_name == "customerOrgName") {
        this.postDic = this.customerOrgDic;
        this.keyName = "customerOrgName";
      }
      if (item.key_name == "customerName") {
        this.postDic = this.customerDic;
        this.keyName = "customerName";
      }
      if (item.key_name == "projectName") {
        this.postDic = this.projectDic;
        this.keyName = "projectName";
      }
      if (item.key_name == "subProjectName") {
        this.postDic = this.projectSubDic;
        this.keyName = "subProjectName";
      }
      this.show = true;
    },
    showPickerTime() {
      this.showTime = true;
    },
    // picker 取消时触发
    cancel() {
      this.show = false;
    },
    cancelTime() {
      this.showTime = false;
    },
    confirmTime(v) {
      this.form["planEndTime"] = new Date(v).Format("yyyy-MM-dd hh:mm:ss");
      this.showTime = false;
    },
    // picker 确定时触发
    confirm(v) {
      let _this = this;
      this.form[this.keyName] = v;
      this.validateEmpty(3);
      this.validateEmpty(4);
      if (this.keyName == "customerOrgName") {
        getCustomerDic
          .bind(this)(v.code)
          .then(res => {
            var user = [];
            user = tool.showAll(res, user);
            user.forEach(function(v, k) {
              _this.customerDic.push({
                code: v.id,
                text: v.displayName
              });
            });
          });
        getProjectDic
          .bind(this)(v.code)
          .then(res => {
            this.projectDic = res;
          });
        getAssetType
          .bind(this)(v.code)
          .then(res => {
            this.assetTypeDic = res;
            this.itemIndex = 0;
            this.form.assetTypeId = this.assetTypeDic[0].id;
            this.form.assetTypeName = this.assetTypeDic[0].assetsTypeName;
            this.assetsList(this.form.assetTypeId, this.itemIndex);
          });
        if (this.form["busiTypeName"] != "") {
          this.startWorkflow();
        }
      }
      if (this.keyName == "projectName") {
        getProjectSubDic
          .bind(this)(this.form["customerOrgName"].code, v.code)
          .then(res => {
            this.projectSubDic = res;
          });
      }
      if (
        this.keyName == "busiTypeName" &&
        this.form["customerOrgName"] != ""
      ) {
        this.startWorkflow();
      }
      if (
        this.keyName == "urgencyValue"
      ) {
        this.urgencyValueText = v.text;
      }
      this.show = false;
    },
    // 初始化
    initTable() {
      this.table.forEach((item, index) => {
        item.exist = true;
        item.message = "";
        item.readonly = false;
        item.picker = false;
        if (this.readonlyList && this.readonlyList.includes(index)) {
          item.readonly = true;
        }
        if (this.existList && this.existList.includes(index)) {
          item.exist = false;
        }
        if (this.pickerList && this.pickerList.includes(index)) {
          item.picker = true;
        }
        if (this.required && this.required.includes(index)) {
          item.required = true;
        }
      });
    },
    initForm(billData) {
      if (!billData) {
        this.table.forEach((item, index) => {
          if (item.exist && item.exist == true) {
            this.form[item.key_name] = "";
          }
        });
        let user = this.$store.state.admin.user;
        this.form.appUser = user.userId;
        this.form.appUserName = user.userName;
        this.form.appUserPhone = user.mobile;
        this.form.startTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
      } else {
        this.form = billData;
      }
    },
    // 校验非空
    validateEmpty(index) {
      let item = this.table[index];
      if(!this.form[item.key_name]) {  
        item.message = '请输入' + item.title
        this.setCheck(index,false)
      }else {
        item.message = ''
        this.setCheck(index,true)
      }
    },
    // 判断当前校验项是否通过
    setCheck(index,val) {
      this.check[index] = val
    },
    // 初始化按钮
    initButton(workflowBean) {
      let _this = this;
      let openType = workflowBean.openType_;
      let lastOperType = workflowBean.lastOperType_;
      let buttonJsonStr = workflowBean.buttonJsonStr;
      if (buttonJsonStr == "") {
        return;
      }
      let buttonJson = eval("(" + buttonJsonStr + ")");
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
          todoButtonList.forEach(function(v, k) {
            if (v.selected) {
              if ("TODO" == openType) {
                //当前是暂停状态，则允许回复和拿回
                if ("SUSPEND" == lastOperType) {
                  if (v.id == "8") {
                    _this.button.push(v);
                  }
                } else {
                  //允许提交，转单，暂停
                  if (v.id == "1" || v.id == "4" || v.id == "7") {
                    _this.button.push(v);
                  }
                }
              } else if ("CREATE" == openType) {
                //创建只允许提交
                if (v.id == "1") {
                  _this.button.push(v);
                }
              } else {
                _this.button.push(v);
              }
            }
          });
        }
      }
      //加载已办按钮
      else if (openType == "DONE") {
        var doneButtonList = buttonJson.haveSystemList;
        if (typeof doneButtonList != "undefined") {
          doneButtonList.forEach(function(v, k) {
            if (v.selected) {
              _this.button.push(v);
            }
          });
        }
      }
    },
    // 开始工作流
    startWorkflow() {
      let _this = this;
      startWorkflow
        .bind(this)(
          this.form["customerOrgName"].code,
          this.form["busiTypeName"].code
        )
        .then(res => {
          _this.initButton(res.workflowBean);
          _this.form.curNodeId_ = res.workflowBean.curNodeId_;
          _this.form.definitionId_ = res.workflowBean.definitionId_;
          _this.form.wUserType = res.wUserType;
          _this.form.flowStatus_ = res.workflowBean.flowStatus_;
          _this.form.buttonOptJsonStr = res.workflowBean.buttonOptJsonStr;
          _this.form.subProcessId_ = res.workflowBean.subProcessId_;
          _this.getNextNodes();
        });
    },
    // 获取资产分类
    assetsList(assetsTypeId, index) {
      this.itemIndex = index;
      getAssetsList
        .bind(this)(this.form["customerOrgName"].code, assetsTypeId)
        .then(res => {
          this.assetsDic = res;
        });
    },
    // 按钮提交
    subType(id) {
      if (id == "1") {
        this.showRoute("Submit");
      } else if (id == "2") {
        this.showRoute("Save");
      } else if (id == "3") {
        this.showRoute("Reject");
      } else if (id == "4") {
        this.showRoute("Move")
      } else if (id == "5") {
        this.showRoute("Goto");
      } else if (id == "6") {
        this.showRoute("Stop");
      } else if (id == "7") {
        this.showRoute("Suspend");
      } else if (id == "8") {
        this.showRoute("Resume");
      } else if (id == "1001") {
        this.showRoute("GetBack");
      }
    },
    isNull(it){
      return it&&'null' != it?it:"";
    },
    getForm() {
      this.selectUsers = Array.isArray(this.selectUsers)
        ? this.selectUsers.join(",")
        : this.selectUsers;
      this.assetsRelList = typeof(this.assetsRelList)=='array'?this.assetsRelList.join(","):this.isNull(this.assetsRelList);
      let _this = this;
      this.form.attachFile = "";
      this.files.forEach(function(v, index) {
        _this.form.attachFile += index == 0 ? v.id : "," + v.id;
      });
      var formData = new FormData();
      formData.append(
        "nowCustomerOrgId",
        this.fData ? this.isNull(this.fData.nowCustomerOrgId) : null
      );
      formData.append("id", this.isNull(this.form.id));
      formData.append("modifyDateStr", this.isNull(this.form.modifyDate));
      formData.append("appUser", this.isNull(this.form.appUser));
      formData.append("appUserName", this.isNull(this.form.appUserName));
      formData.append("appUserPhone", this.isNull(this.form.appUserPhone));
      formData.append("startTimeStr", this.isNull(this.form.startTime));
      formData.append("status", this.isNull(this.form.status));
      formData.append("statusValue", this.isNull(this.form.statusValue));
      formData.append("code", this.isNull(this.form.code));
      formData.append(
        "customerOrg",
        this.fData
          ? this.isNull(this.fData.billData.customerOrg)
          : this.isNull(this.form.customerOrgName.code)
      );
      formData.append(
        "customerOrgName",
        this.fData
          ? this.isNull(this.fData.billData.customerOrgName)
          : this.isNull(this.form.customerOrgName.text)
      );
      formData.append(
        "customer",
        this.fData ? this.isNull(this.fData.billData.customer) : this.isNull(this.form.customerName.code)
      );
      formData.append(
        "customerName",
        this.fData
          ? this.isNull(this.fData.billData.customerName)
          : this.isNull(this.form.customerName.text)
      );
      formData.append(
        "busiTypeCode",
        this.fData
          ? this.isNull(this.fData.billData.busiTypeCode)
          : this.isNull(this.form.busiTypeName.code)
      );
      formData.append(
        "busiTypeName",
        this.fData
          ? this.isNull(this.fData.billData.busiTypeName)
          : this.isNull(this.form.busiTypeName.text)
      );
      formData.append(
        "urgency",
        this.fData ? this.isNull(this.fData.billData.urgency) : this.isNull(this.form.urgencyValue.code)
      );
      formData.append(
        "urgencyValue",
        this.fData
          ? this.isNull(this.fData.billData.urgencyValue)
          : this.isNull(this.form.urgencyValue.text)
      );
      formData.append("planStartTimeStr", this.isNull(this.form.startTime));
      formData.append("planEndTimeStr", this.isNull(this.form.planEndTime));
      formData.append("subject", this.isNull(this.form.subject));
      formData.append("billPlan", this.isNull(this.form.billPlan));
      formData.append(
        "projectId",
        this.fData ? this.isNull(this.fData.billData.projectId) : this.isNull(this.form.projectName.code)
      );
      formData.append(
        "projectName",
        this.fData
          ? this.isNull(this.fData.billData.projectName)
          : this.isNull(this.form.projectName.text)
      );
      formData.append(
        "subProjectId",
        this.fData
          ? this.isNull(this.fData.billData.subProjectId)
          : this.isNull(this.form.subProjectName.code)
      );
      formData.append(
        "subProjectName",
        this.fData
          ? this.isNull(this.fData.billData.subProjectName)
          : this.isNull(this.form.subProjectName.text)
      );
      formData.append("assetTypeId", this.isNull(this.form.assetTypeId));
      formData.append("assetTypeName", this.isNull(this.form.assetTypeName));
      formData.append("billAssess", this.isNull(this.form.billAssess));
      formData.append("publishSuggest", this.isNull(this.form.publishSuggest));
      formData.append("assetsRelList", this.isNull(this.assetsRelList));
      formData.append("attachFile", this.isNull(this.form.attachFile));
      formData.append("deleteAttachFile", this.isNull(this.deleteAttachFile));
      formData.append(
        "attachFileMode",
        this.form.attachFileMode ? this.isNull(this.form.attachFileMode) : "EDIT"
      );
      formData.append(
        "workflowBean.curNodeId_",
        this.fData && this.fData.workflowBean
          ? this.isNull(this.fData.workflowBean.curNodeId_)
          : this.isNull(this.form.curNodeId_)
      );
      formData.append(
        "workflowBean.definitionId_",
        this.fData && this.fData.workflowBean
          ? this.isNull(this.fData.workflowBean.definitionId_)
          : this.isNull(this.form.definitionId_)
      );
      formData.append("workflowBean.confirmUserId_", this.isNull(this.selectUsers));
      formData.append("workflowBean.confirmNodeId_", this.isNull(this.form.confirmNodeId_));
      formData.append(
        "workflowBean.confirmRouteId_",
        this.isNull(this.form.confirmRouteId_)
      );
      formData.append(
        "workflowBean.workflowVar_['wUserType']",
        this.fData && this.fData.wUserType
          ? this.isNull(this.fData.wUserType)
          : this.isNull(this.form.wUserType)
      );
      formData.append(
        "workflowBean.workflowVar_['wCustomerUserId']",
        this.fData && this.fData.wCustomerUserId
          ? this.isNull(this.fData.wCustomerUserId)
          : null
      );
      formData.append(
        "workflowBean.taskId_",
        this.fData && this.fData.workflowBean
          ? this.isNull(this.fData.workflowBean.taskId_)
          : null
      );
      formData.append(
        "workflowBean.instanceId_",
        this.fData && this.fData.workflowBean
          ? this.isNull(this.fData.workflowBean.instanceId_)
          : null
      );
      formData.append(
        "workflowBean.signInfo_",
        this.fData && this.fData.workflowBean
          ? this.isNull(this.fData.workflowBean.signInfo_)
          : null
      );
      formData.append("workflowBean.message_", this.isNull(this.form["workOrderSuggest"]));
      formData.append("workflowBean.suggestId_", "workOrderSuggest");
      formData.append("workflowBean.submitType_", this.isNull(this.form.submitType_));
      return formData;
    },
    // 获取下一节点
    getNextNodes() {
      tool.getNextNode
        .bind(this)()
        .then(res => {
          this.nextNodesList = res.nextNodesList;
          this.curNode = res.curNode;
          this.selectNodes = res.nextNodesList[0].componentId;
          this.toSelectUser();
        });
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
          _this.form.confirmNodeId_ = nextNodeId;
          _this.form.confirmRouteId_ = confirmSequences;
          if (v.type == "end") {
            return;
          }
          if (v.userType == "2") {
            if (v.assignees.length != 0) {
              _this.chooseUser = v.assignees;
              _this.chooseUser.choice = "multiple";
              _this.selectUsers = [];
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
      getCustomerDic
        .bind(this)()
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
            this.selectUsers.push(assignees[0].id);
          }
        });
    },
    // 上传
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
      upload
        .bind(this)(formData)
        .then(res => {
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
    // 获取评价
    getStar() {
      evaluation
        .bind(this)("pj_level", "jcss")
        .then(res => {
          this.starDic = res;
          let _this = this;
          this.starDic.forEach(function(k) {
            if (_this.fData.billData.billAssess == k.code) {
              _this.zname = k.name;
              this.scores.forEach(function(v) {
                if (v.name == k.name) {
                  _this.star = v.zscore;
                }
              });
            }
          });
        });
    },
    // 评价
    changeStar(score) {
      let _this = this;
      this.scores.forEach(function(v) {
        if (v.zscore == score) {
          _this.zname = v.name;
          _this.starDic.forEach(function(k) {
            if (v.name == k.name) {
              _this.form.billAssess = k.code;
            }
          });
        }
      });
    },
    // 提交校验
    validateSumit(){
      let result = true
      this.check.forEach((item,index)=>{
        if(item === false) {
          this.validateEmpty(index)
          result = false
        }
      })
      return result;
    },
    // 按钮点击
    showRoute(type) {
      let flowStatus = this.fData
        ? this.fData.workflowBean.flowStatus_
        : this.form.flowStatus_;
      // 提交
      if (type == "Submit") {
        this.form.submitType_ = "SUBMIT";
        if (flowStatus == "CREATE") {
          if(this.validateSumit()){
              this.$emit("insest", this.getForm());
          }
        } else {
          this.$emit("update", this.getForm());
        }
      // 暂存
      } else if (type == "Save") {
        Dialog.confirm({
          message: "是否要暂存该流程"
        }).then(() => {
          this.form.submitType_ = "SAVE";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit("update", this.getForm());
          }
        });
      // 拿回
      } else if (type == "GetBack") {
        Dialog.confirm({
          message: "是否要拿回该流程"
        }).then(() => {
          this.form.submitType_ = "GETBACK";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit("update", this.getForm());
          }
        });
      // 终止
      } else if (type == "Stop") {
        Dialog.confirm({
          message: "是否要终止该流程"
        }).then(() => {
          this.form.submitType_ = "STOP";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit("update", this.getForm());
          }
        });
      // 暂停
      } else if (type == "Suspend") {
        Dialog.confirm({
          message: "是否要暂停该流程"
        }).then(() => {
          this.form.submitType_ = "SUSPEND";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit("update", this.getForm());
          }
        });
      // 恢复
      } else if (type == "Resume") {
        Dialog.confirm({
          message: "是否要恢复该流程"
        }).then(() => {
          this.form.submitType_ = "RESUME";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit("update", this.getForm());
          }
        });
      // 退回
      } else if (type == "Reject") {
        let buttonOptJsonStr = this.fData
          ? this.fData.workflowBean.buttonOptJsonStr
          : this.form.buttonOptJsonStr;
        if (buttonOptJsonStr == "") {
          Dialog.alert({
            message: "无可退回节点"
          });
          return;
        }
        let buttonOptJson = eval("(" + buttonOptJsonStr + ")");
        let rejectNodeList = buttonOptJson.operateBackNode;
        if (typeof rejectNodeList == "undefined") {
          Dialog.alert({
            message: "无可退回节点"
          });
          return;
        }
        this.rejectNodeList = rejectNodeList;
        this.showReject = true;
      // 转办
      } else if (type == "Move") {
        getCustomerDic
          .bind(this)(
            this.fData
              ? this.fData.billData.customerOrg
              : this.form.customerOrgName.code
          )
          .then(res => {
            let user = [];
            let assignees = tool.showAll(res, user);
            this.userMove = assignees;
            this.showMove = true;
          });
      // 跳转
      } else if (type == "Goto") {
        var formData = new FormData();
        formData.append("definitionId_",this.fData?this.fData.workflowBean.definitionId_:this.form.definitionId_)
        formData.append("subProcessId_",this.fData?this.fData.workflowBean.subProcessId_:this.form.subProcessId_)
        getGotoNodes.bind(this)(formData).then(res=>{
          this.gotoNodesList = res.gotoNodesList;
          this.showGoto = true;
        })
      }
    },
    isReject(item){
      let curNodeId = this.fData?this.fData.workflowBean.curNodeId_:this.form.curNodeId_;
      return item.id.toUpperCase() != curNodeId.toUpperCase() && item.selected;
    },
    isGoto(item){
      let curNodeId = this.fData?this.fData.workflowBean.curNodeId_:this.form.curNodeId_
      return item.componentId.toUpperCase().indexOf("USERTASK") != -1 && item.componentId.toUpperCase() != curNodeId.toUpperCase();
    },
    beforeCloseReject(action, done) {
      let flowStatus = this.fData
        ? this.fData.workflowBean.flowStatus_
        : this.form.flowStatus_;
      if (action === "confirm") {
        if (this.nodeReject == "") {
          Dialog.alert({
            message: "请选择退回节点"
          });
          done();
        } else {
          this.form.confirmNodeId_ = this.nodeReject;
          this.form.submitType_ = "REJECT";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit("update", this.getForm());
          }
          done();
        }
      } else {
        done();
      }
    },
    beforeCloseMove(action, done) {
      let flowStatus = this.fData
        ? this.fData.workflowBean.flowStatus_
        : this.form.flowStatus_;
      if (action === "confirm") {
        if (this.usersMove == "") {
          Dialog.alert({
            message: "请选择转办人"
          });
          done();
        } else {
          this.selectUsers = this.usersMove;
          this.form.submitType_ = "Move";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit('update', this.getForm())
          }
          done();
        }
      } else {
        done();
      }
    },
    beforeCloseGoto(action, done) {
      let flowStatus = this.fData
        ? this.fData.workflowBean.flowStatus_
        : this.form.flowStatus_;
      if (action === "confirm") {
        if (this.nodeGoto == "") {
          Dialog.alert({
            message: "请选择退回节点"
          });
          done();
        } else {
          this.form.confirmNodeId_ = this.nodeGoto;
          this.form.submitType_ = "Goto";
          if (flowStatus == "CREATE") {
            if(this.validateSumit()){
              this.$emit("insest", this.getForm());
            }
          } else {
            this.$emit("update", this.getForm());
          }
          done();
        }
      } else {
        done();
      }
    }
  }
};
</script>
<style lang='scss'>
body {
  background: #f2f2f2;
}
.evaluation {
  .eva-head {
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    padding: 1.8rem 0;
  }
  .eva-content {
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    margin-top: 0.8rem;
  }
}
.order-form {
  .order{
    padding-bottom:4.08rem;
  }
  .adDetail-bottom {
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    padding: 0 1.1rem;
    padding-bottom: 1.1rem;
    .downNode {
      font-size: 1rem;
      font-weight: bold;
      color: #000;
      height: 3.2rem;
      line-height: 3.2rem;
      margin: 0;
      font-weight: normal;
    }
    .nextNode {
      display: flex;
      li {
        width: 49%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #f5f5f5;
        border: solid 1px #e9e9e9;
        border-radius: 3px;
        &:first-child {
          margin-right: 2%;
        }
        padding-left: 0.8rem;
      }
      padding-bottom: 0.8rem;
      border-bottom: dashed 1px #ddd;
    }
    .nextUser {
      display: flex;
      padding-top: 0.8rem;
      li {
        width: 32%;
        margin-right: 2%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #f5f5f5;
        border: solid 1px #e9e9e9;
        border-radius: 3px;
        padding-left: 0.8rem;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .van-field__label {
    color: #000;
  }
  .authen li .authenTab {
    padding: 0 1.1rem;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    background: #fff;
    margin-top: 0.8rem;
    display: flex;
    height: 3.28rem;
    line-height: 3.28rem;
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
}
.authen {
  background: #fff;
  .photoList {
    border-bottom: 1px solid #ccc;
    padding: 1rem 1.1rem;
    padding-left: 1rem;
  }
  .delect {
    float: right;
  }
}
.workflowFormButton {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
}
.workflowFormButton button {
  flex: 1;
  background: #4a79df;
  font-size: 1.28rem;
  color: #fff;
  border: none;
  margin-top: 1.1rem;
  height: 3.28rem;
  line-height: 3.28rem;
}
.assets {
  background: #fff;
  padding: 0 1.1rem;
  .zcflTitle {
    height: 3.28rem;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    line-height: 3.28rem;
    background: #fff;
    font-size: 1rem;
    color: #000;
    font-weight: normal;
  }
  .ificat {
    display: flex;
    padding-bottom: 1rem;
    flex-wrap:wrap;
    li {
      width: 31%;
      margin-right: 2%;
      margin-top: 0.4rem;
      &:last-child {
        margin-right: 0;
      }
      height: 2.58rem;
      line-height: 2.58rem;
      font-size: 1rem;
      color: #000;
      background: #f5f5f5;
      border: solid 1px #e9e9e9;
      text-align: center;
      &.active {
        background: #4a79df;
        color: #fff;
      }
    }
  }
}
</style>