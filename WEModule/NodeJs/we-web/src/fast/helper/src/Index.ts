import View from "./View";
import Params from "./Params";
const cl = console.log;
const help = () => {
  cl();
  cl(`快速生成页面与组件`);
  cl("-n  --n      名称");
  cl("-t  --t      类型:1=页面,2=组件");
  cl("-a  --append 名称");
  cl("例子");
  cl("yarn helper -t 2 -n  Index -a /index");
  cl();
};
if (Params.haveHelp()) {
  help();
} else {
  const params = Params.GetArgv();
  if (!params.name || !params.type || !params.append) {
    cl("参数不完整~");
    help();
  } else {
    let Type = Number(params.type);
    if (Type == 1 || Type == 2) {
      View.quick(params.name, Type, params.append);
    } else {
      cl("参数type不正确~");
      help();
    }
  }
}
