<template>
  <div class="show-more">
    <div v-show="show">
      <slot></slot>
    </div>
    <div @click="toggle">
      <span v-show="!show" class="title">{{ title }}</span>
      <span v-show="show" class="title">{{ packup }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'show_more',
    props: {
      value: Boolean,
      title: {
        default() {
          return '更多'
        }
      },
      packup: {
        default() {
          return '收起'
        }
      }
    },
    
    data() {
      return {
        show:false
      };
    },
    
    created() {
      
    },
    watch:{
      
    },
    methods: {
      toggle() {
        this.show = !this.show
      }
    }
  }

</script>
<style lang="scss">
  .show-more {
    .title {
      display:flex;
      justify-content: center;
      color:#fff;
      background-color:#4a79df;
      padding:.4rem 0;
    }
  }
</style>
