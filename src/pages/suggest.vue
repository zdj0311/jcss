<template>
  <div class="auth">
    <van-cell-group>
      <template v-for="(item,index) in table">
        <van-field v-model="form[item.key_name]" :type="item.type?item.type:'input'" :required="item.required" :label="item.title" :placeholder="item.placeholder" :error-message="item.message" @input="item.validate?item.validate(index):''" :readonly="item.readonly"/>
      </template>
    </van-cell-group>
    <van-button class="submit-btn" size="large" @click="submit()">提交</van-button>
  </div>
</template>

<script>
  import { feedback } from 'controller/feedback' // 职务列表
  export default {
    name: 'suggest',
    data() {
      return {
        user:this.$store.state.admin.user,
        check:[],
        form:{},
        table:[{
          key_name:'userName',
          value:'',
          title:'姓名',
          placeholder:'',
          readonly:true
        },{
          key_name:'orgName',
          value:'',
          title:'所在单位',
          placeholder:'',
          readonly:true
        },{
          key_name:'mobile',
          value:'',
          title:'联系电话',
          placeholder:'',
          readonly:true
        },{
          key_name:'txt',
          value:'',
          title:'意见',
          placeholder:'请输入意见',
          message:'',
          validate:this.validateEmpty,
          required: true,
          type: 'textarea',
          readonly:false
        }]
      }
    }, 
    created() {
      this.initForm()
    },
    methods: {
      initForm() {
        this.form = {
          orgName:this.user.orgName||'',
          userName:this.user.userName||'',
          mobile:this.user.mobile||'',
          txt:'',
        }
        for(let item in this.form) {
          if(item === 'txt') {
            this.check.push(false)
          }else {
            this.check.push(true)
          }
        }
      },
      // 提交表单
      submit() {
        let result = true
        this.check.forEach((item,index)=>{
          if(item === false) {
            this.validateEmpty(index)
          }
        })
        this.check.forEach((item,index)=>{
          if(item === false) {
            result = false;
          }
        })
        if(result) {
          feedback.bind(this)(this.form).then(res=>{
            this.$toast('已提交')
            this.$router.push('feedback');
          })
        }
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