<template>
  <el-container class="home-container">
    <!-- 左侧导航栏 -->
    <el-aside :width="isCollapse ? '80px' : '240px'" class="aside">
      <div class="logo-container">
        <img src="@/assets/hospital.png" alt="Hospital Logo"
             :style="{width: isCollapse ? '40px' : '80px'}"
             class="sidebar-logo">
      </div>
      <el-menu
        :default-active="activeTab"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#2b3a4a"
        text-color="#e6f7ff"
        active-text-color="#00c0ef"
        :collapse-transition="false"
        :router="true"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span slot="title">系统管理</span>
          </template>
          <el-menu-item index="/home/department" @click="navigateWithTab('科室管理', '/home/department')">
            <i class="el-icon-office-building"></i>
            <span>科室管理</span>
          </el-menu-item>
          <el-menu-item index="/home/employee" @click="navigateWithTab('员工管理', '/home/employee')">
            <i class="el-icon-user-solid"></i>
            <span>员工信息</span>
          </el-menu-item>
          <el-menu-item index="/home/leave" @click="navigateWithTab('请假管理', '/home/leave')">
            <i class="el-icon-notebook-2"></i>
            <span>请假管理</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-document-checked"></i>
            <span slot="title">其他功能</span>
          </template>
          <el-menu-item index="/home/buildding-page" @click="navigateWithTab('未来的功能', '/home/buildding-page')">
            <i class="el-icon-data-analysis"></i>
            未来的功能
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!-- 右侧内容区域 -->
    <el-container>
      <!-- 顶部标题栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-button type="text" @click="toggleCollapse" class="collapse-btn">
            <i :class="isCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"
               style="color: #2b3a4a; font-size: 20px;"></i>
          </el-button>
          <div class="hospital-title">
            <span class="main-title">大连市第五人民医院考勤管理系统</span>
            <span class="sub-title">HOSPITAL MANAGEMENT SYSTEM</span>
          </div>
          <el-tabs v-model="activeTab" class="header-tabs" @tab-click="handleTabClick">
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.path"
              :name="tab.path"
              :label="tab.label"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="header-right">
          <div class="user-info">
            <el-avatar :size="36" :src="require('@/assets/doctor-avatar.png')"
                      class="user-avatar"></el-avatar>
            <div class="user-details">
              <span class="user-name">{{userId}}</span>
              <span class="user-role">{{fullName}}</span>
            </div>
          </div>
          <el-tooltip content="退出系统" placement="bottom">
            <el-button
              type="text"
              @click="logout"
              class="logout-btn"
            >
              <i class="el-icon-switch-button" style="color: #2b3a4a; font-size: 20px;"></i>
            </el-button>
          </el-tooltip>
        </div>
      </el-header>

      <!-- 主内容区域 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import axios from 'axios';

export default {
  name: 'HospitalSystem',
  data() {
    return {
      isCollapse: false,
      tabs: [],
      activeTab: '',
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        this.updateTabs(route);
      },
    },
  },
  computed: {
    // 从 Vuex 中获取用户名
    userId() {
      return this.$store.state.user.userId || '未知用户';
    },
    fullName() {
      return this.$store.state.user.fullName || '未知用户';
    },
  },
  mounted() {
    this.updateTabs(this.$route);
  },
  methods: {
    navigateWithTab(label, path) {
      const existingTab = this.tabs.find((tab) => tab.path === path);
      if (!existingTab) {
        this.tabs.push({ label, path });
      }
      this.activeTab = path;
    },
    updateTabs(route) {
      if (!route.meta?.tabLabel) return;
      const tabExists = this.tabs.some((tab) => tab.path === route.path);
      if (!tabExists) {
        this.tabs.push({
          label: route.meta.tabLabel,
          path: route.path,
        });
      }
      this.activeTab = route.path;
    },
    handleTabClick(tab) {
      if (this.$route.path !== tab.name) {
        this.$router.push(tab.name);
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {
      this.$confirm('确定要退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'hospital-confirm'
      }).then(() => {
        // 保存用户信息到 localStorage
        localStorage.removeItem('user');

        // 保存用户信息到 Vuex（如果使用 Vuex）
        // this.$store.commit('setUser', response.data.data);
        this.$store.dispatch('logout');
        this._logout();
      });
    },

    async _logout() {
      console.log(this.$store)
      try {
        const response = await axios.post('/api/logout', this.form);

        if (response.data.code === 200) {
          
          // 跳转到主页面
          this.$router.push('/');
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

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  background: #f0f4f7;
  font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
}

/* 左侧导航栏 */
.aside {
  background: #2b3a4a;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;

  .logo-container {
    padding: 20px;
    background: #223a4a;
    text-align: center;
    transition: all 0.3s;

    .sidebar-logo {
      transition: all 0.3s;
    }
  }

  .el-menu {
    border-right: none;
    padding: 10px 0;

    .el-submenu__title,
    .el-menu-item {
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
      transition: all 0.2s;

      &:hover {
        background-color: rgba(255, 255, 255, 0.08) !important;
      }

      i {
        margin-right: 8px;
        font-size: 18px;
      }
    }

    .el-menu-item.is-active {
      background-color: #00c0ef !important;
      color: #fff !important;
      border-radius: 4px;
      margin: 0 10px;
    }
  }
}

/* 顶部标题栏 */
.header {
  height: 70px !important;
  background: linear-gradient(135deg, #f8fbfd, #e6f4f9) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e0ebf3;

  .header-left {
    display: flex;
    align-items: center;
    gap: 25px;

    .hospital-title {
      display: flex;
      flex-direction: column;
      margin-right: 30px;

      .main-title {
        font-size: 20px;
        color: #2b3a4a;
        font-weight: 600;
        letter-spacing: 1px;
        font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
      }

      .sub-title {
        font-size: 12px;
        color: #7f8fa4;
        letter-spacing: 0.5px;
        font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
      }
    }

    .header-tabs {
      ::v-deep .el-tabs__header {
        margin: 0;
      }

      ::v-deep .el-tabs__item {
        height: 70px;
        line-height: 70px;
        color: #7f8fa4;
        font-size: 15px;
        font-weight: 500;
        font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
        padding: 0 25px;
        transition: all 0.2s;

        &:hover {
          color: #2b3a4a;
        }

        &.is-active {
          color: #00c0ef;
          font-weight: 600;
        }
      }

      ::v-deep .el-tabs__nav-wrap::after {
        height: 2px;
        background-color: #00c0ef;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 25px;

    .user-info {
      display: flex;
      align-items: center;
      padding: 5px 15px;
      background: rgba(43, 58, 74, 0.05);
      border-radius: 30px;
      transition: all 0.2s;

      &:hover {
        background: rgba(43, 58, 74, 0.1);
      }

      .user-avatar {
        margin-right: 12px;
        border: 2px solid #00c0ef;
      }

      .user-details {
        display: flex;
        flex-direction: column;

        .user-name {
          font-size: 14px;
          color: #2b3a4a;
          font-weight: 500;
          font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
        }

        .user-role {
          font-size: 12px;
          color: #7f8fa4;
          font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
        }
      }
    }

    .logout-btn {
      padding: 8px;
      border-radius: 50%;
      transition: all 0.2s;

      &:hover {
        background: rgba(43, 58, 74, 0.1);
        transform: rotate(90deg);
      }
    }
  }
}

/* 主内容区域 */
.main {
  padding: 25px;
  background: #f8fbfd;
  min-height: calc(100vh - 70px);
  font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
}

/* 全局弹窗样式 */
.hospital-confirm {
  .el-message-box__header {
    background: #f8fbfd;
    border-bottom: 1px solid #e0ebf3;
  }

  .el-message-box__content {
    padding: 25px;
    color: #5f6368;
    font-family: 'Microsoft YaHei', sans-serif; /* 统一使用微软雅黑 */
  }

  .el-message-box__btns {
    padding: 15px 25px;
  }
}



[class^="el-icon-hospital-"],
[class*=" el-icon-hospital-"] {
  font-family: 'Microsoft YaHei' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: middle;
}
</style>