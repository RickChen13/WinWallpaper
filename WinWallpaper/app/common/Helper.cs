using Microsoft.Win32;
using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace WinWallpaper.app.common
{
    public class Helper
    {
        const string registryStartupLocation = @"Software\Microsoft\Windows\CurrentVersion\Run";
        static string s_appPath;

        public static void OpenLink(string link)
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = link,
                UseShellExecute = true
            });
        }

        public static string GetPathForAppFolder(string subPath)
        {
            if (s_appPath == null)
            {
                s_appPath = System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), Constant.ProjectName);
                if (!Directory.Exists(s_appPath))
                {
                    Directory.CreateDirectory(s_appPath);
                }
            }

            if (string.IsNullOrEmpty(subPath))
            {
                return s_appPath;
            }
            return System.IO.Path.Combine(s_appPath, subPath);
        }

        public static string ExtPath()
        {
            return GetPathForAppFolder("Ext");
        }

        public static bool CheckStartOnBoot()
        {
            RegistryKey startupKey = Registry.CurrentUser.OpenSubKey(registryStartupLocation);
            bool startOnBoot = startupKey.GetValue(Constant.ProjectName) != null;
            startupKey.Close();
            return startOnBoot;
        }

        public static void SetStartOnBoot()
        {
            RegistryKey startupKey = Registry.CurrentUser.OpenSubKey(registryStartupLocation, true);
            startupKey.SetValue(Constant.ProjectName, $"{Application.ExecutablePath} {Constant.Cmd}");
            startupKey.Close();
        }

        public static void RemoveStartOnBoot()
        {
            RegistryKey startupKey = Registry.CurrentUser.OpenSubKey(registryStartupLocation, true);
            startupKey.DeleteValue(Constant.ProjectName);
            startupKey.Close();
        }

        public static string ExecuteCmd(string strInput)
        {
            Process p = new Process();
            //设置要启动的应用程序
            p.StartInfo.FileName = "cmd.exe";
            //是否使用操作系统shell启动
            p.StartInfo.UseShellExecute = false;
            // 接受来自调用程序的输入信息
            p.StartInfo.RedirectStandardInput = true;
            //输出信息
            p.StartInfo.RedirectStandardOutput = true;
            // 输出错误
            p.StartInfo.RedirectStandardError = true;
            //不显示程序窗口
            p.StartInfo.CreateNoWindow = true;
            //启动程序
            p.Start();
            //向cmd窗口发送输入信息
            p.StandardInput.WriteLine(strInput + "&exit");
            p.StandardInput.AutoFlush = true;
            //获取输出信息
            string strOuput = p.StandardOutput.ReadToEnd();
            //等待程序执行完退出进程
            p.WaitForExit();
            p.Close();
            return strOuput;
        }
    }
}
