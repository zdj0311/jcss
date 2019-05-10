<template>
    <div class="order-resolver">
      <template v-if="fData">
        <!-- 查看页 -->
        <detail v-if="openType!='TODO'" :fData=fData></detail>
        <!-- 评价页 -->
        <evaluate :fData=fData v-if="openType=='TODO'&&(fData.workflowConfig.canEditEvaluate=='must'||fData.workflowConfig.canEditEvaluate=='edit')">
          <div slot="rate">
            <div class="eva-title">客户评价</div>
            <van-rate v-model="star" :size="25" @change="changeStar"/>
            <van-field type="textarea" v-model="form['publishSuggest']" placeholder="请输入客户建议"/>
          </div>
        </evaluate>
        <!-- 办理页 -->
        <dispose :fData=fData v-if="openType=='TODO'&&fData.workflowConfig.canEditEvaluate!='must'&&fData.workflowConfig.canEditEvaluate!='edit'">
          <div slot="busiTypeName">
            <div :class="'highlight'" v-if="fData.workflowConfig.canEditBusiType=='must'||fData.workflowConfig.canEditBusiType=='edit'">
              <van-field
                v-model="form['busiTypeName']&&form['busiTypeName']['text']"
                label="工单类型"
                placeholder="请选择"
                @focus="showPicker('busiTypeName')"
              />
            </div>
            <div class="row" v-else>
              <span class="title">工单类型</span>
              <span class="value">{{ form.busiTypeName&&form.busiTypeName.text }}</span>
            </div>
          </div>
          <div slot="urgencyValue">
            <div :class="'highlight'" v-if="fData.workflowConfig.canEditUrgency=='must'||fData.workflowConfig.canEditUrgency=='edit'">
              <van-field
                v-model="form['urgencyValue']&&form['urgencyValue']['text']"
                label="紧急程度"
                placeholder="请选择"
                @focus="showPicker('urgencyValue')"
              />
            </div>
            <div class="row" v-else>
              <span class="title">紧急程度</span>
              <span class="value">{{ form.urgencyValue&&form.urgencyValue.text }}</span>
            </div>
          </div>
          <div slot="customerName">
            <div :class="'highlight'" v-if="fData.workflowConfig.canEditCustomerUser=='must'||fData.workflowConfig.canEditCustomerUser=='edit'">
              <van-field
                v-model="form['customerName']&&form['customerName']['text']"
                label="审批人员"
                placeholder="请选择"
                @focus="showPicker('customerName')"
              />
            </div>
            <div class="row" v-else>
              <span class="title">审批人员</span>
              <span class="value">{{ form.customerName&&form.customerName.text }}</span>
            </div>
          </div>
          <div slot="billRes">
            <div class="row bill" :class="'highlight'" v-if="fData.workflowConfig.canEditBillRes=='must'||fData.workflowConfig.canEditBillRes=='edit'">
              <van-field
                type="textarea"
                v-model="form['billRes']"
                label="工单结果"
                placeholder="请输入"
              />
            </div>
            <div class="row" v-else>
              <span class="title">工单结果</span>
              <span class="value">{{ fData.billData.billRes }}</span>
            </div>
          </div>
          <div slot="workOrderSuggest">
            <div class="row bill last" :class="'highlight'" v-if="fData.workflowConfig.workOrderSuggest=='must'||fData.workflowConfig.workOrderSuggest=='edit'">
              <van-field
                type="textarea"
                v-model="form['workOrderSuggest']"
                label="审批意见"
                placeholder="请输入"
              />
            </div>
          </div>
          <div slot="assetsRelList">
            <div :class="'highlight'" v-if="fData.workflowConfig.canRelAssets=='must'||fData.workflowConfig.canRelAssets=='edit'">
              <div class="assets">
                <h3 class="zcflTitle">关联资产</h3>
                <ul class="ificat clearfix tabsList">
                  <li v-for="(item,index) in assetsDic" :key="index">
                    <input type="checkbox" :value="item.id" v-model="assetsRelList">
                    <span>{{ item.assetsName}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="row">
              <span class="title">关联资产</span>
              <div class="value">
                <template v-if="caseAssetsList.length>0">
                  <div v-for="(obj,i) in caseAssetsList" :key="i">{{ obj.assetName }}</div>
                </template>
              </div>
            </div>
          </div>
          <div slot="fileList">
            <div class="authenTab" :class="'highlight'" v-if="fData.workflowConfig.canEditAttach=='must'||fData.workflowConfig.canEditAttach=='edit'">
              <label class="auTitle">上传附件</label>
              <template>
                <span class="fileinput-button">
                  <a href="javascript:void(0)" class="clickUp">点击上传</a>
                  <input type="file" class="files" multiple="multiple" @change="fileChange($event)">
                </span>
              </template>
            </div>
            <!-- 文件列表 -->
            <ul class="fileList" :class="'highlight'" v-if="fData.workflowConfig.canEditAttach=='must'||fData.workflowConfig.canEditAttach=='edit'">
              <li class="photoList" v-for="(item,index) in files" :key="index">
                <span class="fuj"></span>
                <label class="auTitle">
                  <a :href="addPath(item.url)">{{item.name}}</a>
                </label>
                <div class="delect delete" @click="deleteFile(item.id)"></div>
              </li>
            </ul>
            <ul class="fileList"  v-else>
              <li class="photoList" v-for="(item,index) in files" :key="index">
                <span class="fuj"></span>
                <label class="auTitle">
                  <a :href="addPath(item.url)">{{item.name}}</a>
                </label>
              </li>
            </ul>
          </div>
        </dispose>
      </template>
      <!-- 按钮 -->
      <div class="workflowFormButton" v-if="openType!='VIEW'">
        <div class="work-btn" v-for="(item,index) in button" :key="index">
          <button class="btn dark" type="button" @click="subType(item.id)">{{item.name}}</button>
        </div>
      </div>
      <!-- 下一节点弹出 -->
      <van-dialog v-model="showNode" show-cancel-button :before-close="beforeCloseNode">
        <div class="model">
          <div class="model-content">
            <div class="work-con">
              <h2 class="downNode">下一节点</h2>
              <ul class="nextNode">
                <li v-for="(item,index) in nextNodesList" :key="index">
                  <label :for="'resolve' + index">
                    <img class="check" v-if="item.componentId === selectNodes" :src="rightWhite" />
                    <img class="uncheck" v-else :src="rightWhite" />
                  </label>
                  <input :id="'resolve' + index" v-if="curNode.choice=='single'" type='radio' v-model='selectNodes' :value='item.componentId' name="nodes" @change="toSelectUser"/>
                  <input :id="'resolve' + index" v-else type='checkbox' v-model='selectNodes' :value='item.componentId' @change="toSelectUser"/>
                  <span>{{item.name}}</span>
                </li>        
              </ul>
              <ul class="nextUser clearfix">
                <li v-for="(item,index) in chooseUser" :key="index">
                  <label :for="'user' + index">
                    <img class="check" v-if="item.id === selectUsers" :src="rightWhite" />
                    <img class="uncheck" v-else :src="rightWhite" />
                  </label>
                  <input :id="'user' + index" v-if="chooseUser.choice=='single'" v-model="selectUsers" class="users" type="radio" :value='item.id' name="users">
                  <input :id="'user' + index" v-else v-model="selectUsers" class="users" type="checkbox" :value='item.id'>
                  <span>{{item.displayName}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </van-dialog>
      <!-- 退回节点弹出 -->
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
      <!-- 跳转节点弹出 -->
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
      <!-- 转办节点弹出 -->
      <van-dialog v-model="showMove" show-cancel-button :before-close="beforeCloseMove">
        <ul class="table">
          <li v-for="(item,index) in userMove" :key="index">
            <input name="users" type="radio" :value="item.id" v-model="usersMove">
            <span>{{item.displayName}}</span>
          </li>
        </ul>
      </van-dialog>
      <van-popup v-model="show" class="pop-container" position="bottom">
        <van-picker :columns="postDic" show-toolbar @cancel="cancel" @confirm="confirm"/>
      </van-popup>
    </div>
</template>

<script>
import {
getBtDic, 
getCustomerDic,
getCustomerAndJcAllDeptAndUser,
getUrgencyDic,
getAssetsList,
loadWorkflow,
saveWorkflow,
updateWorkflow,
upload,
getNextNodes,
getGotoNodes,
deleteFile,
evaluation
} from 'controller/order-create'
import dispose from 'components/dispose'
import detail from 'components/detail'
import evaluate from 'components/evaluate'
import {Dialog} from 'vant';
import tool from "utils/tool";
import checkimg from 'assets/check.png'
import rightWhite from 'assets/img/right-white.png'

export default {
  components: {detail,dispose,evaluate},
  data() {
    return {
      checkimg, rightWhite,
      openType:'',
      canEditEvaluate:'',
      fData:null,
      form:{},
      button:[],
      gotoNodesList: [],
      showGoto: false,
      nodeGoto: [],
      userMove: [],
      showMove: false,
      usersMove: "",
      showReject: false,
      rejectNodeList: [],
      nodeReject: "",
      curNode: {},
      showNode: false,
      chooseUser: [],
      nextNodesList: [],
      selectNodes: "",
      files: [],
      assetsRelList: [],
      deleteAttachFile: [],
      caseAssetsList:[],
      show:false,
      postDic:[],
      btDic:[],
      urgencyDic:[],
      customerDic:[],
      assetsDic:[],
      keyName:'',
      // 按钮是否可提交
      status: {
        Submit: true,
        Save: true,
        GetBack: true,
        Stop: true,
        Suspend: true,
        Resume: true,
        Reject: true,
        Move: true,
        Goto: true
      },
      zname: "",
      star: 0,
      starDic: [],
      scores: [
        { zscore: "5", name: "非常满意" },
        { zscore: "4", name: "比较满意" },
        { zscore: "3", name: "满意" },
        { zscore: "2", name: "不满意" },
        { zscore: "1", name: "非常不满意" }
      ],
    };
  }, 
  created(){  
    // 工作流初始化
    loadWorkflow
      .bind(this)(this.$route.params._id)
      .then(res => {
        this.fData = res;
        this.initButton(res.workflowBean);
        this.openType = res.workflowBean.openType_;
        this.canEditEvaluate = res.workflowConfig.canEditEvaluate;
        this.getNextNodes();
        this.getStar();
        getBtDic
          .bind(this)()
          .then(res => {
            this.btDic = res;
            if(this.fData.billData.busiTypeCode){
              this.form.busiTypeName = {
                code: this.fData.billData.busiTypeCode,
                text: this.fData.billData.busiTypeName
              };
            }else{
              this.form.busiTypeName = res[0];
            }
          });
        getUrgencyDic
          .bind(this)("urgency", "jcss")
          .then(res => {
            this.urgencyDic = res;
            if(this.fData.billData.urgency){
              this.form.urgencyValue = {
                code: this.fData.billData.urgency,
                text: this.fData.billData.urgencyValue
              };
            }else{
              this.form.urgencyValue = res[0];
            }
          });
        getCustomerDic
          .bind(this)(this.fData.billData.customerOrg)
          .then(res => {
            console.log(res)
            var user = [],_this=this;
//          user = tool.showAll(res, user);
//          user.forEach(function(v, k) {
//            _this.customerDic.push({
//              code: v.id,
//              text: v.displayName
//            });
//          });
            // 审批人员列表为空，改为如下
            res.forEach((item, index) => {
              _this.customerDic.push({
                code: item.id,
                text: item.name
              });
            });
            console.log(this.fData.billData)
            if(this.fData.billData.customer) {
              this.form.customerName = {
                code: this.fData.billData.customer,
                text: this.fData.billData.customerName
              };
            }else{
              // customerDic 改为 urgencyDic
              this.form.urgencyValue = this.urgencyDic[0];
            }
          });
        getAssetsList
          .bind(this)( this.fData.billData.customerOrg,  this.fData.billData.assetTypeId)
          .then(res => {
            this.assetsDic = res;
          });
        this.form.billRes = this.fData.billData.billRes;
        this.form.billAssess = this.fData.billData.billAssess;
        this.form.publishSuggest = this.fData.billData.publishSuggest;
        this.files = this.fData.attachList;
        this.caseAssetsList = this.fData.caseAssetsList;
        this.caseAssetsList.forEach(item => {
          if (item.assetId) {
            this.assetsRelList.push(item.assetId)
          }
        })
      })
  },
  methods: {
    // 显示 picker
    showPicker(item) {
      if (item == "busiTypeName") {
        this.postDic = this.btDic;
        this.keyName = "busiTypeName";
      }
      if (item == "urgencyValue") {
        this.postDic = this.urgencyDic;
        this.keyName = "urgencyValue";
      }
      if (item == "customerName") {
        this.postDic = this.customerDic;
        this.keyName = "customerName";
      }
      this.show = true;
    },
    // picker 确定时触发
    confirm(v) {
      let _this = this;
      this.form[this.keyName] = v;
      if (
        this.keyName == "customerName"
      ) {
        this.getNextNodes();
      }
      this.show = false;
    },
    // picker 取消时触发
    cancel() {
      this.show = false;
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
              _this.scores.forEach(function(v) {
                if (v.name == k.name) {
                  _this.star = +v.zscore;
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
        if (v.zscore == _this.star) {
          _this.zname = v.name;
          _this.starDic.forEach(function(k) {
            if (v.name == k.name) {
              _this.form.billAssess = k.code;
              _this.form.publishSuggest = k.name;
            }
          });
        }
      });
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
        .bind(this)(this.fData.billData.customerOrg)
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
    // 按钮提交
    subType(id) {
      if (id == "1" && this.status["Submit"] == true) {
        this.showRoute("Submit");
      } else if (id == "2" && this.status["Save"] == true) {
        this.showRoute("Save");
      } else if (id == "3" && this.status["Reject"] == true) {
        this.showRoute("Reject");
      } else if (id == "4" && this.status["Move"] == true) {
        this.showRoute("Move");
      } else if (id == "5" && this.status["Goto"] == true) {
        this.showRoute("Goto");
      } else if (id == "6" && this.status["Stop"] == true) {
        this.showRoute("Stop");
      } else if (id == "7" && this.status["Suspend"] == true) {
        this.showRoute("Suspend");
      } else if (id == "8" && this.status["Resume"] == true) {
        this.showRoute("Resume");
      } else if (id == "1001" && this.status["GetBack"] == true) {
        this.showRoute("GetBack");
      }
    },
    // 按钮点击
    showRoute(type) {
      let flowStatus = this.fData.workflowBean.flowStatus_;
      // 提交
      if (type == "Submit") {
        if(this.nextNodesList.length==1){
          this.createOrResolver(type, flowStatus);
        }else{
          this.showNode = true;
        }
      // 暂存
      } else if (type == "Save") {
        Dialog.confirm({
          message: "是否要暂存该流程"
        }).then(() => {
          this.createOrResolver(type, flowStatus);
        });
        // 拿回
      } else if (type == "GetBack") {
        Dialog.confirm({
          message: "是否要拿回该流程"
        }).then(() => {
          this.createOrResolver(type, flowStatus);
        });
        // 终止
      } else if (type == "Stop") {
        Dialog.confirm({
          message: "是否要终止该流程"
        }).then(() => {
          this.createOrResolver(type, flowStatus);
        });
        // 暂停
      } else if (type == "Suspend") {
        Dialog.confirm({
          message: "是否要暂停该流程"
        }).then(() => {
          this.createOrResolver(type, flowStatus);
        });
        // 恢复
      } else if (type == "Resume") {
        Dialog.confirm({
          message: "是否要恢复该流程"
        }).then(() => {
          this.createOrResolver(type, flowStatus);
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
          .bind(this)(this.fData.billData.customerOrg
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
        formData.append(
          "definitionId_",this.fData.workflowBean.definitionId_
        );
        formData.append(
          "subProcessId_",this.fData.workflowBean.subProcessId_
        );
        getGotoNodes
          .bind(this)(formData)
          .then(res => {
            this.gotoNodesList = res.gotoNodesList;
            this.showGoto = true;
          });
      }
    },
    // 退回
    isReject(item) {
      let curNodeId =  this.fData.workflowBean.curNodeId_
      return item.id.toUpperCase() != curNodeId.toUpperCase() && item.selected;
    },
    // 跳转
    isGoto(item) {
      let curNodeId = this.fData.workflowBean.curNodeId_;
      return (
        item.componentId.toUpperCase().indexOf("USERTASK") != -1 &&
        item.componentId.toUpperCase() != curNodeId.toUpperCase()
      );
    },
    // 退回确认
    beforeCloseReject(action, done) {
      let flowStatus = this.fData.workflowBean.flowStatus_;
      if (action === "confirm") {
        if (this.nodeReject == "") {
          Dialog.alert({
            message: "请选择退回节点"
          });
          done();
        } else {
          this.form.confirmNodeId_ = this.nodeReject;
          this.createOrResolver("Reject", flowStatus);
          done();
        }
      } else {
        done();
      }
    },
    // 转办确认
    beforeCloseMove(action, done) {
      let flowStatus = this.fData.workflowBean.flowStatus_;
      if (action === "confirm") {
        if (this.usersMove == "") {
          Dialog.alert({
            message: "请选择转办人"
          });
          done();
        } else {
          this.selectUsers = this.usersMove;
          this.createOrResolver("Move", flowStatus);
          done();
        }
      } else {
        done();
      }
    },
    // 跳转确认
    beforeCloseGoto(action, done) {
      let flowStatus = this.fData.workflowBean.flowStatus_;
      if (action === "confirm") {
        if (this.nodeGoto == "") {
          Dialog.alert({
            message: "请选择退回节点"
          });
          done();
        } else {
          this.form.confirmNodeId_ = this.nodeGoto;
          this.createOrResolver("Goto", flowStatus);
          done();
        }
      } else {
        done();
      }
    },
    // 关闭下一节点弹出
    beforeCloseNode(action, done){
      let flowStatus = this.fData.workflowBean.flowStatus_;
      if (action === "confirm") {
        this.createOrResolver('Submit', flowStatus)
      } else {
        done();
      }
    },
    // 创建或修改工单
    createOrResolver(type, flowStatus) {
      // type = Submit flowStatus = SUBMIT
      this.form.submitType_ = type;
      if (this.validateSumit()) {
        this.status[type] = false;
        updateWorkflow
          .bind(this)(this.getForm())
          .then(res => {
            if (res == "success") {
              Dialog.alert({
                message: "提交成功"
              }).then(() => {
                this.$router.push({
                  name: "order_list",
                  params: {
                    _type: "Day",
                    _mode: "TODO"
                  }
                });
              });
            }
          })
          .catch(res => {
            Dialog.alert({
              message: res.message
            });
          });
      }
    },
    // 提交参数
    getForm() {
      this.selectUsers = Array.isArray(this.selectUsers)
        ? this.selectUsers.join(",")
        : this.selectUsers;
      this.assetsRelList =
        typeof this.assetsRelList == "array"
          ? this.assetsRelList.join(",")
          : this.isNull(this.assetsRelList);
      let _this = this;
      this.form.attachFile = "";
      this.files.forEach(function(v, index) {
        _this.form.attachFile += index == 0 ? v.id : "," + v.id;
      });
      var formData = new FormData();
      formData.append(
        "nowCustomerOrgId",this.isNull(this.fData.nowCustomerOrgId)
      );
      formData.append("id", this.isNull(this.fData.billData.id));
      formData.append("modifyDateStr", this.isNull(this.fData.billData.modifyDate));
      formData.append("appUser", this.isNull(this.fData.billData.appUser));
      formData.append("appUserName", this.isNull(this.fData.billData.appUserName));
      formData.append("appUserPhone", this.isNull(this.fData.billData.appUserPhone));
      formData.append("startTimeStr", this.isNull(this.fData.billData.startTime));
      formData.append("status", this.isNull(this.fData.billData.status));
      formData.append("statusValue", this.isNull(this.fData.billData.statusValue));
      formData.append("code", this.isNull(this.fData.billData.code));
      formData.append(
        "customerOrg", this.isNull(this.fData.billData.customerOrg)
      );
      formData.append(
        "customerOrgName",this.isNull(this.fData.billData.customerOrgName)
      );
      formData.append("customer", this.isNull(this.form.customerName&&this.form.customerName.code));
      formData.append("customerName", this.isNull(this.form.customerName&&this.form.customerName.text));
      formData.append(
        "busiTypeCode",this.isNull(this.form.busiTypeName.code)
      );
      formData.append(
        "busiTypeName",this.isNull(this.form.busiTypeName.text)
      );
      // urgencyValue 可能为空
      formData.append("urgency", this.isNull(this.form.urgencyValue&&this.form.urgencyValue.code));
      formData.append("urgencyValue", this.isNull(this.form.urgencyValue&&this.form.urgencyValue.text));
      formData.append("planStartTimeStr", this.isNull(this.fData.billData.planStartTime));
      formData.append("planEndTimeStr", this.isNull(this.fData.billData.planEndTime));
      formData.append("subject", this.isNull(this.fData.billData.subject));
      formData.append("billPlan", this.isNull(this.fData.billData.billPlan));
      formData.append("billRes", this.isNull(this.form.billRes));
      formData.append(
        "projectId",this.isNull(this.fData.billData.projectId)
      );
      formData.append(
        "projectName",this.isNull(this.fData.billData.projectName)
      );
      formData.append(
        "subProjectId",this.isNull(this.fData.billData.subProjectId)
      );
      formData.append(
        "subProjectName",this.isNull(this.fData.billData.subProjectName)
      );
      formData.append("assetTypeId", this.isNull(this.fData.billData.assetTypeId));
      formData.append("assetTypeName", this.isNull(this.fData.billData.assetTypeName));
      formData.append("billAssess", this.isNull(this.form.billAssess));
      formData.append("publishSuggest", this.isNull(this.form.publishSuggest));
      formData.append("assetsRelList", this.isNull(this.assetsRelList));
      formData.append("attachFile", this.isNull(this.form.attachFile));
      formData.append("deleteAttachFile", this.isNull(this.deleteAttachFile));
      formData.append(
        "attachFileMode",
        this.form.attachFileMode
          ? this.isNull(this.form.attachFileMode)
          : "EDIT"
      );
      formData.append(
        "workflowBean.curNodeId_",this.isNull(this.fData.workflowBean.curNodeId_)
      );
      formData.append(
        "workflowBean.definitionId_", this.isNull(this.fData.workflowBean.definitionId_)
      );
      formData.append(
        "workflowBean.confirmUserId_",
        this.isNull(this.selectUsers)
      );
      formData.append(
        "workflowBean.confirmNodeId_",
        this.isNull(this.form.confirmNodeId_)
      );
      formData.append(
        "workflowBean.confirmRouteId_",
        this.isNull(this.form.confirmRouteId_)
      );
      formData.append(
        "workflowBean.workflowVar_['wUserType']",this.isNull(this.fData.wUserType)
      );
      formData.append(
        "workflowBean.workflowVar_['wCustomerUserId']",this.fData.wCustomerUserId
      );
      formData.append(
        "workflowBean.taskId_",this.isNull(this.fData.workflowBean.taskId_)
      );
      formData.append(
        "workflowBean.instanceId_",this.isNull(this.fData.workflowBean.instanceId_)
      );
      formData.append(
        "workflowBean.signInfo_",this.isNull(this.fData.workflowBean.signInfo_)
      );
      formData.append(
        "workflowBean.message_",
        this.isNull(this.form["workOrderSuggest"])
      );
      formData.append("workflowBean.suggestId_", "workOrderSuggest");
      formData.append(
        "workflowBean.signContainerId_",
        "workOrderSuggest_" + new Date().getTime()
      );
      formData.append(
        "workflowBean.submitType_",
        this.isNull(this.form.submitType_)
      );
      return formData;
    },
    // 是否为null字符串
    isNull(it) {
      return it && "null" != it || it == 0 ? it : "";
    },
    // 提交校验
    validateSumit() {
      if(this.openType!='VIEW'&&(this.fData.workflowConfig.canEditEvaluate=='must'||this.fData.workflowConfig.canEditEvaluate=='edit')){
        if (
          (!this.form.publishSuggest || !this.form.billAssess) &&
          this.fData.workflowConfig.canEditEvaluate == "must"
        ) {
          Dialog.alert({
            message: "请对工单进行评价"
          });
          return false;
        }
      }else{
        console.log(this.form)
        if (
          !this.form.busiTypeName.code &&
          this.fData.workflowConfig.canEditBusiType == "must"
        ) {
          Dialog.alert({
            message: "请选择工单类型"
          });
          return false;
        }
//      if (
//        !this.form.urgencyValue.code &&
//        this.fData.workflowConfig.canEditUrgency == "must"
//      ) {
//        Dialog.alert({
//          message: "请选择紧急程度"
//        });
//        return false;
//      }
//      if (
//        !this.form.customerName.code &&
//        this.fData.workflowConfig.canEditCustomerUser == "must"
//      ) {
//        Dialog.alert({
//          message: "请选择审批人员"
//        });
//        return false;
//      } 
        if (
          !this.form.billRes &&
          this.fData.workflowConfig.canEditBillRes == "must"
        ) {
          Dialog.alert({
            message: "请填写工单结果"
          });
          return false;
        }
        if (
          !this.form["workOrderSuggest"] &&
          this.fData.workflowConfig.workOrderSuggest == "must"
        ) {
          Dialog.alert({
            message: "请填写审批意见"
          });
          return false;
        }
        if (
          this.assetsRelList.length <= 0 &&
          this.assetsDic.length > 0 &&
          this.fData.workflowConfig.canRelAssets == "must"
        ) {
          Dialog.alert({
            message: "请选择关联资产"
          });
          return false;
        }
        if (
          this.files.length <= 0 &&
          this.fData.workflowConfig.canEditAttach == "must"
        ) {
          Dialog.alert({
            message: "请上传附件"
          });
          return false;
        }
      }
      return true;
    },
  },
};
</script>
<style lang='scss'>
body {
  background: #f2f2f2;
}
.order-resolver {
  .work-con{
  padding-top: 0.8rem;
  input {
    display:none;
  }
}
.nextNode, .nextUser {
  img {
    width:1rem;
  }
  .check {
    background:#4a79df;
  }
  .uncheck {
    background:#bbbbbb;
  }
}
.downNode {
      font-size: 1.1rem;
      font-weight: bold;
      color:#fff;
      background:#4a79df;
      padding:1rem;
      margin-bottom:1rem;
    }
    .nextNode {
      display: flex;
      flex-wrap: wrap;
      padding:0 1rem;
      max-height:16vh;
      overflow-y:scroll;
      li {
        font-size:1rem;
        width: 45%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #f5f5f5;
        border: solid 1px #e9e9e9;
        border-radius: 3px;
        margin-right: 4%;
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
      max-height:20vh;
      overflow-y:scroll;
      li {
        font-size:1rem;
        width: 45%;
        margin-right: 4%;
        height: 2.5rem;
        line-height: 2.5rem;
        background: #f5f5f5;
        border: solid 1px #e9e9e9;
        border-radius: 3px;
        padding-left: 0.8rem;
        margin-bottom: 1rem;
        &:nth-child(even) {
          margin-right: 0;
        }
      }
    }
}

.order-form {
  .order {
    padding-bottom: 4.08rem;
  }

  .adDetail-bottom {
    background: #fff;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    padding: 0 1.1rem;
    padding-bottom: 1.1rem;
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
}
.workflowFormButton {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  .work-btn {
    flex: 1;
    margin-right: 1%;
    background: #4a79df;
    text-align: center;
    height: 3.28rem;
    line-height: 3.28rem;
    &:last-child {
      margin-right: 0;
    }
  }
}
.workflowFormButton button {
  background: #4a79df;
  font-size: 1.28rem;
  color: #fff;
  border: none;
  width: 100%;
}
.order-resolver {
  .van-cell-group {
    padding-top: 1rem;
    // margin-top: 1rem;
  }

  .van-cell {
    border: solid 1px #eee;
    width: auto;
    border-bottom: none;
    padding: 4px 0.6rem;
    .van-field__label {
      color: #000;
      border-right: solid 1px #eee;
    }
    .van-cell__value {
      color: #969799;
      overflow: hidden;
      text-align: right;
      position: relative;
      vertical-align: middle;
      padding-left: 0.8rem;
      padding-right: 0.8rem;
    }
  }
  .suggest {
    .van-cell {
      // border-top: none;
    }
  }
  .bill{
    .van-cell {
      border: none;
    }
  }
  .evaluation {
    .van-cell {
      border: none;
    }
  }
  header {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #fff;
  }
  .statu {
    color: #fff;
    padding: 0.3rem 0.8rem;
    background: linear-gradient(left, #4a79df, #7db6ff);
    border-radius: 5px;
  }
  h2.sub {
    font-size: 1.1rem;
    font-weight: bold;
    margin-left: 1rem;
    padding: 0;
    margin-bottom: 0;
  }
  h2.base {
    font-size: 1.1rem;
    font-weight: bold;
    margin-left: 0.8rem;
    margin-bottom: 0.8rem;
    padding-left: 1rem;
  }
  .info-container {
    padding: 1rem;
    background: #fff;
  }

  h2 {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.8rem;
    padding-left: 0;
  }
  .row {
    display: flex;
    padding: 0.3rem 0;
    border-top: 1px solid #eeeeee;
    border-left: 1px solid #eeeeee;
    border-right: 1px solid #eeeeee;
    &:last-child.last {
      border-bottom: 1px solid #eeeeee;
    }
    .title {
      flex: 1;
      border-right: 1px solid #eeeeee;
      padding: 0 0.8rem;
    }
    .value {
      flex: 3;
      display: flex;
      flex-flow: column;
      justify-content: center;
      padding: 0 0.8rem;
      font-size: 0.9rem;
      a {
        color: #000;
      }
      p{
        margin-bottom:.4rem;
      }
    }
  }
  .row1 {
    margin: 0 1.1rem;
    .title {
      padding: 0 1.1rem 0 0.8rem;
    }
  }
  .in-container {
    padding: 0 1.1rem;
    .row {
      border-bottom: none;
      .title {
        padding: 0 1.1rem 0 0.8rem;
      }
      .value {
        .val-list {
          border-bottom: dashed 1px #eee;
        }
        p {
          margin-bottom: 0.4rem;
          margin-top: 0.4rem;
          strong {
            padding-left: 1.07rem;
          }
        }
      }
    }
  }
}
.assets {
  background: #fff;
  .zcflTitle {
    height: 2rem;
    border-top: solid 1px #eee;
    /* border-bottom: solid 1px #eee; */
    line-height: 2rem;
    background: #fff;
    font-size: 1rem;
    color: #000;
    font-weight: normal;
    margin: 0;
    padding: 0;
    padding-left: 0.8rem;
  }
  .ificat {
    display: flex;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    padding: 0 .8rem;
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
  .ificatList {
    li {
      margin-bottom: 0.4rem;
    }
  }
}

.highlight .van-cell .van-field__label {
    span {
      color:#4a79df !important;
    }
  }
.highlight .zcflTitle, .highlight .auTitle {
  color:#4a79df !important;
}
/*input[type="radio"],*/
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
/*input[type="radio"]::before,*/
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
/*input[type="radio"]::before {
  border-radius: 50%;
}*/
/*input[type="radio"]:checked::before,*/
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
.table {
  padding: 0.8rem;
}
</style>