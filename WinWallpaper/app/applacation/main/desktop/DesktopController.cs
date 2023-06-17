using Newtonsoft.Json.Linq;
using System;
using WinWallpaper.app.common;
using WinWallpaper.app.desktop.web;

namespace WinWallpaper.app.desktop
{

    public class DesktopController
    {
        private WebController WebController { get; set; }

        public DesktopController()
        {

        }

        #region WebView Setting

        public void OpenWeb(string path)
        {
            if (WebController == null)
            {
                WebController = new WebController();
            }
            WebController.OpenWeb(path);
        }

        public void CloseWv()
        {
            WebController?.CloseWv();
        }

        public void WebForwardMessage()
        {
            WebController.ForwardMessage();
        }

        #endregion
    }
}
