using System.Runtime.InteropServices;

namespace WEModule.app.common.monitor
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

        public int CurValue { get; private set; }
        public int OldValue { get; private set; }

        private MEMORYSTATUS mStatus;

        [DllImport("kernel32.dll")]
        public static extern void GlobalMemoryStatus(ref MEMORYSTATUS stat);

        public Ram()
        {
            GlobalMemoryStatus(ref mStatus);
            CurValue = (int)mStatus.dwMemoryLoad;
        }

        public void Refresh()
        {
            OldValue = CurValue;
            GlobalMemoryStatus(ref mStatus);
            CurValue = (int)mStatus.dwMemoryLoad;
        }
    }
}
