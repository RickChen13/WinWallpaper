using System.Collections.Generic;
using System.Diagnostics;
using WinWallpaper.app.common.monitor;

namespace WinWallpaper.app.common.networkSpeed
{
    public class NetWorkSpeed
    {
        public long _lastSend = 0;
        public long _lastRec = 0;

        public List<Network> networks = new List<Network>();

        public NetWorkSpeed()
        {
            PerformanceCounterCategory category = new PerformanceCounterCategory("Network Interface");
            foreach (string name in category.GetInstanceNames())
            {
                if (name == "MS TCP Loopback interface")
                    continue;
                Network n = new Network(name);
                if (n.isConnect)
                {
                    networks.Add(n);
                }
            }

        }

        public NetWorkSpeedData GetData()
        {
            NetWorkSpeedData data = new NetWorkSpeedData
            {
                networkInterfaceType = "",
                networkInterfaceName = "",
                sed = 0,
                rec = 0
            };

            foreach (Network network in networks)
            {
                network.refresh();
                data.networkInterfaceType = network.networkInterface?.Description;
                data.networkInterfaceName = network.networkInterface?.Name;
                data.sed += network.upSpeed;
                data.rec += network.downSpeed;
            }
            return data;
        }
    }
}
