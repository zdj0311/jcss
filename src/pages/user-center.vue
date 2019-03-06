<template>
  <div class="user-center">
    <header class="header">
      <img :src="avatar"/>
      <span>魔法</span>
    </header>
    <van-cell value="郑丹菊" icon="shop-o" is-link>
      <template slot="title">
        <span class="custom-text">客户名称</span>
      </template>
    </van-cell>
    <van-cell value="郑丹菊" icon="shop-o" is-link>
      <template slot="title">
        <span class="custom-text">联系人</span>
      </template>
    </van-cell>
    <van-cell value="郑丹菊" icon="shop-o" is-link>
      <template slot="title">
        <span class="custom-text">联系电话</span>
      </template>
    </van-cell>
  </div>
</template>

<script>
  import avatar from 'assets/2017.jpg'
  export default {
    name: 'user_center',
    data() {
      return {
        avatar
      }
    },
    created() {
      console.log(this.addHost('/aaa'))
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
  }
</style>