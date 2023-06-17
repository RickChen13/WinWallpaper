using System.Diagnostics;
using System.Linq;
using System.Management;

namespace WinWallpaper.app.common.monitor
{
    public class Cpu
    {

        public int CurValue { get; private set; }
        public int OldValue { get; private set; }

        public string CpuName { get; private set; } = "";

        private readonly PerformanceCounter counter;

        public Cpu()
        {
            counter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
            SetCpuName();
            CurValue = (int)counter.NextValue();
        }

        public void Refresh()
        {
            OldValue = CurValue;
            CurValue = (int)counter.NextValue();
        }

        public void SetCpuName()
        {
            ManagementObjectSearcher mos = new ManagementObjectSearcher("Select * from Win32_Processor");//Win32_Processor  CPU处理器
            foreach (ManagementObject mo in mos.Get().Cast<ManagementObject>())
            {
                CpuName = mo["Name"].ToString();
            }
            mos.Dispose();
        }
    }
}
