import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import HomePage from '../components/HomePage.vue';
import EmployeeManagementPage from '../components/EmployeeManagementPage.vue';
import DepartmentManagementPage from '../components/DepartmentManagementPage.vue';
import LeaveManagementPage from '../components/LeaveManagementPage.vue';
import BuilddingPage from '../components/BuilddingPage.vue';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login', // 默认跳转到登录页面
  },
  {
    path: '/login',
    component: LoginPage,
  },
  {
    path: '/home',
    component: HomePage,

    children: [{
      path: 'employee',
      component: EmployeeManagementPage,
      meta: { tabLabel: '员工管理' },
    },
    {
      path: 'department',
      component: DepartmentManagementPage,
      meta: { tabLabel: '科室管理' },
    },
    {
      path: 'leave',
      component: LeaveManagementPage,
      meta: { tabLabel: '请假管理' },
    },
    {
      path: 'buildding-page',
      component: BuilddingPage,
      meta: { tabLabel: '正在建设的功能' },
    },
    ],

    meta: { requiresAuth: true }, // 需要登录才能访问
  },

];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;