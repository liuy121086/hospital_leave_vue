import axios from 'axios'
//import { message } from 'antd' // 根据 UI 库调整（如 ElementUI、Ant Design）
import { Message } from 'element-ui'
import store from '@/store' // 根据项目状态管理调整
import router from '@/router' // 根据路由库调整

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:8080', // 根据环境变量设置基地址
  timeout: 10000, // 超时时间
  withCredentials: true // 跨域时携带 cookie（按需开启）
})

// 请求拦截器（携带 Token）
service.interceptors.request.use(
  config => {
    // 从 store 或 localStorage 获取 Token
    const token = store.getters.token || localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}` // JWT 标准格式
    }

    // 文件上传特殊处理
    if (config.isUpload) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器（统一错误处理）
service.interceptors.response.use(
  response => {
    const res = response.data

    // 假设业务状态码 200 表示成功（根据后端约定调整）
    if(res.type==='application/octet-stream') {
      return response;
    }

    if (res.code !== 200) {
      // 处理特定错误码（如 Token 过期）
      if (res.code === 401) {
        handleTokenExpired()
      } else {
        Message.error(res.message || '请求失败')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  error => {
    // HTTP 状态码处理（如 401、404、500）
    if (error.response) {
      switch (error.response.status) {
        case 401:
          handleTokenExpired()
          break
        case 403:
          Message.error('无权限访问')
          break
        case 404:
          Message.error('资源不存在')
          break
        case 500:
          Message.error('服务器错误')
          break
        default:
          Message.error(error.message)
      }
    } else {
      // 网络错误（如超时）
      Message.error('网络连接异常')
    }

    return Promise.reject(error)
  }
)

// Token 过期处理
let isRefreshing = false // 防止重复刷新
function handleTokenExpired() {
  if (!isRefreshing) {
    isRefreshing = true

    // 1. 清除旧 Token
    store.dispatch('user/resetToken').then(() => {
      // 2. 跳转到登录页
      router.replace('/login')

      // 3. 可选：携带当前路由路径，登录后跳转回来
      const fullPath = encodeURIComponent(router.currentRoute.fullPath)
      router.replace(`/login?redirect=${fullPath}`)
    }).finally(() => {
      isRefreshing = false
    })
  }
}

// 封装通用请求方法
export function request(options) {
  return service(options)
}

// 按需导出 GET/POST 等快捷方法
export function get(url, params, config = {}) {
  return service({
    url,
    method: 'get',
    params,
    ...config
  })
}

export function post(url, data, config = {}) {
  return service({
    url,
    method: 'post',
    data,
    ...config
  })
}

export function put(url, data, config = {}) {
  return service({
    url,
    method: 'put',
    data,
    ...config
  })
}

export function del(url, params, config = {}) {
  return service({
    url,
    method: 'delete',
    params,
    ...config
  })
}

// 文件上传专用方法
export function upload(url, file, data = {}) {
  const formData = new FormData()
  formData.append('file', file)
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })

  return post(url, formData, {
    isUpload: true // 标识为上传请求
  })
}