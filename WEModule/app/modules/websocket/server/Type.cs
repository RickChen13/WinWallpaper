using Fleck;

namespace WEModule.app.modules.websocket.server
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
