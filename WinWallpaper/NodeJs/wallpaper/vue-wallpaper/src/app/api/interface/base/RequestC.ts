/**
 * 通用请求类参数
 * 
 * url: string 完整链接
 * 
 * data: any 请求数据
 * 
 * method?: string 请求方法
 * 
 * chain?: boolean 是否链式返回
 * 
 * success?: Function 非链式时，请求成功回调函数
 * 
 * error?: Function 非链式时，请求失败回调函数
 */
 export interface axiosReqConfig {
    url: string
    data: any
    method?: string
    chain?: boolean
    success?: Function
    error?: Function
}

/**
 * 链式请求类参数
 * 
 * url: string 完整链接
 * 
 * data: any 请求数据
 * 
 * method?: string 请求方法
 * 
 * middleware?: boolean 是否对返回对数据进行校验
 */
export interface chainConfig {
    url: string
    data: any
    method?: string
    middleware?: boolean
}

/**
 * 回调函数式请求参数
 * 
 * url: string 完整链接
 * 
 * data: any 请求数据
 * 
 * method?: string 请求方法
 * 
 * middleware?: boolean 是否对返回对数据进行校验 非false则返回
 * 
 * success?: Function 非链式时，请求成功回调函数
 * 
 * error?: Function 非链式时，请求失败回调函数
 */
export interface callBlackConfig {
    url: string
    data: any
    method?: string
    middleware?: boolean
    success?: Function
    error?: Function
}

export interface Result {
    result: boolean
    code: number
    msg: string
    data: any
}

export interface ErrResult{
    result:boolean
    msg:string
    needRouter?:boolean
    router?:string
    needMsg?:boolean
}