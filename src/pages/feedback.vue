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
      <div class="content" @click="routeTo('survey-list')">
              您好，为了了解客户对运维服务的需求
              我们特别进行此次虚拟发放问卷调查，感谢您的积极参与
      </div>
    </div>
    <div class="item-container">
      <header class="item-header">
        <img :src="suggest"/>
        <span>投诉建议</span>
      </header>
      <div class="content content1" @click="routeTo('suggest')">
              如果您对我们有什么意见
              请在这里给我们留言,我们会及时给予回复,谢谢!
      </div>
    </div>
  </div>
</template>

<script>
  import feed from 'assets/img/feed.png'
  import exam from 'assets/img/exam.png'
  import suggest from 'assets/img/suggest.png'
  export default {
    name:'feedback',
    data() {
      return {
        feed,
        exam,
        suggest
      };
    },
    methods: {
      routeTo(name) {
        this.$router.push(name)
      }
    },
  }
</script>
<style lang='scss'>
  .feedback {
    height:calc(100% - 50px);
    overflow:scroll;
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
        padding:1rem 1rem;
        margin: 0 1rem;
        height:9rem;
        background:url('~@/assets/img/exam-back.png') no-repeat right center;
        background-size:30% auto;
      }
      .content1{
        padding:1rem 1rem;
        margin: 0 1rem;
        height:9rem;
        background:url('~@/assets/img/xx-back.png') no-repeat right center;
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