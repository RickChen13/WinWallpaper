using System;
using WEModule.app;

namespace WEModule
{
    internal class Program
    {
        static void Main()
        {
            new Main();
            HoldExe();
        }

        static void HoldExe()
        {
            Console.ReadLine();
            HoldExe();
        }
    }
}
