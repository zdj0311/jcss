<template>
  <div class="news_page">
    <load-more class="container" :onRefresh="onRefresh" :onInfinite="onInfinite">
      <section class="item" v-for="(item, index) in orderList" :key="index">
        <h1>这是一个标题</h1>
        <p>這是內容一個腳很這是內容一個腳很這是內容一個腳很這是內容一個腳很這是內容一個腳很這是內容一個腳很這是內容一個腳很這是內容一個腳很這是內容一個腳很這是內容一個腳很</p>
        <section class="foot">
          <span>[Java]</span>
          <img :src="person"/><span class="grey">张燕</span>
          <img :src="time"/><time class="grey">2019-01-01</time>
        </section>
      </section>
    </load-more>
  </div>
</template>

<script>
  import loadMore from 'components/load-more';
  import time from 'assets/img/time.png';
  import person from 'assets/img/person.png';
  export default {
    name: 'news_page',
    components: { loadMore },
    data() {
      return {
        time, person,
        orderList: [1,2,3,4],
        
      }
    },
    methods: {
      onRefresh() {
        
      },
      onInfinite() {
        
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .news_page {
    height:calc(100vh - 44px);
    .container {
      padding-top:2.6rem;
      height:100%;
      .item {
        margin-top:1rem;
        background:#fff;
        padding:0 1rem;
        h1 {
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 2; 
          -webkit-box-orient: vertical;
          font-size:1.1rem;
          color:#1d89fa;
          padding:1rem 0;
        }
        p {
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 2; 
          -webkit-box-orient: vertical;
        }
        .foot {
          display:flex;
          align-items: center;
          padding:1rem 0;
          .grey {
            color:#bbbbbb;
          }
          img {
            width:1rem;
            height:1rem;
            margin:0 .6rem;
          }
        }
      }
      background:#ececec;
    }
  }
</style>