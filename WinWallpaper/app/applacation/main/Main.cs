using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using System.Windows.Forms;
using WinWallpaper.app.common;
using WinWallpaper.app.common.@event;
using WinWallpaper.app.desktop;
using WinWallpaper.app.modules.websocket.server;

namespace WinWallpaper.app.applacation.main
{
    public partial class Main : Form
    {
        private jsApi.MainJsApi MainJsApi { get; set; }

        private DesktopController DesktopController { get; set; }

        private Ws Ws { get; set; }

        public Main()
        {
            InitializeComponent();
            DesktopController = new DesktopController();
            MainJsApi = new jsApi.MainJsApi();
            notifyIcon1.Icon = Icon;
            Ws = new Ws("ws://0.0.0.0:9999");
            Init();
        }

        #region 私有事件

        private void Init()
        {
            MainWv_SubEvent();
        }

        /// <summary>
        /// 退出操作
        /// </summary>
        private void Exit()
        {
            MvClose();
            Ws.UnSubEvent();
            DesktopController.CloseWv();
            EventBus.AppExit.Call("");
        }
        private void MvClose()
        {
            MainWv.Dispose();
        }

        private void TSM_WsServer_Checked(bool Checked)
        {
            TSM_WsServer.Checked = Checked;
            if (Checked)
            {
                //Ws.SubEvent();
            }
            else
            {
                //Ws.UnSubEvent();
            }
        }

        #endregion

        #region 控件事件

        const int PLAY_HOTKEY_ID = 10;
        private void Main_Load(object sender, EventArgs e)
        {
            SetDesktopControllerEvent();
            const int MOD_NOREPEAT = 0x4000;
            const int MOD_CONTROL = 0x0002;
            const int MOD_ALT = 0x0001;
            PInvoke.RegisterHotKey(this.Handle, PLAY_HOTKEY_ID, MOD_NOREPEAT | MOD_CONTROL | MOD_ALT, (int)'P');

        }

        private void MainForm_Closing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason == CloseReason.UserClosing)
            {
                e.Cancel = true;
                Hide();
                notifyIcon1.ShowBalloonTip(1000, "", "已被最小化到系统托盘。", ToolTipIcon.None);

            }

        }
        #endregion

        #region 菜单事件

        private void ContextMenuStrip1_Opening(object sender, System.ComponentModel.CancelEventArgs e)
        {

        }

        private void ContextMenuStrip1_Closing(object sender, ToolStripDropDownClosingEventArgs e)
        {

        }

        private void NotifyIcon1_MouseDoubleClick(object sender, MouseEventArgs e)
        {
            Show();
            Activate();
        }

        private void TSM_Exit_Click(object sender, EventArgs e)
        {
            Exit();
        }

        private void TSM_AutoPlay_Click(object sender, EventArgs e)
        {
            if (TSM_AutoPlay.Checked)
            {
                TSM_AutoPlay.Checked = false;
            }
            else
            {
                TSM_AutoPlay.Checked = true;
            }
            EventBus.AutoOpenApp_CallBack.Call(TSM_AutoPlay.Checked);
        }

        private void TSM_WsServer_Click(object sender, EventArgs e)
        {
            TSM_WsServer_Checked(!TSM_WsServer.Checked);
            EventBus.SubWs_CallBack.Call(TSM_WsServer.Checked);
        }

        #endregion

        #region webview2 设置
        private void MainWv_CoreWebView2InitializationCompleted(object sender, CoreWebView2InitializationCompletedEventArgs e)
        {
            MainWv.CoreWebView2.AddHostObjectToScript("MainCallBack", MainJsApi);
            MainWv.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync("var MainApi= window.chrome.webview.hostObjects.MainCallBack;");
            MainWv.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(@"window.MainCallBack = {};");
        }

        private void MainMv_ExecuteScriptAsync(string code)
        {
            Action action = () =>
            {
                MainWv?.CoreWebView2.ExecuteScriptAsync(code);
            };
            MainWv?.Invoke(action);
        }

        private void MainWv_SubEvent()
        {
            EventBus.AutoOpenApp_CallBack.Add(MainMv_AutoOpenApp_CallBack);
            EventBus.SubWs_CallBack.Add(MainWv_SubWs_CallBack);

            EventBus.AutoOpenApp_Api.Add(MainMv_AutoOpenApp_Api);
            EventBus.SubWs_Api.Add(MainWv_SubWs_Api);
        }

        private void MainMv_AutoOpenApp_CallBack(bool auto)
        {
            string code;
            if (auto)
            {
                code = (@"window.MainCallBack.AutoOpenApp(true);")
                 ;
            }
            else
            {
                code = (@"window.MainCallBack.AutoOpenApp(false);");
            }
            MainMv_ExecuteScriptAsync(code);
        }

        private void MainMv_AutoOpenApp_Api(bool auto)
        {
            Invoke(new Action(() =>
            {
                TSM_AutoPlay.Checked = auto;
            }));
        }

        private void MainWv_SubWs_CallBack(bool sub)
        {
            string code;
            if (sub)
            {
                code = (@"window.MainCallBack.SubWs(true);")
                 ;
            }
            else
            {
                code = (@"window.MainCallBack.SubWs(false);");
            }
            MainMv_ExecuteScriptAsync(code);
        }

        private void MainWv_SubWs_Api(bool sub)
        {
            Invoke(new Action(() =>
            {
                TSM_WsServer_Checked(sub);
            }));
        }
        #endregion

        #region DesktopController 设置

        private string NavigationCompletedConfig { get; set; }

        public void SetDesktopControllerEvent()
        {
            EventBus.OpenApp.Add(OpenApp);
            EventBus.NavigationCompleted.Add(NavigationCompleted);
            EventBus.AppAutoPlay.Add(AppAutoPlay);
        }

        private void AppAutoPlay(bool result)
        {
            TSM_AutoPlay.Checked = result;
        }

        public void OpenApp(string data)
        {
            JObject config = Newtonsoft.Json.JsonConvert.DeserializeObject<JObject>(data);
            if (config.TryGetValue("config", out var Config))
            {
                NavigationCompletedConfig = Config.ToString();
            }
            if (config.TryGetValue("path", out var path))
            {
                var Path = path.ToString();
                Invoke(new EventHandler(delegate
                {
                    DesktopController.OpenWeb(Path);
                    Task.Run(async () =>
                    {
                        await Task.Delay(1000);
                        Invoke((Action)DesktopController.WebForwardMessage);
                    });
                }));
            }
        }

        public void NavigationCompleted(string data)
        {
            EventBus.AppConfigChange.Call(NavigationCompletedConfig);
        }
        #endregion
    }
}
