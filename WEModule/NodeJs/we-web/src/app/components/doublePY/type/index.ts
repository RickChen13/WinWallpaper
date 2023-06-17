import ms from "./ms";

class DoublePY {
  static getValue(Default: string = "ms"): Py {
    switch (Default) {
      case "ms":
        return ms;
      default:
        return ms;
    }
  }
}

export default DoublePY;
