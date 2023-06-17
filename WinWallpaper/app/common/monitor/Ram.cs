using System.Runtime.InteropServices;

namespace WinWallpaper.app.common.monitor
{
    public class Ram
    {

        public struct MEMORYSTATUS
        {
            public uint dwLength;
            public uint dwMemoryLoad;
            public ulong dwTotalPhys;
            public ulong dwAvailPhys;
            public ulong dwTotalPageFile;
            public ulong dwAvailPageFile;
            public ulong dwTotalVirtual;
            public ulong dwAvailVirtual;
            public ulong dwAvailExtendedVirtual;
        }

        public int curValue { get; private set; }
        public int oldValue { get; private set; }

        private MEMORYSTATUS mStatus;

        [DllImport("kernel32.dll")]
        public static extern void GlobalMemoryStatus(ref MEMORYSTATUS stat);

        public Ram()
        {
            GlobalMemoryStatus(ref mStatus);
            curValue = (int)mStatus.dwMemoryLoad;
        }

        public void refresh()
        {
            oldValue = curValue;
            GlobalMemoryStatus(ref mStatus);
            curValue = (int)mStatus.dwMemoryLoad;
        }
    }
}
