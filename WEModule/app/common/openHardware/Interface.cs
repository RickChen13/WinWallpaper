using System.Collections.Generic;

namespace WEModule.app.common.openHardware
{
    public class InterfaceCpuUsed
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class InterfaceCpuPower
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class InterfaceCpuTemperature
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class InterfaceGpuUsed
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class InterfaceMemoryUsed
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class InterfaceHddUse
    {
        public string Name { get; set; }
        public string Value { get; set; }
    }

    public class OpenHardwareData
    {
        public List<InterfaceCpuUsed> CpuUsed { get; set; }
        public List<InterfaceCpuPower> CpuPower { get; set; }
        public List<InterfaceCpuTemperature> CpuTemperature { get; set; }

        public List<InterfaceGpuUsed> GpuUsed { get; set; }

        public List<InterfaceMemoryUsed> MemoryUsed { get; set; }

        public List<InterfaceHddUse> HddUsed { get; set; }
    }
}
