/**
 * 请求配置
 * 
 * url: string 完整链接
 * 
 * data: any 请求数据
 * 
 * chain?: boolean 是否链式返回
 * 
 * headers?: any 请求头
 * 
 * method?: any 请求方法
 * 
 * timeout?: number 超时时间
 * 
 * success?: Function 非链式时，请求成功回调函数
 * 
 * error?: Function 非链式时，请求失败回调函数
 */
 export interface requestConfig {
    url: string,//完整链接
    data: any,//请求数据
    chain?: boolean,//是否链式返回
    headers?: any,//请求头
    method?: any,//请求方法
    timeout?: number,//超时时间
    success?: Function,//非链式时，请求成功回调函数
    error?: Function,//非链式时，请求失败回调函数
}