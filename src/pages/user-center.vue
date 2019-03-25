<template>
  <div class="user-center">
    <header class="header">
      <img :src="user.wxUser&&user.wxUser.headImgUrl || avatar"/>
      <span>{{ user.wxUser&&user.wxUser.nicknameuser || user.userName }}</span>
    </header>
    <van-cell v-for="(item,index) in properties" :key="index" :value="item.value" is-link :icon="item.icon" @click="item.touch && changeProperty(item)">
      <template slot="title">
        <span class="custom-text">{{ item.label }}</span>
      </template>
    </van-cell>
    <!--<van-cell :value="user.orgIdValue" is-link :icon="orgName">
      <template slot="title">
        <span class="custom-text">所在单位</span>
      </template>
    </van-cell>
    <van-cell :value="user.userName" is-link :icon="contact" @click="changeProperty(user.userName)">
      <template slot="title">
        <span class="custom-text">姓名</span>
      </template>
    </van-cell>
    <van-cell :value="user.mobile" is-link :icon="phone">
      <template slot="title">
        <span class="custom-text">联系电话</span>
      </template>
    </van-cell>
    <van-cell :value="user.roomNo" is-link :icon="room">
      <template slot="title">
        <span class="custom-text">房间号</span>
      </template>
    </van-cell>
    <van-cell :value="user.dutyValue" is-link :icon="duty">
      <template slot="title">
        <span class="custom-text">职务</span>
      </template>
    </van-cell>
    <van-cell :value="user.cardNo" is-link :icon="idCard">
      <template slot="title">
        <span class="custom-text">身份证号</span>
      </template>
    </van-cell>-->
    
    <van-dialog v-model="showCurrent" show-cancel-button :before-close="beforeClose">
      <van-field v-model="currentProperty.value" :label="currentProperty.label" :placeholder="currentProperty.place" />
    </van-dialog>

    <van-popup v-model="showPop" class="pop-container" position="bottom">
      <van-picker :columns="postDic" @change="onChange" show-toolbar @cancel="cancel" @confirm="confirm"/>
    </van-popup>
    <van-button class="submit-btn" size="large" @click="save">保存</van-button>
    <!-- <van-cell is-link @click="onClick">
      <template slot="title">
        <span class="custom-text">退出</span>
      </template>
    </van-cell> -->
    <!--<van-popup v-model="show" class="pop-container" position="bottom">
      <van-picker :columns="columns" @change="onChange" show-toolbar @cancel="cancel" @confirm="confirm"/>
    </van-popup>-->
    
  </div>
</template>

<script>
  import avatar from 'assets/img/avatar.png'
  import orgName from 'assets/img/orgName.png'
  import contact from 'assets/img/contact.png'
  import phone from 'assets/img/phone.png'
  import duty from 'assets/img/duty.png'
  import room from 'assets/img/room.png'
  import idCard from 'assets/img/idCard.png'
  import {
  logout
} from "controller/order-create";
  import { getPostDic,bindUser } from 'controller/auth' // 职务列表
  export default {
    name: 'user_center',
    data() {
      let user = this.$store.state.admin.user
      return {
        properties:[{ // 初始化表单数据
          key:'orgIdValue',
          value:user.orgIdValue,
          label:'所在单位',
          place:'请输入',
          touch:false,
          icon:orgName,
          index:0
        },{
          key:'userName',
          value:user.userName,
          label:'姓名',
          place:'请输入',
          touch:true,
          icon:contact,
          index:1
        },{
          key:'mobile',
          value:user.mobile,
          label:'联系电话',
          place:'请输入',
          touch:true,
          icon:phone,
          index:2
        },{
          key:'roomNo',
          value:user.roomNo,
          label:'房间号',
          place:'请输入',
          touch:true,
          icon:room,
          index:3
        },{
          key:'dutyValue',
          value:user.dutyValue,
          label:'职务',
          place:'请输入',
          touch:true,
          icon:duty,
          index:4
        },{
          key:'cardNo',
          value:user.cardNo,
          label:'身份证号',
          place:'请输入',
          touch:true,
          icon:idCard,
          index:5
        }],
        user:this.$store.state.admin.user,
        avatar,
        orgName,
        contact,
        phone,
        duty,
        room,
        idCard,
        showCurrent:false, // 是否显示 输入框
        showPop:false, // 是否显示picker
        currentProperty: { // 当前点击选中的对象
          key:'',
          value:'',
          label:'',
          place:'',
          touch:'',
          icon:'',
          index:''
        },
        postDic:[]
      }
    },
    created() {
      console.log(this.user)
      getPostDic.bind(this)('dutyId').then(res=>{
        this.postDic = res
      })
    },
    methods: {
      onClick(){
        logout.bind(this)().then(res=>{
          this.$store.commit('admin/signout');
          this.$router.push({
            name:'auth'
          })
        }).catch(function(e){
          console.log(e)
        })
      },
      save() {
        this.$dialog.confirm({
          title: '提示',
          message: '确认提交修改吗？'
        }).then(() => {
          // on confirm
          console.log('save')
        }).catch(() => {
          // on cancel
          console.log('cancel')
        });
      },
      changeProperty(item) {
        if(item.index === 4) {
          this.showPop = true
        }else {
          this.currentProperty = this._.cloneDeep(item)
          this.showCurrent = true
        }
      },
      beforeClose(action, done) {
        if (action === 'confirm') {
          this.properties[this.currentProperty.index] = this.currentProperty
          this.$set(this.properties,this.currentProperty.index,this.currentProperty)
          done()
        } else {
          done();
        }
      },
      cancel() {
        this.showPop = false
      },
      onChange(v) {
        console.log(v)
      },
      confirm(v) {
        console.log(v)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .user-center {
    height:calc(100% - 50px);
    overflow:scroll;
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
    .submit-btn {
      color:#fff;
      background:#4a79df;
      margin-top:2rem;
    }
  }
</style>