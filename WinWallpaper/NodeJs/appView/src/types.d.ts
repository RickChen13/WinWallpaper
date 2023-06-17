declare interface Window {
  MainApi: {
    GetApps: () => string;
    OpenApp: (path: string, config: string) => void;
    GetOpenApp: () => string;
    GetConfig: (path: string) => string;
    GetAppConfig: (dir: string) => string;
    AppConfigChange: (config: string) => void;
    OpenFolder: (path: string) => string;
    AutoOpenApp: (auto: boolean) => void;
    SubWs: (sub: boolean) => void;
  };
  MainCallBack: {
    AutoOpenApp: (auto: boolean) => void;
    SubWs: (sub: boolean) => void;
  };
}
