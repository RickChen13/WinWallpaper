using System.Threading;
using System.Threading.Tasks;
using WEModule.app.common.@event;
using WEModule.app.common.networkSpeed;
using WEModule.app.common.openHardware;
using WEModule.app.modules.websocket.server;


namespace WEModule.app
{
    public class Main
    {
        public NetWorkSpeed NetWorkSpeed { get; set; }
        public OpenHardware OpenHardware { get; set; }
        public bool AppExit { get; set; }
        private Ws Ws { get; set; }
        public Main()
        {
            AppExit = false;
            Task task = new Task(() =>
            {
                NetWorkSpeed = new NetWorkSpeed();
                OpenHardware = new OpenHardware();
                Monitor();
            });
            task.Start();
            Ws = new Ws("ws://0.0.0.0:9999");
            Ws.SubEvent();
            EventBus.AppExit.Add(App_Exit);
        }

        private void App_Exit(string res)
        {
            Ws.UnSubEvent();
            AppExit = true;
        }

        public void Monitor()
        {
            Task task = new Task(() =>
            {
                while (!AppExit)
                {
                    EventBus.NetWorkSpeed.Call(NetWorkSpeed.GetData());
                    EventBus.OpenHardware.Call(OpenHardware.GetData());
                    Thread.Sleep(900);
                }
            });
            task.Start();
        }
    }
}
