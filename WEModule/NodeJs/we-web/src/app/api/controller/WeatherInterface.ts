/**
 * 获取arrayList参数
 *
 * data: any 请求数据--详情请参考结构体定义
 *
 * method?: string 请求方法
 * 
 * signal?: AbortSignal;//中断信号
 */
export interface GetWeather {
    data: {
        city: string;
    };
    method?: "post" | "get";
    signal?: AbortSignal;//中断信号
}
