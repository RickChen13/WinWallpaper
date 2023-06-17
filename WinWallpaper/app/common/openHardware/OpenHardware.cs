using OpenHardwareMonitor.Hardware;
using System.Collections.Generic;

namespace WinWallpaper.app.common.openHardware
{
    public class OpenHardware
    {
        private readonly Computer computer;

        public OpenHardware()
        {
            computer = new Computer();
            computer.Open();
            computer.CPUEnabled = true;
            computer.GPUEnabled = true;
            computer.RAMEnabled = true;
            computer.HDDEnabled = true;
            computer.MainboardEnabled = true;
        }

        public string GetMonitor()
        {
            var info = GetSystemInfo(computer);
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(info);
            return result;
        }

        public OpenHardwareData GetData()
        {
            return GetSystemInfo(computer);
        }

        private OpenHardwareData GetSystemInfo(Computer computer)
        {
            var updateVisitor = new UpdateVisitor();
            computer.Accept(updateVisitor);

            var cpuUsed = new List<InterfaceCpuUsed>();
            var cpuPower = new List<InterfaceCpuPower>();
            var cpuTemperature = new List<InterfaceCpuTemperature>();
            var gpuUsed = new List<InterfaceGpuUsed>();
            var memoryUsed = new List<InterfaceMemoryUsed>();
            var hddUsed = new List<InterfaceHddUse>();

            for (int i = 0; i < computer.Hardware.Length; i++)
            {
                //cpu
                if (computer.Hardware[i].HardwareType.ToString() == "CPU")
                {
                    for (int j = 0; j < computer.Hardware[i].Sensors.Length; j++)
                    {
                        if (computer.Hardware[i].Sensors[j].Name.ToString() == "CPU Total" && computer.Hardware[i].Sensors[j].SensorType.ToString() == "Load")
                        {
                            cpuUsed.Add(new InterfaceCpuUsed() { Name = computer.Hardware[i].Name.ToString(), Value = computer.Hardware[i].Sensors[j].Value.ToString() });
                        }
                        if (computer.Hardware[i].Sensors[j].Name.ToString() == "CPU Package" && computer.Hardware[i].Sensors[j].SensorType.ToString() == "Power")
                        {
                            cpuPower.Add(new InterfaceCpuPower() { Name = computer.Hardware[i].Name.ToString(), Value = computer.Hardware[i].Sensors[j].Value.ToString() });
                        }
                        if (computer.Hardware[i].Sensors[j].Name.ToString() == "CPU Package" && computer.Hardware[i].Sensors[j].SensorType.ToString() == "Temperature")
                        {
                            cpuTemperature.Add(new InterfaceCpuTemperature() { Name = computer.Hardware[i].Name.ToString(), Value = computer.Hardware[i].Sensors[j].Value.ToString() });
                        }
                    }
                }

                //显卡
                if (computer.Hardware[i].HardwareType.ToString() == "GpuAti" || computer.Hardware[i].HardwareType.ToString() == "GpuNvidia")
                {
                    for (int j = 0; j < computer.Hardware[i].Sensors.Length; j++)
                    {
                        if (computer.Hardware[i].Sensors[j].Name.ToString() == "GPU Core" && computer.Hardware[i].Sensors[j].SensorType.ToString() == "Load")
                        {
                            gpuUsed.Add(new InterfaceGpuUsed() { Name = computer.Hardware[i].Name.ToString(), Value = computer.Hardware[i].Sensors[j].Value.ToString() });
                        }
                    }

                }

                //内存
                if (computer.Hardware[i].HardwareType.ToString() == "RAM")
                {
                    for (int j = 0; j < computer.Hardware[i].Sensors.Length; j++)
                    {
                        if (computer.Hardware[i].Sensors[j].Name.ToString() == "Memory" && computer.Hardware[i].Sensors[j].SensorType.ToString() == "Load")
                        {
                            memoryUsed.Add(new InterfaceMemoryUsed() { Name = computer.Hardware[i].Name.ToString(), Value = computer.Hardware[i].Sensors[j].Value.ToString() });
                        }
                    }
                }

                // 硬盘
                if (computer.Hardware[i].HardwareType.ToString() == "HDD")
                {
                    for (int j = 0; j < computer.Hardware[i].Sensors.Length; j++)
                    {
                        if (computer.Hardware[i].Sensors[j].Name.ToString() == "Used Space" && computer.Hardware[i].Sensors[j].SensorType.ToString() == "Load")
                        {
                            hddUsed.Add(new InterfaceHddUse() { Name = computer.Hardware[i].Name.ToString(), Value = computer.Hardware[i].Sensors[j].Value.ToString() });
                        }
                    }
                }
            }

            var result = new OpenHardwareData() { CpuUsed = cpuUsed, CpuPower = cpuPower, CpuTemperature = cpuTemperature, GpuUsed = gpuUsed, MemoryUsed = memoryUsed, HddUsed = hddUsed };
            return result;
        }
    }
}
