<template>
  <div class='feedback'>
    <header class="header">
      <img :src="feed"/>
      <span>致力为您提供专业、高效、高品质的韵味服务，  欢迎您提供宝贵的意见和建议。</span>
    </header>
    <div class="item-container">
      <header class="item-header">
        <img :src="exam"/>
        <span>调查问卷</span>
      </header>
      <div class="content">
              您好，为了了解客户对运维服务的需求
              我们特别进行此次虚拟发放问卷调查，感谢您的积极参与
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
  import feed from 'assets/img/feed.png'
  import exam from 'assets/img/exam.png'
  export default {
    name:'feedback',
    data() {
      return {
        feed,
        exam
      };
    },
    computed: {},
    watch: {},
    methods: {

    },
    created() {

    },
    mounted() {

    },
  }
</script>
<style lang='scss'>
  .feedback {
    height:100%;
    background:#F2F2F2;
    .header {
      display:flex;
      align-items: center;
      background:#fff;
      padding:1rem;
    }
    .header img {
      width:3.2rem;
      height:auto;
    }
    .header span {
      margin-left:1rem;
    }
    .item-container {
      background:#fff;
      margin-top:1rem;
      .content {
        padding:1rem 2rem;
        height:9rem;
        background:url('~@/assets/img/exam-back.png') no-repeat right center;
        background-size:30% auto;
      }
    }
    .item-header {
      display:flex;
      align-items: center;
      padding:.8rem;
    }
    .item-header img {
      width:20px;
      height:20px;
    }
    .item-header span {
      font-size:1.1rem;
      font-weight: bold;
      margin-left:.8rem;
    }
  }
</style>