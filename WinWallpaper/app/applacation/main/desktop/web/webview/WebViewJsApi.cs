using System.Runtime.InteropServices;
using WinWallpaper.app.common;


namespace WinWallpaper.app.applacation.main.desktop.web.webview
{
    [ClassInterface(ClassInterfaceType.AutoDual)]
    [ComVisible(true)]
    public class WebViewJsApi
    {
        private Path Path { get; set; }

        public WebViewJsApi()
        {
            Path = new Path();
        }
        /// <summary>
        /// 获取音乐和其下级目录
        /// </summary>
        /// <param name="dir"></param>
        /// <returns></returns>
        public string GetMusilList(string dir)
        {
            var data = Path.GetMusicFile(dir);
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            return result;
        }

        /// <summary>
        /// 获取下级目录
        /// </summary>
        /// <param name="dir"></param>
        /// <returns></returns>
        public string GetDir(string dir)
        {
            var data = Path.GetDirAndName(dir);
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            return result;
        }

    }
}
