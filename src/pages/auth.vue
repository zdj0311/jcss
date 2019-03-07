<template>
  <div class="auth">
    <header class="header">
      <img :src="avatar"/>
      <span>魔法</span>
    </header>
    <van-cell-group>
      <van-field v-for="(item,index) in table" :key="index" v-model="form[item.key_name]" :label="item.title" :placeholder="item.placeholder" :error-message="item.message" @blur="item.validate(form,table,index)"/>
      <!--<van-field v-model="form.userName" label="姓名" placeholder="请输入姓名" error-message="" @blur="validateUserName(form.userName)"/>
      <van-field v-model="form.mobile" label="联系电话" placeholder="请输入联系电话" error-message="" @blur="validateMobile(form.mobile)"/>
      <van-field v-model="form.roomNo" label="房间号" placeholder="请输入房间号" error-message="" @blur="validateRoomNo(form.roomNo)"/>
      <van-field v-model="form.dutyValue" label="职务" placeholder="请选择职务" error-message="" @focus="showPicker" @blur="validateDutyValue(form.dutyValue)"/>
      <van-field v-model="form.cardNo" label="身份证号" placeholder="请输入身份证号" error-message="" @blur="validateCardNo(form.cardNo)"/>-->
    </van-cell-group>
    <van-popup v-model="show" class="pop-container" position="bottom">
      <van-picker :columns="columns" @change="onChange" show-toolbar @cancel="cancel" @confirm="confirm"/>
    </van-popup>
    
  </div>
</template>

<script>
  import avatar from 'assets/2017.jpg'
  export default {
    name: 'user_center',
    data() {
      let validateEmpty= function(form,table,index) {
        let item = table[index]
        if(!form[item.key_name]) {
          item.message = '请输入' + item.title
        }
      }
      return {
        avatar,
        user:this.$store.state.admin.user,
        columns:[1,2,3],
        show:false,
        form:{},
        table:[{
          key_name:'orgName',
          value:'',
          title:'客户名称',
          placeholder:'请输入客户名称',
          message:'',
          validate:validateEmpty
        },{
          key_name:'userName',
          value:'',
          title:'姓名',
          placeholder:'请输入姓名',
          message:'',
          validate:validateEmpty
        },{
          key_name:'mobile',
          value:'',
          title:'联系电话',
          placeholder:'请输入联系电话',
          message:'',
          validate:validateEmpty
        },{
          key_name:'roomNo',
          value:'',
          title:'房间号',
          placeholder:'请输入房间号',
          message:'',
          validate:validateEmpty
        },{
          key_name:'dutyValue',
          value:'',
          title:'职务',
          placeholder:'请输入职务',
          message:'',
          validate:validateEmpty
        },{
          key_name:'cardNo',
          value:'',
          title:'身份证号',
          placeholder:'请输入身份证号',
          message:'',
          validate:validateEmpty
        }]
      }
    },
    created() {
      this.initForm()
      console.log(this.form)
    },
    methods: {
      initForm(form) {
        this.form = form?form:{
          orgName:'',
          userName:'',
          mobile:'',
          roomNo:'',
          dutyValue:'',
          cardNo:''
        }
      },
      // 显示 picker
      showPicker() {
        this.show = true
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
        console.log(v)
      },
      validateOrgName(v) {
        
      },
      validateUserName(v) {
        
      },
      validateMobile(v) {
        
      },
      validateRoomNo(v) {
        
      },
      validateDutyValue(v) {
        
      },
      validateCardNo(v) {
        
      },
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
    .header img {
      width:3.2rem;
      height:3.2rem;
      overflow: hidden;
      border-radius: 50%;
      margin-right:1rem;
    }
    .pop-container {
      width:100%;
    }
  }
</style>