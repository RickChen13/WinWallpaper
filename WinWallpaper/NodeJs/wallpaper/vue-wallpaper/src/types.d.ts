declare interface Window {
  ApplyUserProperties: any;
  params: any;
  backgroundConfig: any;
  background: any;
  wallpaperRegisterAudioListener: any;
  wallpaperPropertyListener: any;
  RWallpaperAudioListener: any;
  RWallpaperNetWork: any;
  RWallpaper: any;
  chrome: any;

  DesktopJsApi: any;
  WallpaperAudio: Function;
  WallpaperNetWorkSpeed: Function;
  WallpaperOpenHardware: Function;
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
