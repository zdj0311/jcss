<template>
  <div class="user-center">
    <header class="header">
      <img :src="user.wxUser&&user.wxUser.headImgUrl || avatar"/>
      <span>{{ user.wxUser&&user.wxUser.nicknameuser || user.userName }}</span>
    </header>
    <van-cell :value="user.orgName" is-link :icon="orgName">
      <template slot="title">
        <span class="custom-text">客户</span>
      </template>
    </van-cell>
    <van-cell :value="user.userName" is-link :icon="contact">
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
    </van-cell>
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
  export default {
    name: 'user_center',
    data() {
      return {
        user:this.$store.state.admin.user,
        avatar,
        orgName,
        contact,
        phone,
        duty,
        room,
        idCard,
      }
    },
    created() {
      console.log(this.user)
    },
    methods: {
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .user-center {
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