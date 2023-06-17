import fs, { constants } from "fs";
import path from "path";

const isAbsolute = function (filePath: string) {
  filePath = path.normalize(filePath);
  if (filePath.substring(0, 1) == "/") return true;
  if (filePath.search(/[\w]+:/) == 0) return true;
  return false;
};
const mkdirSync = function (dirPath: string) {
  if (dirPath == null || dirPath == "") return;
  dirPath = isAbsolute(dirPath)
    ? path.normalize(dirPath)
    : path.join(process.cwd(), dirPath);
  if (fs.existsSync(dirPath)) return;

  var arr = dirPath.split(path.sep);
  var index = arr.length - 1;
  var tempStr = arr[index];
  while (tempStr == "" && arr.length > 0) {
    index--;
    tempStr = arr[index];
  }
  if (tempStr == "") return;
  var newPath = dirPath.substring(0, dirPath.length - tempStr.length - 1);
  if (!fs.existsSync(newPath)) mkdirSync(newPath);
  fs.mkdirSync(dirPath);
};

export default class Write {
  /**
   * 文件写入
   *
   * @param string dir 目录
   * @param string Fullmc 文件名称
   * @param string content 内容
   * @return void
   */
  static put(dir: string, Fullmc: string, content: string) {
    Write.formatLast(dir, false);
    dir = path.join(dir);

    if (!fs.existsSync(dir)) {
      mkdirSync(dir);
    }
    let filename = dir + Fullmc;
    try {
      fs.accessSync(filename, constants.R_OK | constants.W_OK);
      console.log("文件：" + filename + "已经存在");
      return;
    } catch {}
    fs.writeFile(filename, content, (err) => {
      if (err) {
        return console.log(`文件${filename}写入失败`);
      }
      console.log(`${filename}创建成功`);
    });
  }

  static formatFrist(str: string, append = true) {
    let frist = str.substring(0, 1);
    if (append) {
      if (frist != "/") {
        str = "/" + str;
      }
    } else {
      if (frist == "/") {
        str = str.substring(1, str.length - 1);
      }
    }
    return str;
  }

  static formatLast(str: string, append = true) {
    let last = str.substring(str.length - 1);

    if (append) {
      if (last != "/") {
        str = str + "/";
      }
    } else {
      if (last == "/") {
        str = str.substring(0, str.length);
      }
    }
    return str;
  }
}
