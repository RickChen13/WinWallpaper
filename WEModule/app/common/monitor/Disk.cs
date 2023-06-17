using System.Diagnostics;

namespace WEModule.app.common.monitor
{
    public class Disk
    {
        public int CurValue { get; private set; }
        public int OldValue { get; private set; }

        private readonly PerformanceCounter counter;

        public Disk()
        {
            counter = new PerformanceCounter("PhysicalDisk", "% Disk Time", "_Total");
            int num = (int)counter.NextValue();
            CurValue = num > 100 ? 100 : num;
        }

        public void Refresh()
        {
            OldValue = CurValue;
            int num = (int)counter.NextValue();
            CurValue = num > 100 ? 100 : num;
        }
    }
}
