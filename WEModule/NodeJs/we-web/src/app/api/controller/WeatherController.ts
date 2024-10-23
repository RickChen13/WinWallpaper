import BaseController from '@/fast/api/BaseController';
import ApiBll from '@/app/api/bll/ApiBll';
import { type GetWeather } from "./WeatherInterface";
import { type RequestConfig } from "@/fast/api/Request.type";

class WeatherController extends BaseController {
    /**
     * 逻辑处理层
     */
    bll: ApiBll;

    constructor() {
        super();
        this.bll = new ApiBll();
    }

    /**
     * 获取arrayList
     *
     * @param config
     */
    async getWeather(config: GetWeather) {
        const url = "/weather";
        const reqConfig: RequestConfig = {
            url: this.bll.reqUrl(url),
            data: config.data,
            method: "get",
        };
        return this.request(reqConfig);
    }
}

export default WeatherController;
