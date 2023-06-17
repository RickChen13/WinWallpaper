import axios from "axios"
import { requestConfig } from "./interface/indexInterface"

class HttpAxios {
    /**
     * 通用请求
     * 
     * @param config 
     * @returns 
     */
    async request(config: requestConfig) {
        config = this.checkConfig(config)
        let axiosRequestConfig
        if (config.method == "post") {
            axiosRequestConfig = {
                url: config.url,
                data: config.data,
                method: config.method,
                timeout: config.timeout,
                headers: config.headers,
            }
        } else {
            axiosRequestConfig = {
                url: config.url,
                params: config.data,
                method: config.method,
                timeout: config.timeout,
                headers: config.headers,
            }
        }
        if (config.chain == true) {
            const res = await axios(axiosRequestConfig).then((success) => {
                if (typeof (config.success) == 'function') {
                    return config.success(success.data)
                }
            }).catch((error) => {
                if (typeof (config.error) == 'function') {
                    return config.error(error)
                }
            })
            return res
        } else {
            axios(axiosRequestConfig).then((success) => {
                if (typeof (config.success) == 'function') {
                    config.success(success.data)
                }
            }).catch((error) => {
                if (typeof (config.error) == 'function') {
                    config.error(error)
                }
            })
        }
    }

    /**
     * post请求
     * 
     * @param config requestConfig
     */
    async post(config: requestConfig) {
        config = this.checkConfig(config)
        const method: any = 'post'
        const axiosRequestConfig = {
            url: config.url,
            data: config.data,
            method: method,
            timeout: config.timeout,
            headers: config.headers,
        }
        if (config.chain == true) {
            const res = await axios(axiosRequestConfig).then((success) => {
                if (typeof (config.success) == 'function') {
                    return config.success(success.data)
                }
            }).catch((error) => {
                if (typeof (config.error) == 'function') {
                    return config.error(error)
                }
            })
            return res
        } else {
            axios(axiosRequestConfig).then((success) => {
                if (typeof (config.success) == 'function') {
                    config.success(success.data)
                }
            }).catch((error) => {
                if (typeof (config.error) == 'function') {
                    config.error(error)
                }
            })
        }

    }

    /**
     * get请求
     * 
     * @param config requestConfig
     */
    async get(config: requestConfig) {
        config = this.checkConfig(config)
        const method: any = 'get'
        const axiosRequestConfig = {
            url: config.url,
            params: config.data,
            method: method,
            timeout: config.timeout,
            headers: config.headers,
        }
        if (config.chain == true) {
            const res = await axios(axiosRequestConfig).then((success) => {
                if (typeof (config.success) == 'function') {
                    return config.success(success.data)
                }
            }).catch((error) => {
                if (typeof (config.error) == 'function') {
                    return config.error(error)
                }
            })
            return res
        } else {
            axios(axiosRequestConfig).then((success) => {
                if (typeof (config.success) == 'function') {
                    config.success(success.data)
                }
            }).catch((error) => {
                if (typeof (config.error) == 'function') {
                    config.error(error)
                }
            })
        }
    }

    /**
     * 对传入参数进行处理
     * 
     * @param config 
     * @returns 
     */
    private checkConfig(config: requestConfig) {
        if (config.headers == undefined) {
            config.headers = {
                'Content-Type': 'application/x-www-form-urlencoded charset=UTF-8',
            }
        }
        if (config.method == undefined) {
            config.method = 'post'
        }
        if (config.timeout == undefined) {
            config.timeout = 5000
        }
        return config
    }
}

export default HttpAxios