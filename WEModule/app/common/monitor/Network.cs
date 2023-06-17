using System.Diagnostics;
using System.Net.NetworkInformation;

namespace WEModule.app.common.monitor
{
    public class Network
    {
        public NetworkInterface NetworkInterface { get; private set; } = null;
        public string Name { get; private set; }
        public long DownSpeed { get; private set; }
        public long UpSpeed { get; private set; }
        public bool IsDownSpeedChange { get; private set; }
        public bool IsUpSpeedChange { get; private set; }
        public bool IsConnect { get; private set; }

        private readonly PerformanceCounter downCounter;
        private readonly PerformanceCounter upCounter;
        private long downValue, upValue;
        private long downValueOld, upValueOld;
        private long downSpeedOld, upSpeedOld;


        public Network(string name)
        {
            this.Name = name;
            GetNetworkInterface();
            downCounter = new PerformanceCounter("Network Interface", "Bytes Received/sec", name);
            upCounter = new PerformanceCounter("Network Interface", "Bytes Sent/sec", name);
            if (downCounter == null || upCounter == null)
                return;
            downValueOld = downCounter.NextSample().RawValue;
            upValueOld = upCounter.NextSample().RawValue;
            if (downSpeedOld > 0 || upValueOld > 0) IsConnect = true;
            else IsConnect = false;
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
                if (adapter.Description == Name)
                {
                    NetworkInterface = adapter;
                }
            }
        }

        public void Refresh()
        {
            if (downCounter == null || upCounter == null)
            {
                DownSpeed = 0;
                UpSpeed = 0;
                return;
            }
            if (downCounter.NextSample() == null || upCounter.NextSample() == null)
            {
                DownSpeed = 0;
                UpSpeed = 0;
                return;
            }

            downValue = downCounter.NextSample().RawValue;
            upValue = upCounter.NextSample().RawValue;

            DownSpeed = downValue - downValueOld;
            UpSpeed = upValue - upValueOld;

            IsDownSpeedChange = DownSpeed != downValue;
            IsUpSpeedChange = UpSpeed != upSpeedOld;
            downSpeedOld = DownSpeed;
            upSpeedOld = UpSpeed;
            downValueOld = downValue;
            upValueOld = upValue;
        }

        public string GetFormatDownSpeed()
        {
            return Format(DownSpeed);
        }

        public string GetFormatUpSpeed()
        {
            return Format(UpSpeed);
        }

        private string Format(long num)
        {
            double n = num / 1024.0;
            if (n >= 1000.0) return (n / 1024).ToString("0.00") + "MB/s";
            else if (n >= 100.0) return n.ToString("0.0") + "KB/s";
            else return n.ToString("0.00") + "KB/s";
        }
    }
}
