/**
 * 获取arrayList参数
 *
 * data: any 请求数据--详情请参考结构体定义
 *
 * url?: string 完整链接
 *
 * method?: string 请求方法
 *
 * chain?: boolean 是否链式返回
 *
 * success?: Function 非链式时，请求成功回调函数
 *
 * error?: Function 非链式时，请求失败回调函数
 */
export interface GetWeather {
  data: {
    city: string;
  };
  url?: string;
  method?: string;
  chain?: boolean;
  success?: Function;
  error?: Function;
}
