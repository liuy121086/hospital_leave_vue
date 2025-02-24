<template>
  <div id="app">
    <!-- 粒子背景 -->
    <div id="particles-js"></div>
    <!-- 路由视图 -->
    <router-view></router-view>
  </div>
</template>

<script>
import particlesJS from 'particles.js';

export default {
  name: 'App',
  mounted() {
    // 初始化粒子背景
    //this.initParticles();
  },
  methods: {
    initParticles() {
      particlesJS.load('particles-js', '/particles.json', () => {
        console.log('粒子背景加载完成');
      });
    },
  },
  created() {
    // 从 localStorage 中读取用户信息
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // 初始化 Vuex 状态
      this.$store.dispatch('login', user);
    }
  },
};
</script>

<style>
/* 全局样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  height: 100%;
}




</style>