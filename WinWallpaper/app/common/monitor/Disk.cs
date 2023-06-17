using System.Diagnostics;

namespace WinWallpaper.app.common.monitor
{
    public class Disk
    {
        public int curValue { get; private set; }
        public int oldValue { get; private set; }

        private PerformanceCounter counter;

        public Disk()
        {
            counter = new PerformanceCounter("PhysicalDisk", "% Disk Time", "_Total");
            int num = (int)counter.NextValue();
            curValue = num > 100 ? 100 : num;
        }

        public void refresh()
        {
            oldValue = curValue;
            int num = (int)counter.NextValue();
            curValue = num > 100 ? 100 : num;
        }
    }
}
