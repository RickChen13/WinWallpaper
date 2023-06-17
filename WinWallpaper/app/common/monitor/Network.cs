using System.Diagnostics;
using System.Net.NetworkInformation;

namespace WinWallpaper.app.common.monitor
{
    public class Network
    {
        public NetworkInterface networkInterface { get; private set; } = null;
        public string name { get; private set; }
        public long downSpeed { get; private set; }
        public long upSpeed { get; private set; }
        public bool isDownSpeedChange { get; private set; }
        public bool isUpSpeedChange { get; private set; }
        public bool isConnect { get; private set; }

        private PerformanceCounter downCounter, upCounter;
        private long downValue, upValue;
        private long downValueOld, upValueOld;
        private long downSpeedOld, upSpeedOld;


        public Network(string name)
        {
            this.name = name;
            GetNetworkInterface();
            downCounter = new PerformanceCounter("Network Interface", "Bytes Received/sec", name);
            upCounter = new PerformanceCounter("Network Interface", "Bytes Sent/sec", name);
            if (downCounter == null || upCounter == null)
                return;
            downValueOld = downCounter.NextSample().RawValue;
            upValueOld = upCounter.NextSample().RawValue;
            if (downSpeedOld > 0 || upValueOld > 0) isConnect = true;
            else isConnect = false;
        }


        /// <summary>
        /// 获取本地计算机上网络接口的对象
        /// </summary>
        /// <returns></returns>
        public void GetNetworkInterface()
        {
            NetworkInterface[] adapters = NetworkInterface.GetAllNetworkInterfaces();
            foreach (NetworkInterface adapter in adapters)
            {
                if (adapter.Description == name)
                {
                    networkInterface = adapter;
                }
            }
        }

        public void refresh()
        {
            if (downCounter == null || upCounter == null)
            {
                downSpeed = 0;
                upSpeed = 0;
                return;
            }
            if (downCounter.NextSample() == null || upCounter.NextSample() == null)
            {
                downSpeed = 0;
                upSpeed = 0;
                return;
            }

            downValue = downCounter.NextSample().RawValue;
            upValue = upCounter.NextSample().RawValue;

            downSpeed = downValue - downValueOld;
            upSpeed = upValue - upValueOld;

            isDownSpeedChange = downSpeed != downValue;
            isUpSpeedChange = upSpeed != upSpeedOld;
            downSpeedOld = downSpeed;
            upSpeedOld = upSpeed;
            downValueOld = downValue;
            upValueOld = upValue;
        }

        public string getFormatDownSpeed()
        {
            return format(downSpeed);
        }

        public string getFormatUpSpeed()
        {
            return format(upSpeed);
        }

        private string format(long num)
        {
            double n = num / 1024.0;
            if (n >= 1000.0) return (n / 1024).ToString("0.00") + "MB/s";
            else if (n >= 100.0) return n.ToString("0.0") + "KB/s";
            else return n.ToString("0.00") + "KB/s";
        }
    }
}
