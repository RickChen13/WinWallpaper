using WEModule.app.common.networkSpeed;
using WEModule.app.common.openHardware;

namespace WEModule.app.common.@event
{
    public static class EventBus
    {
        public static Mitt<string> NavigationCompleted = new Mitt<string>();
        public static Mitt<string> OpenApp = new Mitt<string>();
        public static Mitt<string> AppConfigChange = new Mitt<string>();
        public static Mitt<string> AppExit = new Mitt<string>();
        public static Mitt<double[]> Audio = new Mitt<double[]>();
        public static Mitt<NetWorkSpeedData> NetWorkSpeed = new Mitt<NetWorkSpeedData>();
        public static Mitt<OpenHardwareData> OpenHardware = new Mitt<OpenHardwareData>();
        public static Mitt<int> MusicPositionTime = new Mitt<int>();
        public static Mitt<string> MusicDone = new Mitt<string>();
        public static Mitt<bool> AppAutoPlay = new Mitt<bool>();
    }
}
