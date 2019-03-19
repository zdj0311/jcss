<template>
  <div id="app">
    <keep-alive exclude="/">
      <router-view v-if="$route.meta.keepAlive"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  width:100%;
  height:100%;
  font-family:"微软雅黑";
}
</style>
