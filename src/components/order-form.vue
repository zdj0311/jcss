<template>
    <div class="form">
      <van-cell-group>
        <template v-for="(item,index) in table" v-if="item.exist==true">
            <van-field v-if="item.picker==true" v-model="form[item.key_name]" :label="item.title" placeholder="请选择" :error-message="item.message" @focus="showPicker(item)" readonly/>
            <!-- <van-field v-if="item.key_name === 'planEndTime'" 
            v-model="form[item.key_name]['text']" :label="item.title" :placeholder="item.placeholder" :error-message="item.message" @focus="showPicker" readonly/> -->
            <van-field v-else :readonly="item.readonly" :type="item.type?item.type:'input'" v-model="form[item.key_name]" :label="item.title" placeholder="请输入" :error-message="item.message" @blur="item.validate(form,table,index)"/>
        </template>
      </van-cell-group>
      <van-popup v-model="show" class="pop-container" position="bottom">
        <van-picker :columns="postDic" show-toolbar @cancel="cancel" @confirm="confirm"/>
      </van-popup>
      <div ></div>
    </div>
</template>

<script>
import {getCustomerOrgDic,getBtDic,getCustomerDic,getUrgencyDic,getProjectDic,getProjectSubDic,getAssetType,getAssetsList,loadWorkflow,updateWorkflow,upload}
 from 'controller/order-create'
//  import form from 'utils/form-all'
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
    fData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    let validateEmpty= function(form,table,index) {
        let item = table[index]
        if(!form[item.key_name]) {
            item.message = '请输入';
        }
    }  
    let user = this.$store.state.admin.user
    return {
        postDic:[],
        customerOrgDic:[],
        btDic:[],
        urgencyDic:[],
        customerOrgDic:[],
        customerDic:[],
        projectDic:[],
        projectSubDic:[],
        keyName:'',
        form:{},
        show:false,
        table:[{
          key_name:'appUserName',
          value: user.userName,
          title:'申请人',
          validate:validateEmpty
        },{
          key_name:'appUserPhone',
          value: user.mobile,
          title:'联系方式',
          validate:validateEmpty
        },{
          key_name:'startTimeStr',
          value: new Date().Format("yyyy-MM-dd hh:mm:ss"),
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
          key_name:'projectId',
          title:'项目名称',
          validate:validateEmpty
        },
        {
          key_name:'subProjectId',
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
    if(this.create==true){
      getCustomerOrgDic.bind(this)().then(res=>{
        this.customerOrgDic = res
      })
      getBtDic.bind(this)().then(res=>{
        this.btDic = res
      })
      getUrgencyDic.bind(this)('urgency','jcss').then(res=>{
        this.urgencyDic = res
      })
    }
    this.initTable();
    this.initForm(this.fData);
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
        if(item.key_name=='projectId'){
          this.postDic = this.projectDic;
          this.keyName = 'projectId';
        }
        if(item.key_name=='subProjectId'){
          this.postDic = this.projectSubDic;
          this.keyName = 'subProjectId';
        }
        this.show = true
      },
      // picker 取消时触发
      cancel() {
        this.show = false
      },
      // picker 确定时触发
      confirm(v) {
        this.form[this.keyName] = v.text;
        if(this.keyName=='customerOrgName'){
          getCustomerDic.bind(this)(v.code).then(res=>{
            this.customerDic = res
          })
          getProjectDic.bind(this)(v.code).then(res=>{
            this.projectDic = res
          })
        }
        if(this.keyName=='projectId'){
          getProjectSubDic.bind(this)(this.form['customerOrgName'].code,v.code).then(res=>{
            this.projectSubDic = res
          })
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
      initForm(fData){
        if(!fData){
          this.table.forEach((item,index)=>{
            if(item.exist && item.exist==true){
              this.form[item.key_name] = item.value?item.value:'';
            }
          })
        }else{
          this.form = fData;
        }
        
      }
  }
};
</script>
<style lang='scss'>
</style>