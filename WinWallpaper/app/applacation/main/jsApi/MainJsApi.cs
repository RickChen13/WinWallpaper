using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using WinWallpaper.app.common;
using WinWallpaper.app.common.@event;

namespace WinWallpaper.app.applacation.main.jsApi
{
    [ClassInterface(ClassInterfaceType.AutoDual)]
    [ComVisible(true)]
    public class MainJsApi
    {
        private string AppsPath { get; set; } = AppContext.BaseDirectory + @"runtimes\apps";
        private Path Path { get; set; }

        public MainJsApi()
        {
            Path = new Path();
        }

        #region apps

        /// <summary>
        /// 获取所有项目
        /// </summary>
        /// <returns></returns>
        public string GetApps()
        {
            var appsDir = Path.GetDir(AppsPath);

            var result = new List<AppsList>();
            for (int i = 0; i < appsDir.Length; i++)
            {
                var path = appsDir[i] + @"\config.json";
                if (Path.IsFile(path))
                {
                    result.Add(new AppsList
                    {
                        path = appsDir[i],
                        config = GetConfig2Json(path)
                    });
                }
            }
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        /// <summary>
        /// 打开app
        /// </summary>
        /// <param name="path"></param
        /// <param name="config"></param>
        public void OpenApp(string path,string config)
        {
            var res = new AppsList() {
                path = path,
                config = Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(config),
            };
            var result =  Newtonsoft.Json.JsonConvert.SerializeObject(res);
            EventBus.OpenApp.Call( result);
            
        }

        /// <summary>
        /// 获取最后打开的项目
        /// </summary>
        /// <returns></returns>
        public string GetOpenApp()
        {
            var res = CacheHelper.cache.Get("openApp");
            if (res == null)
            {
                return "";
            }
            else
            {
                return res.ToString();
            }
        }

        public Newtonsoft.Json.Linq.JObject GetConfig2Json(string path)
        {
            var config = Path.GetTxt(path);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(config);
        }

        public string GetConfig(string path)
        {
            var config = GetConfig2Json(path);
            return Newtonsoft.Json.JsonConvert.SerializeObject(config);
        }

        /// <summary>
        /// 获取app设置
        /// </summary>
        /// <param name="dir"></param>
        /// <returns></returns>
        public string GetAppConfig(string dir)
        {
            var config = GetConfig2Json(dir);
            return Newtonsoft.Json.JsonConvert.SerializeObject(config);
        }

        /// <summary>
        /// app设置改变回调
        /// </summary>
        /// <param name="Config"></param>
        public void AppConfigChange(string Config)
        {
            EventBus.AppConfigChange.Call(Config);
        }

        /// <summary>
        /// 在文件管理器打开
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public string OpenFolder(string path)
        {
            return Helper.ExecuteCmd(@"explorer " + path);
        }

        public void AutoOpenApp(bool auto)
        {
            EventBus.AutoOpenApp_Api.Call(auto);
        }

        public void SubWs(bool sub)
        {
            EventBus.SubWs_Api.Call( sub);
        }
        #endregion

        public class AppsList
        {
            public string path;

            public Newtonsoft.Json.Linq.JObject config;
        }

        public class MainCallBackParams
        {
            public int type;

            public string path;

            public string appChangeConfig;

            public string appAllConfig;
        }
    }
}
