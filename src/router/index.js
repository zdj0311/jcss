import Vue from 'vue'
import Router from 'vue-router'
import maMain from '@/pages/ma-main'
import HomePage from '@/pages/home-page'
import OrderList from '@/pages/order-list'
import Feedback from '@/pages/feedback'
import userCenter from '@/pages/user-center'
import ServiceTrace from '@/pages/service-trace'
import OrderCreate from '@/pages/order-create'
import OrderResolver from '@/pages/order-resolver'
import OrderDetail from '@/pages/order-detail'
import Evaluation from '@/pages/evaluation'
import Auth from '@/pages/auth'
import DailyLog from '@/pages/daily-log'
import visualization from '@/pages/visualization'
import proxy from 'config/proxy'
Vue.use(Router)

export default new Router({
  base:proxy?'/jcss/jcss_app':'',
  routes: [
    {
      path:'*',
      redirect: {
        name: 'home_page'
      }
    },
    // 主页
    {
      path:'/',
      redirect: '/home-page',
      component:maMain,
      children:[{
      path: '/home-page',
      name: 'home_page',
      component: HomePage,
      meta: {
        keepAlive: true
      }
    },// 我的工单
    {
      path: '/order-list',
      name: 'order_list',
      component: OrderList,
      meta: {
        keepAlive: true
      }
    },// 意见反馈
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback,
      meta: {
        keepAlive: true
      }
    },// 个人中心
    {
      path: '/user-center',
      name: 'user_center',
      component: userCenter,
      meta: {
        keepAlive: true
      }
    },]
    },
    // 服务跟踪
    {
      path: '/service-trace',
      name: 'service_trace',
      component: ServiceTrace,
      meta: {
        keepAlive: true
      }
    },
    // 工单创建
    {
      path: '/order-create',
      name: 'order_create',
      component: OrderCreate,
      meta: {
        keepAlive: true
      }
    },
    // 工单处理
    {
      path: '/order-resolver',
      name: 'order_resolver',
      component: OrderResolver,
      meta: {
        keepAlive: true
      }
    },
    // 工单详情
    {
      path: '/order-detail',
      name: 'order_detail',
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
      name: 'daily_log',
      component: DailyLog,
      meta: {
        keepAlive: true
      }
    },
    // 可视化 综合管理服务平台
    {
      path: '/visualization',
      name: 'visualization',
      component: visualization,
      meta: {
        keepAlive: true
      }
    },
  ]
})
