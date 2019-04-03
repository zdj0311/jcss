import Vue from 'vue'

Vue.directive('validate', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el,binding,vnode) {
    let temp = binding.value
    let conditions = []
    conditions = temp.split('|')
    console.log(el.getElementsByTagName('input')[0].value)
  }
})