import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/pages/home-page'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'*',
      redirect: {
        name: 'home_page'
      }
    },
    {
      path: '/home-page',
      name: 'home_page',
      component: HomePage,
      meta: {
        keepAlive: true
      }
    }]
})
