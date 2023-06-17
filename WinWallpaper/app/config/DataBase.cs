using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WinWallpaper.app.config
{
    public static class DataBase
    {

        public static string DbName { get; } = "itcastCater.db";

        public static string Password { get; } = "123456..";

        public static string DbPath { get; } = AppContext.BaseDirectory + @"\\runtimes\\" + DbName;

        public static string InitDbConnectionString { get; } = "data source=" + DbPath + ";version=3;";

        public static string DbConnectionString { get; } = InitDbConnectionString + "Password=" + Password;


    }

}