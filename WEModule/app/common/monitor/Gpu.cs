using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Management;

namespace WEModule.app.common.monitor
{
    public class Gpu
    {
        public List<GpuInfo> gpuInfo { get; private set; }
        public Gpu()
        {
            gpuInfo = new List<GpuInfo>();
            Refresh();
        }

        public void Refresh()
        {
            List<GpuInfo> _gpuInfo = new List<GpuInfo>();
            using (var searcher = new ManagementObjectSearcher("select * from Win32_VideoController"))
            {
                foreach (ManagementObject obj in searcher.Get())
                {
                    string name = "";
                    float use = 0;
                    try
                    {
                        var currentNumberOfRows = (uint)obj["CurrentNumberOfRows"];
                        var gpuCounters = GetGPUCounters(currentNumberOfRows);
                        use = GetGPUUsage(gpuCounters);
                        name = obj["Name"].ToString();
                    }
                    catch { }
                    _gpuInfo.Add(new GpuInfo()
                    {
                        name = name,
                        use = use
                    });
                }
            }
            gpuInfo = _gpuInfo;
        }

        public static List<PerformanceCounter> GetGPUCounters(uint currentNumberOfRows)
        {
            var category = new PerformanceCounterCategory("GPU Engine");
            var counterNames = category.GetInstanceNames();
            var gpuCounters = counterNames
                                .Where(counterName => counterName.EndsWith("engtype_3D"))
                                .Where(counterName =>
                                {
                                    //第几个Gpu（maby，未经验证）
                                    return counterName.ToString().ToLower().Contains("_" + currentNumberOfRows + "_".ToLower());
                                })
                                .SelectMany((counterName) =>
                                {
                                    return category.GetCounters(counterName);
                                })
                                .Where(counter => counter.CounterName.Equals("Utilization Percentage"))
                                .ToList();
            return gpuCounters;
        }

        public static float GetGPUUsage(List<PerformanceCounter> gpuCounters)
        {
            gpuCounters.ForEach(x => x.NextValue());
            var result = gpuCounters.Sum(x => x.NextValue());
            return result;
        }
    }

    public class GpuInfo
    {
        public string name;

        public float use;
    }
}
