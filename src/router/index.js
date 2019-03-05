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
    // 主页
    {
      path: '/home-page',
      name: 'home_page',
      component: HomePage,
      meta: {
        keepAlive: true
      }
    },
    // 我的工单
    {
      path: '/order-list',
      name: 'order-list',
      component: OrderList,
      meta: {
        keepAlive: true
      }
    },
    // 意见反馈
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback,
      meta: {
        keepAlive: true
      }
    },
    // 个人中心
    {
      path: '/user-center',
      name: 'user-center',
      component: userCenter,
      meta: {
        keepAlive: true
      }
    },
    // 服务跟踪
    {
      path: '/service-trace',
      name: 'service-trace',
      component: ServiceTrace,
      meta: {
        keepAlive: true
      }
    },
    // 工单创建
    {
      path: '/order-create',
      name: 'order-create',
      component: OrderCreate,
      meta: {
        keepAlive: true
      }
    },
    // 工单处理
    {
      path: '/order-resolver',
      name: 'order-resolver',
      component: OrderResolver,
      meta: {
        keepAlive: true
      }
    },
    // 工单详情
    {
      path: '/order-detail',
      name: 'order-detail',
      component: OrderDetail,
      meta: {
        keepAlive: true
      }
    },
    // 评价
    {
      path: '/evaluation',
      name: 'evaluation',
      component: Evaluation,
      meta: {
        keepAlive: true
      }
    },
    // 身份认证
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: {
        keepAlive: true
      }
    },
    // 日报
    {
      path: '/daily-log',
      name: 'daily-log',
      component: DailyLog,
      meta: {
        keepAlive: true
      }
    },
  ]
})
