import Vue from 'vue'

Vue.directive('check', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el,binding,vnode) {
    console.log(document.querySelector('#' + binding.value).children)
  }
})