using Fleck;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WinWallpaper.app.modules.websocket.server
{
    public class UserClient
    {
        public IWebSocketConnection connection;
    }

    public class Msg
    {
        public string type;
        public string data;
    }

    public class MusicListData
    {
        public string dir;

        public string music;
    }

    public class MusicPlayData 
    {
        public string name;
        public int MusicPositionTime;
        public int MusicTotalTime;
    }
}
