import Params from "./common/Params";
import View from "./view/View";
import ApiInterface from "./api/ApiInterface";

const cl = console.log;
const help = () => {
    cl();
    cl(`快速生成页面与组件`);
    cl("-t  --t      类型:1=页面,2=组件,3=api interface");
    cl("-n  --n      名称");
    cl("-a  --append 名称");
    cl("例子");
    cl("yarn helper -t 2 -n Index -a /index");
    cl();
};
if (Params.haveHelp()) {
    help();
} else {
    const params = Params.GetArgv();
    let Type = Number(params.type);
    switch (Type) {
        case 1:
        case 2:
            if (!params.name || !params.type || !params.append) {
                cl("参数不完整~");
                help();
            } else {
                View.quick(params.name, Type, params.append);
            }
            break;
        case 3:
            if (!params.name) {
                params.name = "Ex";
            }
            if (!params.append) {
                params.append = "Ex";
            }
            ApiInterface.quick(params.name, params.append);
            break;
        default:
            cl("参数type不正确~");
            help();
            break;
    }
}
