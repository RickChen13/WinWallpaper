import HttpAxios from "@/fast/axios";
import {
  axiosReqConfig,
  chainConfig,
  callBlackConfig,
  Result,
  ErrResult,
} from "@/app/api/interface/base/RequestC";

abstract class BaseRequestC {
  http: HttpAxios;

  /**
   * 构造函数
   */
  constructor() {
    this.http = new HttpAxios();
  }

  /**
   * 公用请求方法(不会对url和data进行任何处理)
   *
   * @param config
   * @returns
   */
  async request(config: axiosReqConfig) {
    const reqConfig = {
      url: config.url,
      data: config.data,
      method: this.checkMethond(config.method),
      middleware: false,
      success: config.success,
      error: config.error,
    };
    if (config.chain == true) {
      return new Promise((resolve) => {
        resolve(this.chain(reqConfig));
      });
    } else {
      this.callBlack(reqConfig);
    }
  }

  /**
   * 回调函数式请求方法(公用)
   *
   * @param config
   */
  protected async callBlack(config: callBlackConfig) {
    this.http.request({
      url: config.url,
      data: config.data,
      method: config.method,
      success: (result: any) => {
        if (config.middleware != false) {
          result = this.success(result);
        }
        if (typeof config.success == "function") {
          config.success(result);
        }
      },
      error: (error: any) => {
        error = this.error(error);
        if (typeof config.error == "function") {
          config.error(error);
        }
      },
    });
  }

  /**
   * 链式请求方法(公用)
   *
   * @param config
   * @returns
   */
  protected async chain(config: chainConfig) {
    let { callBackRes }: any = {};
    callBackRes = await this.http.request({
      url: config.url,
      data: config.data,
      method: config.method,
      chain: true,
      success: (result: any) => {
        if (config.middleware != false) {
          result = this.success(result);
        }
        return result;
      },
      error: (error: any) => {
        const err = this.error(error);
        return err;
      },
    });
    return new Promise((resolve) => {
      resolve(callBackRes);
    });
  }

  /**
   * 检查请求方法
   *
   * @param methond
   * @returns
   */
  protected checkMethond(methond: any) {
    if (methond == undefined) {
      methond = "post";
    }
    return methond;
  }

  /**
   * 请求成功对返回数据的处理
   *
   * @param result
   */
  protected success(result: Result) {
    if (result.result) {
      return result;
    } else {
      if (result.code != 0) {
        const ErrResult = this.dealWithErrorCode(result);

        return ErrResult;
      } else {
        const res = { result: false, msg: result.msg };
        return res;
      }
    }
  }

  /**
   * 处理非成功返回状态码
   *
   * @param result
   */
  protected dealWithErrorCode(result: Result) {
    let ErrResult: ErrResult;
    switch (result.code) {
      case -1:
        ErrResult = {
          result: false,
          msg: "未登录",
          needRouter: true,
          router: "/",
          needMsg: true,
        };
        break;
      default:
        ErrResult = {
          result: false,
          msg: result.msg,
        };
        break;
    }
    return ErrResult;
  }

  /**
   * 请求失败处理
   *
   * @param error
   */
  protected error(error: any) {
    const result = {
      result: false,
      msg: "请求失败，请稍后再试",
      dev: error,
    };
    return result;
  }
}

export default BaseRequestC;
