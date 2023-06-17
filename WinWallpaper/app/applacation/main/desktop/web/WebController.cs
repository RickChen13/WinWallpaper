using Microsoft.Web.WebView2.Core;
using System;
using System.Security.Policy;
using System.Windows.Forms;
using WinWallpaper.app.common;
using WinWallpaper.app.desktop.web.webview;

namespace WinWallpaper.app.desktop.web
{
    public class WebController
    {
        private WebView WebView { get; set; }

        public enum WindowType
        {
            None,
            Video,
            Web,
            Window
        }

        public System.Drawing.Rectangle Bound;
        public WebController()
        {
            Bound = Screen.PrimaryScreen.Bounds;
            SetBoundforScreen(Screen.PrimaryScreen);
        }

        /// <summary>
        /// 设置需要显示的参数
        /// </summary>
        /// <param name="screenT"></param>
        public void SetBoundforScreen(Screen screenT)
        {
            Bound.X = screenT.Bounds.X;
            Bound.Y = screenT.Bounds.Y;
            Bound.Width = screenT.Bounds.Width;
            Bound.Height = screenT.Bounds.Height;
            Screen[] allScreens = Screen.AllScreens;
            foreach (Screen screen in allScreens)
            {
                if (screenT != screen)
                {
                    if (screen.Bounds.X < 0)
                    {
                        Bound.X -= screen.Bounds.X;
                    }
                    if (screen.Bounds.Y < 0)
                    {
                        Bound.Y -= screen.Bounds.Y;
                    }
                }
            }
        }

        /// <summary>
        /// 获取webview2的版本
        /// </summary>
        /// <param name="version"></param>
        /// <returns></returns>
        public bool TryGetWebView2Version(out string version)
        {
            try
            {
                version = CoreWebView2Environment.GetAvailableBrowserVersionString();
                return true;
            }
            catch
            {
                version = null;
                return false;
            }
        }

        /// <summary>
        /// 本地打开网页
        /// </summary>
        /// <param name="path"></param>
        public void OpenFile(string path)
        {
            Uri uri = new Uri(path);
            if (uri.Scheme == "http" || uri.Scheme == "https")
            {
                OpenWeb(path);
            }
            else if (uri.Scheme == "file")
            {
                OpenWeb(uri.AbsoluteUri);
            }
        }

        /// <summary>
        /// 打开网页
        /// </summary>
        /// <param name="url"></param>
        public void OpenWeb(string url)
        {
            if (!TryGetWebView2Version(out _))
            {
                MessageBox.Show("打开网页功能需要 WebView2 支持。请在托盘图标找到 RWallpaper 然后右键菜单，依次点击 [打开 URL] > [安装 WebView2...] 安装。");
                return;
            }
            if (WebView == null)
            {
                WebView = new WebView();
                WebView.SetPosition(Bound);
                WebView.Show();
                var hWndChild = WebView.GetHandle();//hWndNewParent
                var hWndNewParent = PInvoke.DS2_GetDesktopWindowHandle();//hWndNewParent
                PInvoke.SetParent(hWndChild, hWndNewParent);
            }
            WebView.Open(new Uri(url));

        }

        public void CloseWv()
        {
            WebView.Close();
            GC.Collect();
            PInvoke.DS2_RefreshDesktop();
        }

        public void ForwardMessage()
        {
            IntPtr hWnd = WebView.GetChromeWidgetWin1Handle();
            if (hWnd != IntPtr.Zero)
                PInvoke.DS2_StartForwardMouseKeyboardMessage(hWnd);
        }
    }
}
