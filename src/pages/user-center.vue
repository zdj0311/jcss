<template>
  <div>
    <div class="auth">
      <header class="header">
        <img class="avatar" :src="user.wxUser&&user.wxUser.headImgUrl || avatar"/>
        <!-- 未注册-->
        <div  v-if="user.userStatus === 'UNRegister'" class="statu-mark unregister">
          <div class="img-container"><img :src="unregister"/></div>
          <span>未认证</span>
        </div>
        <!-- 注册失败-->
        <div v-if="user.userStatus === 'deny'" class="statu-mark fail">
          <div class="img-container"><img :src="fail"/></div>
          <span>认证失败</span>
        </div>
        <!-- 审核 -->
        <div  v-if="user.userStatus === 'register'" class="statu-mark register">
          <div class="img-container"><img :src="register"/></div>
          <span>认证中</span>
        </div>
        <div  v-if="user.userStatus === 'created'" class="">
          <span>{{ user.wxUser&&user.wxUser.nicknameuser || user.userName }}</span>
          <span class="certified"><img :src="certified"/></span>
        </div>
        <!--<div class="edit" v-if="user.userStatus === 'created'" @click="onEdit"><img :src="edit"/></div>-->
      </header>
      
      <van-cell title="知识库" is-link :to="{name: 'netsafe'}"/>
      <van-cell title="我的收藏" is-link />
      <van-cell title="资料修改" is-link to="edit"/>
    </div>
  </div>
</template>

<script>
  import avatar from 'assets/img/avatar.png'
  import register from 'assets/img/register.png'
  import unregister from 'assets/img/unregister.png'
  import certified from 'assets/certified.png'
  import edit from 'assets/edit.png'
  import fail from 'assets/img/fail.png'
  import { getPostDic,bindUser,getCompony } from 'controller/auth' // 职务列表
  import getUser from 'utils/getUser'
  export default {
    name: 'user_center',
    data() {
//    let validateEmpty= function(form,table,index) {
//      let item = table[index]
//      if(!form[item.key_name]) {
//        item.message = '请输入' + item.title
//      }
//    }
      return {
        avatar,
        register,
        unregister,
        fail,
        certified,
        edit,
        editUser:false,
        user:this.$store.state.admin.user,
        value: '',
        searchIn: false,
        search:'',
        searchList: [],
        pickerArr:[],
        currentProperty:'',
        postDic:[],
        componys:[],
        check:[],
        show:false,
        form:{},
        table:[{
          key_name:'OrgIdValue',
          value:'',
          title:'所在单位',
          placeholder:'请输入所在单位',
          message:'',
          validate:this.validateEmpty,
          readonly:true
        },{
          key_name:'userName',
          value:'',
          title:'姓名',
          placeholder:'请输入姓名',
          message:'',
          validate:this.validateUser,
          readonly:false
        },{
          key_name:'mobile',
          value:'',
          title:'联系电话',
          placeholder:'请输入联系电话',
          message:'',
          validate:this.validatePhone,
          readonly:false,
          length:'11'
        },{
          key_name:'roomNo',
          value:'',
          title:'房间号',
          placeholder:'请输入房间号',
          message:'',
          validate:function(){},
          readonly:false,
          length:'10'
        },
//      {
//        key_name:'duty',
//        value:'',
//        title:'职务',
//        placeholder:'请输入职务',
//        message:'',
//        validate:function(){},
//        readonly:true
//      },{
//        key_name:'cardNo',
//        value:'',
//        title:'身份证号',
//        placeholder:'请输入身份证号',
//        message:'',
//        validate:this.validateCardNo,
//        readonly:false
//      }
        ]
      }
    },
    
    created() {
      // 获取职务字典项 dutyId
      getPostDic.bind(this)('dutyId').then(res=>{
        this.postDic = res
      })
      // 获取所在单位字典项
      getCompony.bind(this)().then(res=>{
        this.allComponys = res;
      })
      this.initForm()
      this.readonlyTable()
    },
    watch:{
      value(val) {
        this.search = val;
      }
    },
    methods: {
      init() {
        let proxy_key = ''
        if(process&&process.env&&process.env.NODE_ENV === 'proxy') proxy_key = 'proxy'
        getUser(proxy_key).then(res=>{
          this.$store.commit('admin/updateUser',res.data.data)
          this.user = this.$store.state.admin.user
          this.initForm()
          this.readonlyTable()
        })
      },
      onEdit(){
        this.editUser=true;
        this.table.forEach(item=>{
          if(item.key_name!='OrgIdValue'){
            item.readonly = false
          }     
        })
      },
      initForm(form) {
        this.form = {
          OrgIdValue:{
            code:this.user.orgId||'',
            text:this.user.orgIdValue||''
          },
          userName:this.user.userName||'',
          mobile:this.user.mobile||'',
          roomNo:this.user.roomNo||'',
//        duty:{
//          code:this.user.duty||'',
//          text:this.user.dutyValue||''
//        },
//        cardNo:this.user.cardNo||''
        }
        // 初始化校验数组，长度为form-item条数
        for(let item in this.form) {
          if(item === 'OrgIdValue' || item === 'userName' ||  item === 'mobile') {
            this.check.push(false)
          }else {
            this.check.push(true)
          }
        }
      },
      // 将整个form置为readonly
      readonlyTable() {
        if(this.user.userStatus === 'register'||this.user.userStatus === 'created' ) {
          this.table.forEach(item=>{
            item.readonly = true
          })
        }
      },
      // 提交表单
      submit(msg) {
        let result = true
        this.check.forEach((item,index)=>{
          if(item === false) {
            this.validateEmpty(index)
            this.validatePhone(2)
          }
        })
        this.check.forEach((item,index)=>{
          if(item === false) {
            result = false;
          }
        })
        if(result) {
          bindUser.bind(this)(this.form).then(res=>{
            this.$toast(msg)
            this.editUser = false;
            this.table.forEach(item=>{
              item.readonly = true
            })
            this.init() 
          }).catch(err=>{
            this.$toast(err.message || '网络错误')
          })
        }
      },
      searchResult(it){
        this.form.OrgIdValue = it;
        this.searchIn = false;
      },
      showSearch(){
        if(this.allComponys.length>0){
          this.searchIn = true;
        }
      },
      // 显示 picker
      showPicker(item) {
        this.currentProperty = this._.cloneDeep(item)
        if(this.userStatus === 'register') {
            this.show = false
        }else {
          if(item.key_name === 'OrgIdValue') {
            this.pickerArr = this.componys
          }else if(item.key_name === 'duty') {
            this.pickerArr = this.postDic
          }
          this.show = true
        }
      },
      onCancel(){
        this.searchList = [];
        this.searchIn = false;
      },
      onSearch(){
        let _this = this;
        // 获取所在单位字典项
        if (this.search) {
          this.componys = this.allComponys.filter(function(compony) {
            return Object.keys(compony).some(function(key) {
              if(key=='text'){
                return String(compony[key]).toLowerCase().indexOf(_this.search) > -1
              }
            })
          })
          this.searchList = this.componys;
        }else{
          this.searchList = []
        }
      },
      // 获取picker值
      onChange(v) {
        console.log(v)
      },
      // picker 取消时触发
      cancel() {
        this.show = false
      },
      // picker 确定时触发
      confirm(v) {
        if(this.currentProperty.key_name === 'duty') {
          this.form.duty = v
          this.show = false
          this.validateEmpty(4)
        }else if(this.currentProperty.key_name === 'OrgIdValue') {
          this.form.OrgIdValue = v
          this.show = false
          this.validateEmpty(0)
        }
      },
      // 校验非空
      validateEmpty(index) {
        let item = this.table[index]
        if(index === 0 && !this.form['OrgIdValue'].text) {
          item.message = '请输入' + item.title
          this.setCheck(index,false)
        }else if(!this.form[item.key_name]) {
          item.message = '请输入' + item.title
          this.setCheck(index,false)
        }else {
          item.message = ''
          this.setCheck(index,true)
        }
      },
      // 校验电话
      validatePhone(index) {
        let item = this.table[index]
        if(!this.form[item.key_name]) {
          item.message = '请输入' + item.title
          this.setCheck(index,false)
        }else if(!/^1[3456789]\d{9}$/.test(this.form[item.key_name])) {
          item.message = '手机号格式错误'
          this.setCheck(index,false)
        }else {
          item.message = ''
          this.setCheck(index,true)
        }
      },
      validateUser(index){
        let item = this.table[index]
        let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        if(!this.form[item.key_name]) {
          item.message = '请输入' + item.title
          this.setCheck(index,false)
        }else if(!/^.{2,}$/.test(this.form[item.key_name])) {
          item.message = '输入字符不能少于2个'
          this.setCheck(index,false)
        }else if(!/^.{2,20}$/.test(this.form[item.key_name])) {
          item.message = '输入字符不能超过20个'
          this.setCheck(index,false)
        }else if(pattern.test(this.form[item.key_name])) {
          item.message = '输入中含有特殊字符'
          this.setCheck(index,false)
        }else {
          item.message = ''
          this.setCheck(index,true)
        }
      },
      // 校验身份证号
      validateCardNo(index) {
        let item = this.table[index]
//      if(!this.form[item.key_name]) {
//        item.message = '请输入' + item.title
//        this.setCheck(index,false)
//      }else
        if(!this.form[item.key_name]) {
          item.message = ''
          this.setCheck(index,true)
        }else if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.form[item.key_name])){
          item.message = '请输入正确身份证号'
          this.setCheck(index,false)
        }else {
          item.message = ''
          this.setCheck(index,true)
        }
      },
      // 判断当前校验项是否通过
      setCheck(index,val) {
        this.check[index] = val
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .search-list{
    padding:0 16px;
    li{
      line-height: 40px;
      border-bottom: solid 1px #eee;
      height: 40px;
    }
  }
  .auth {
    height:calc(100vh - 50px);
    background:#F2F2F2;
    .header {
      display:flex;
      align-items: center;
      background:#fff;
      margin-bottom:.8rem;
      padding:1rem;
      .certified{
        vertical-align: middle;
        display: inline-block;
        margin-left: 0.2rem;
        img{
          width: 5.5rem;
          height: 1.5rem;
          display: inline-block;
        }
      }
      .edit{
        position: absolute;
        right: 15px;
        top: 28px;
        img{
          width: 1.43rem;
          height: 1.39rem;
        }
      }
    }
    .header .avatar {
      width:3.2rem;
      height:3.2rem;
      overflow: hidden;
      border-radius: 50%;
      margin-right:1rem;
    }
    .statu-mark {
      display:flex;
      align-items: center;
      justify-content: space-around;
      background:#cccccc;
      border-radius:1.6rem;
      padding:.2rem .8rem .2rem .4rem;
      color:#fff;
    }
    .statu-mark.unregister {
      
    }
    .statu-mark.register {
      background:#ffb400;
    }
    .statu-mark.fail {
      background:#ff3d2f;
    }
    .unregister img {
      width:.3rem;
      height:auto;
    }
    .register img{
      width:1rem;
      height:auto;
    }
    .fail img {
      width:.8rem;
      height:auto;
    }
    .img-container {
      display:flex;
      justify-content: center;
      align-items: center;
      width:1.2rem;
      height:1.2rem;
      margin-right:.4rem;
      background:#fff;
      border-radius: .6rem;
    }
    .pop-container {
      width:100%;
    }
    .submit-btn {
      color:#fff;
      background:#4a79df;
      margin-top:2rem;
    }
    .kedit{
      input{
        background:#efefef;
        padding:0.2rem;
      }
    }
  }
</style>