declare module "*.html";
declare module "*.png";
declare module "*.jpg";

interface Func {
  doublePY: {
    setStyle: Function;
    changeShow: Function;
    changeData: Function;
    start: Function;
  };
  background: {
    init_nextTick: Function;
    repeat: Function;
  };
  modules: {
    loading_datetime: Function;
    repeat: Function;
    setStyle: Function;
    init_weather: Function;
    init_nextTick: Function;
  };
  monitro: {
    setStyle: Function;
    start: Function;
    setShow: Function;
  };
}

type BackgroundConfigDevice = {
  class: string;
  path: string;
};

declare interface Window {
  wallpaperRegisterAudioListener: (audioArray: any) => void;
  wallpaperPropertyListener: {
    applyUserProperties: (userParams: any) => void;
  };
  backgroundConfig: {
    pc: BackgroundConfigDevice[];
    mobile: BackgroundConfigDevice[];
  };
}

interface PyLeft {
  value: string;
}

interface PyRight {
  value: string;
}

interface PyButton {
  left: PyLeft;
  right: PyRight[];
}

interface PyRow {
  button: PyButton[];
}

interface Py {
  data: PyRow[];
}
