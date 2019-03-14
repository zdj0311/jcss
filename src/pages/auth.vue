<template>
  <div class="auth">
    <header class="header">
      <img class="avatar" :src="avatar"/>
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
    </header>
    <van-cell-group>
      <template v-for="(item,index) in table">
        <van-field v-if="item.key_name === 'duty' && user.userStatus !== 'register'&&user.userStatus !== 'created' " v-model="form[item.key_name]&&form[item.key_name]['text']" :label="item.title" :placeholder="item.placeholder" :error-message="item.message" :readonly="item.readonly" @focus="showPicker" />
        <van-field v-if="item.key_name === 'duty' && (user.userStatus === 'register'||user.userStatus === 'created')" v-model="form[item.key_name]&&form[item.key_name]['text']" :label="item.title" :placeholder="item.placeholder" :error-message="item.message" :readonly="item.readonly" />
        <van-field v-if="item.key_name !== 'duty'" v-model="form[item.key_name]" :label="item.title" :placeholder="item.placeholder" :error-message="item.message" @blur="!item.readonly?item.validate(index):''" :readonly="item.readonly" />
      </template>
      <!--<van-field v-model="form.userName" label="姓名" placeholder="请输入姓名" error-message="" @blur="validateUserName(form.userName)"/>
      <van-field v-model="form.mobile" label="联系电话" placeholder="请输入联系电话" error-message="" @blur="validateMobile(form.mobile)"/>
      <van-field v-model="form.roomNo" label="房间号" placeholder="请输入房间号" error-message="" @blur="validateRoomNo(form.roomNo)"/>
      <van-field v-model="form.duty" label="职务" placeholder="请选择职务" error-message="" @focus="showPicker" @blur="validateduty(form.duty)"/>
      <van-field v-model="form.cardNo" label="身份证号" placeholder="请输入身份证号" error-message="" @blur="validateCardNo(form.cardNo)"/>-->
    </van-cell-group>
    <van-popup v-model="show" class="pop-container" position="bottom">
      <van-picker :columns="postDic" @change="onChange" show-toolbar @cancel="cancel" @confirm="confirm"/>
    </van-popup>
    <!-- 未注册 -->
    <van-button v-if="user.userStatus === 'UNRegister'" class="submit-btn" size="large" @click="submit">认证</van-button>
    <!-- 注册失败 -->
    <van-button v-if="user.userStatus === 'deny'" class="submit-btn" size="large" @click="submit">重新认证</van-button>
    <!-- 审核 user.userStatus === 'register'-->
    <van-button v-if="user.userStatus === 'register'" disabled class="submit-btn" size="large">努力认证中，请您稍等...</van-button>
  </div>
</template>

<script>
  import avatar from 'assets/img/avatar.png'
  import register from 'assets/img/register.png'
  import unregister from 'assets/img/unregister.png'
  import fail from 'assets/img/fail.png'
  import { getPostDic,bindUser } from 'controller/auth' // 职务列表
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
        user:this.$store.state.admin.user,
        postDic:[],
        check:[],
        show:false,
        form:{},
        table:[{
          key_name:'orgName',
          value:'',
          title:'客户名称',
          placeholder:'请输入客户名称',
          message:'',
          validate:this.validateEmpty,
          readonly:false
        },{
          key_name:'userName',
          value:'',
          title:'姓名',
          placeholder:'请输入姓名',
          message:'',
          validate:this.validateEmpty,
          readonly:false
        },{
          key_name:'mobile',
          value:'',
          title:'联系电话',
          placeholder:'请输入联系电话',
          message:'',
          validate:this.validateEmpty,
          readonly:false
        },{
          key_name:'roomNo',
          value:'',
          title:'房间号',
          placeholder:'请输入房间号',
          message:'',
          validate:function(){},
          readonly:false
        },{
          key_name:'duty',
          value:'',
          title:'职务',
          placeholder:'请输入职务',
          message:'',
          validate:function(){},
          readonly:true
        },{
          key_name:'cardNo',
          value:'',
          title:'身份证号',
          placeholder:'请输入身份证号',
          message:'',
          validate:this.validateCardNo,
          readonly:false
        }]
      }
    },
    created() {
      console.log(this.user)
      // 获取职务字典项 dutyId
      getPostDic.bind(this)('dutyId').then(res=>{
        this.postDic = res
      })
      this.initForm()
      this.readonlyTable()
    },
    methods: {
      init() {
        let proxy_key = ''
        if(process&&process.env&&process.env.NODE_ENV === 'proxy') proxy_key = 'proxy'
        getUser(proxy_key).then(res=>{
          console.log(res.data.data)
          this.$store.commit('admin/updateUser',res.data.data)
          this.user = this.$store.state.admin.user
          this.initForm()
          this.readonlyTable()
        })
      },
      initForm(form) {
        this.form = {
          orgName:this.user.orgName||'',
          userName:this.user.userName||'',
          mobile:this.user.mobile||'',
          roomNo:this.user.roomNo||'',
          duty:{
            code:this.user.duty||'',
            text:this.user.dutyValue||''
          },
          cardNo:this.user.cardNo||''
        }
        // 初始化校验数组，长度为form-item条数
        for(let item in this.form) {
          this.check.push(false)
        }
      },
      // 将整个form置为readonly
      readonlyTable() {
        if(this.user.userStatus === 'register' ||this.user.userStatus === 'created' ) {
            this.table.forEach(item=>{
            item.readonly = true
          })
        }
      },
      // 提交表单
      submit() {
        let result = true
        this.check.forEach((item,index)=>{
          if(index < 3 && item === false) {
            this.validateEmpty(index)
            result = false
          }else if(index === 5 && item === false) {
            result = this.validateCardNo(index)
            result = this.check[5]
          }
        })
        if(result) {
          alert(result)
          bindUser.bind(this)(this.form).then(res=>{
            this.$toast('已提交认证，请耐心等待')
            this.init() 
          })
        }
      },
      // 显示 picker
      showPicker() {
        if(this.userStatus === 'register') {
            this.show = false
        }else {
          this.show = true
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
        this.form.duty = v
//      this.postActive = v.text
        this.show = false
        this.validateEmpty(4)
      },
      // 校验非空
      validateEmpty(index) {
        let item = this.table[index]
        if(!this.form[item.key_name]) {
          item.message = '请输入' + item.title
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
  .auth {
    height:100%;
    background:#F2F2F2;
    .header {
      display:flex;
      align-items: center;
      background:#fff;
      margin-bottom:.8rem;
      padding:1rem;
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
  }
</style>