import qs from "qs";
import BaseController from "@/app/api/base/BaseController";
import ExampleBll from "@/app/api/bll/WeatherBll";
import { GetWeather } from "@/app/api/interface/controller/Weather";

class WeatherController extends BaseController {
  /**
   * 逻辑处理层
   */
  bll: ExampleBll;

  constructor() {
    super();
    this.bll = new ExampleBll();
  }

  /**
   * 获取arrayList
   *
   * @param config
   */
  async getWeather(config: GetWeather) {
    const url = "/weather";
    const reqConfig = {
      url: this.bll.reqUrl(url),
      data: qs.stringify(config.data),
      method: this.checkMethond(config.method),
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
}

export default WeatherController;
