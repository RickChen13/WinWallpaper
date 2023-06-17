using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using WinWallpaper.app.common;
using WinWallpaper.app.common.@event;
using WinWallpaper.app.common.networkSpeed;
using WinWallpaper.app.common.openHardware;
namespace WinWallpaper.app
{
    public class Main
    {
        public Audio Audio { get; set; }
        public NetWorkSpeed NetWorkSpeed { get; set; }
        public OpenHardware OpenHardware { get; set; }
        public bool AppExit { get; set; }

        public Main()
        {
            AppExit = false;
            Task task = new Task(() =>
            {
                Audio = new Audio();
                NetWorkSpeed = new NetWorkSpeed();
                OpenHardware = new OpenHardware();
                Monitor();
            });
            task.Start();
            EventBus.AppExit.Add( App_Exit);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new applacation.main.Main());
        }

        private void App_Exit(string str)
        {
            AppExit = true;
            Audio.StopListener();
            Application.Exit();
        }
        public void Monitor()
        {
            Audio.StartListener();
            int count = 24;
            Task task = new Task(() =>
            {
                while (!AppExit)
                {
                    count++;
                    EventBus.Audio.Call( Audio.GetData());
                    if (count >= 25)
                    {
                        EventBus.NetWorkSpeed.Call(NetWorkSpeed.GetData());
                        EventBus.OpenHardware.Call(OpenHardware.GetData());
                        count = 0;
                    }
                    Thread.Sleep(1000 / 30);
                }
            });
            task.Start();
        }
    }
}
