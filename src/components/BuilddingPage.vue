<template>
  <div class="construction-page">

    <!-- 页面主体 -->
    <el-main class="main">
      <div class="construction-message">
        <i class="el-icon-warning-outline"></i>
        <h1>功能正在建设中...</h1>
        <p>我们正在努力为您打造更好的服务，敬请期待！</p>
      </div>
    </el-main>

    <!-- 底部信息 -->
    <el-footer class="footer">
      <p>© 2025 请假管理系统. 版权所有.</p>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: 'BuilddingPage'
};
</script>

<style scoped>
/* 页面整体样式 */
.construction-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa; /* 浅灰色背景，简洁美观 */
}

/* 顶部导航栏样式 */
.header {
  background-color: #409eff; /* Element UI 主色调 */
  color: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.logo i {
  font-size: 24px;
  margin-right: 10px;
}

/* 页面主体样式 */
.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.construction-message {
  max-width: 600px;
}

.construction-message i {
  font-size: 60px;
  color: #409eff; /* Element UI 主色调 */
  margin-bottom: 20px;
}

.construction-message h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
}

.construction-message p {
  font-size: 18px;
  color: #666;
}

/* 底部信息样式 */
.footer {
  background-color: #409eff; /* Element UI 主色调 */
  color: white;
  text-align: center;
  padding: 10px 0;
}
</style>