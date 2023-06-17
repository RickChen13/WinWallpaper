using System.Collections.Generic;
using System.Diagnostics;
using WEModule.app.common.monitor;

namespace WEModule.app.common.networkSpeed
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
                if (n.IsConnect)
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
                network.Refresh();
                data.networkInterfaceType = network.NetworkInterface?.Description;
                data.networkInterfaceName = network.NetworkInterface?.Name;
                data.sed += network.UpSpeed;
                data.rec += network.DownSpeed;
            }
            return data;
        }
    }
}
