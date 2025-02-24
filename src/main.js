import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // 确保引入 store
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = true;
Vue.use(ElementUI);
let a = new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app');

console.log(a)