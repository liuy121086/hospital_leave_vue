<template>
  <div class="login-container">
    <!-- 系统 Logo -->
    <div class="logo">
      <img src="@/assets/hospital.png" alt="医院系统 Logo" />
      <h1>考勤管理系统</h1>
    </div>

    <!-- 登录表单 -->
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="userId">用户名</label>
        <input
          type="text"
          id="userId"
          v-model="form.userId"
          placeholder="请输入用户名"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          type="password"
          id="password"
          v-model="form.password"
          placeholder="请输入密码"
          required
        />
      </div>
      <button type="submit" class="login-button">登录</button>
    </form>
  </div>
</template>

<script>

import {post} from '@/util/request'

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        userId: '',
        password: '',
      },
    };
  },
  methods: {
    async handleLogin() {
      console.log(this.$store)
      try {
        const response = await post('/api/login', this.form);

        if (response.code === 200) {
          // 保存用户信息到 localStorage
          localStorage.setItem('user', JSON.stringify(response.data));

          // 保存用户信息到 Vuex（如果使用 Vuex）
          // this.$store.commit('setUser', response.data);
          this.$store.dispatch('login', response.data);

          // 跳转到主页面
          this.$router.push('/home');
        } else {
          alert('登录失败，请检查用户名和密码。');
        }
      } catch (error) {
        console.error('登录请求失败:', error);
        alert('登录请求失败，请稍后重试。');
      }
    },
  },
};
</script>

<style scoped>
/* 全局样式 */
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: '微软雅黑', sans-serif;
  background: #e0f7fa; /* 浅蓝色背景，医院风格 */
}

#app {
  position: relative;
  height: 100%;
  overflow: hidden;
}

/* 登录容器 */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 系统 Logo */
.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo img {
  width: 100px;
  height: 100px;
}

.logo h1 {
  font-size: 2rem;
  color: #0077b6; /* 深蓝色 */
  margin-top: 1rem;
}

/* 登录表单 */
.login-form {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 119, 182, 0.1);
  width: 300px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #0077b6; /* 深蓝色 */
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #0077b6;
  border-radius: 5px;
  background: #f0f8ff; /* 浅蓝色背景 */
  color: #333;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background: #0077b6; /* 深蓝色 */
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.login-button:hover {
  background: #005f8b; /* 更深的蓝色 */
}
</style>