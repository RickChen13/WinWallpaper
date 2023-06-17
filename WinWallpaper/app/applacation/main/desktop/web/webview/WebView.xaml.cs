using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json.Linq;
using System;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Markup;
using WinWallpaper.app.applacation.main.desktop.web.webview;
using WinWallpaper.app.common;
using WinWallpaper.app.common.@event;
using WinWallpaper.app.common.networkSpeed;
using WinWallpaper.app.common.openHardware;

namespace WinWallpaper.app.desktop.web.webview
{
    /// <summary>
    /// WebView.xaml 的交互逻辑
    /// </summary>
    public partial class WebView : Window
    {
        public Uri Source
        {
            get => DesktopWv.Source;
            set => DesktopWv.Source = value;
        }

        public WebViewJsApi DesktopJsApi { get; set; }

        public WebView()
        {
            InitializeComponent();
            DesktopJsApi = new WebViewJsApi();
            InitializeCoreWebView2Environment();
            DesktopWv.NavigationCompleted += DesktopWv_NavigationCompleted;
        }

        #region 初始化相关

        async void InitializeCoreWebView2Environment()
        {
            string args = "--autoplay-policy=no-user-gesture-required --disable-web-securit";
            CoreWebView2Environment coreWebView2Environment = await CoreWebView2Environment.CreateAsync(null, AppContext.BaseDirectory + @"\\runtimes", new CoreWebView2EnvironmentOptions(args));
            await DesktopWv.EnsureCoreWebView2Async(coreWebView2Environment);
            //禁止所有菜单
            DesktopWv.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
            LoadScript();
        }

        void LoadScript()
        {
            DesktopWv?.CoreWebView2.AddHostObjectToScript("DesktopJsApi", DesktopJsApi);
            DesktopWv?.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync("var DesktopJsApi= window.chrome.webview.hostObjects.DesktopJsApi;");
            DesktopWv?.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(@"window.WallpaperAudio = (data)=>{};");
            SetEventBus();
        }
        private void DesktopWv_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            EventBus.NavigationCompleted.Call( "");
        }

        #endregion

        protected override void OnClosed(EventArgs e)
        {
            DesktopWv.Dispose();
            DesktopWv = null;
            base.OnClosed(e);
        }

        #region EventBus相关

        /// <summary>
        /// 订阅事件
        /// </summary>
        private void SetEventBus()
        {
            EventBus.AppConfigChange.Add(ApplyUserProperties);
            EventBus.Audio.Add( Audio);
            EventBus.NetWorkSpeed.Add( NetWorkSpeed);
            EventBus.OpenHardware.Add(OpenHardware);
        }

        private void ExecuteScriptAsync(string jsCode)
        {
            DesktopWv?.Dispatcher.Invoke(() =>
            {
                DesktopWv?.CoreWebView2.ExecuteScriptAsync(jsCode);
            });
        }
        private void ApplyUserProperties(string data)
        {
            string jsCode = "window.ApplyUserProperties(" + data + ")";
            ExecuteScriptAsync(jsCode);
        }

        private void Audio(double[] data)
        {
            string msg = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            string jsCode = "window.WallpaperAudio(" + msg + ")";
            ExecuteScriptAsync(jsCode);
        }

        private void NetWorkSpeed(NetWorkSpeedData data)
        {
            string msg = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            string jsCode = "window.WallpaperNetWorkSpeed(" + msg + ")";
            ExecuteScriptAsync(jsCode);

        }

        private void OpenHardware(OpenHardwareData data)
        {
            string msg = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            string jsCode = "window.WallpaperOpenHardware(" + msg + ")";
            ExecuteScriptAsync(jsCode);
        }


        #endregion

        public IntPtr GetChromeWidgetWin1Handle()
        {
            IntPtr chrome_WidgetWin_0 = PInvoke.FindWindowEx(DesktopWv.Handle, IntPtr.Zero, "Chrome_WidgetWin_0", null);
            if (chrome_WidgetWin_0 == IntPtr.Zero)
                return IntPtr.Zero;
            return PInvoke.FindWindowEx(chrome_WidgetWin_0, IntPtr.Zero, "Chrome_WidgetWin_1", null);
        }

        /// <summary>
        /// 打开网页
        /// </summary>
        /// <param name="uri"></param>
        public void Open(Uri uri)
        {
            Source = uri;
        }

    }
}
