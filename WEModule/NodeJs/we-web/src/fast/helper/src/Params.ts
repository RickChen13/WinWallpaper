import { argv } from "process";
class Params {
  //-
  static param = (name: string, Default = null) => {
    for (let index = 0; index < argv.length; index++) {
      const element = argv[index];
      if (element == `-${name}`) {
        if (index + 1 < argv.length) {
          return argv[index + 1];
        }
        return Default;
      }
    }
    return Default;
  };
  //--
  static option = (name: string, Default = null) => {
    for (let index = 0; index < argv.length; index++) {
      const element = argv[index];
      if (element == `--${name}`) {
        if (index + 1 < argv.length) {
          return argv[index + 1];
        }
        return Default;
      }
    }
    return Default;
  };

  static GetArgv = () => {
    let name = Params.param("n");
    let type = Params.param("t");
    let append = Params.param("a");
    if (!name) {
      name = Params.option("name");
    }
    if (!type) {
      type = Params.option("type");
    }
    if (!append) {
      append = Params.option("append");
    }
    return {
      name,
      type,
      append,
    };
  };

  static haveHelp() {
    for (let index = 0; index < argv.length; index++) {
      const element = argv[index];
      if (element == "-h" || element == "--help") {
        return true;
      }
    }
    return false;
  }
}
export default Params;
