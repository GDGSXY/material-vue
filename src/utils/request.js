import axios from 'axios'

// axios 配置
const instance = axios.create({
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000,
    baseURL: '/api', // 接口请求地址
    withCredentials: true // 允许携带cookie
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
}, error => {
    return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})

export default instance

/**
 * get请求
 * @param url
 * @param data
 * @param headers
 * @returns {Promise}
 */
export function getRequest (url, data = {}, headers) {
    return new Promise((resolve, reject) => {
        instance({
            method: 'get',
            url: url,
            data: data || '',
            params: data || '',
            headers: headers || { 'Content-Type': 'application/json' }
        })
            .then(response => {
                const data = response.data
                resolve(data)
            }).catch(err => {
            reject(err)
        })
    })
}

/**
 * post请求
 * @param url
 * @param data
 * @param headers
 * @returns {Promise}
 */
export function postRequest (url, data = {}, headers) {
    return new Promise((resolve, reject) => {
        instance({
            method: 'post',
            url: url,
            data: data || '',
            headers: headers || { 'Content-Type': 'application/json' }
        })
            .then(response => {
                const data = response.data
                resolve(data)
            }).catch(err => {
            reject(err)
        })
    })
}

/**
 * put请求
 * @param url
 * @param data
 * @param headers
 * @returns {Promise}
 */
export function putRequest (url, data = {}, headers) {
    return new Promise((resolve, reject) => {
        instance({
            method: 'put',
            url: url,
            data: data || '',
            params: data || '',
            headers: headers || { 'Content-Type': 'application/json' }
        })
            .then(response => {
                const data = response.data
                resolve(data)
            }).catch(err => {
            reject(err)
        })
    })
}

/**
 * delete请求
 * @param url
 * @param data
 * @param headers
 * @returns {Promise}
 */
export function deleteRequest (url, data = {}, headers) {
    return new Promise((resolve, reject) => {
        instance({
            method: 'delete',
            url: url,
            data: data || '',
            params: data || '',
            headers: headers || { 'Content-Type': 'application/json' }
        })
            .then(response => {
                const data = response.data
                resolve(data)
            }).catch(err => {
            reject(err)
        })
    })
}