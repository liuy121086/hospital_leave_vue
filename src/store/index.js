import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex); // 使用 Vuex 插件



// 创建 Vuex Store
export default new Vuex.Store({
  state: {
    user: null, // 用户信息
  },
  mutations: {
    // 设置用户信息
    setUser(state, user) {
      state.user = user;
    },
    // 清除用户信息
    clearUser(state) {
      state.user = null;
    },

  },
  actions: {
    // 登录操作
    login({ commit }, user) {
      commit('setUser', user); // 调用 mutation 设置用户信息
    },
    // 登出操作
    logout({ commit }) {
      commit('clearUser'); // 调用 mutation 清除用户信息
    },
  },
  getters: {
    // 判断用户是否已登录
    isAuthenticated(state) {
      return !!state.user;
    },

    token(state) {
        return state.user.token
    }
  },
});