import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8080', // 后端接口的基础地址
    withCredentials: true, // 允许跨域携带 Cookie
});

// 添加响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // 如果返回 401，跳转到登录页面
            window.location.href = 'http://localhost:8080/login';
        }
        // 返回错误，以便在具体请求中进一步处理
        return Promise.reject(error);
    }
);

// 导出配置好的 axios 实例
export default instance;