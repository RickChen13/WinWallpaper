using Fleck;
using System;
using System.Collections.Generic;
using WEModule.app.common;
using WEModule.app.common.@event;
using WEModule.app.common.networkSpeed;
using WEModule.app.common.openHardware;
using WEModule.app.modules.musicPlayer;


namespace WEModule.app.modules.websocket.server
{
    public class Ws
    {
        private List<UserClient> UserClient { get; set; }
        private WebSocketServer Server { get; set; }
        private MusciPlayer MusciPlayer { get; set; }
        private string Localtion { get; set; }
        private bool Sub { get; set; } = false;
        private Path Path { get; set; }
        public Ws(string localtion)
        {
            Localtion = localtion;
            UserClient = new List<UserClient>();
            MusciPlayer = new MusciPlayer();
            Path = new Path();
            WebSocketStart();
        }

        private void WebSocketStart()
        {
            Server = new WebSocketServer(Localtion);
            Server.Start(socket =>
            {
                socket.OnOpen = () =>
                {
                    UserClient.Add(new UserClient { connection = socket });
                    var msg = new Msg()
                    {
                        type = "ws-sub",
                        data = ""
                    };
                    socket.Send(Newtonsoft.Json.JsonConvert.SerializeObject(msg));
                };
                socket.OnClose = () =>
                {
                    var index = -1;
                    for (int i = 0; i < UserClient.Count; i++)
                    {
                        if (UserClient[i].connection == socket)
                        {
                            index = i;
                            break;
                        }
                    }
                    if (index > -1)
                    {
                        UserClient.Remove(UserClient[index]);
                    }
                };
                socket.OnMessage = message =>
                {
                    if (Sub)
                    {
                        Msg sendMsg;
                        try
                        {
                            Msg msg = Newtonsoft.Json.JsonConvert.DeserializeObject<Msg>(message);
                            sendMsg = OnMsg(msg);
                        }
                        catch (Exception e)
                        {
                            sendMsg = new Msg
                            {
                                type = "error",
                                data = "onmessage error. devMsg: " + e.Message
                            };
                        }
                        SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(sendMsg));
                    }
                };
            });
        }

        private Msg OnMsg(Msg msg)
        {
            string type;
            string data = "";
            switch (msg.type)
            {
                case "music-list":
                    type = msg.type;
                    MusicListData MusicListData = new MusicListData
                    {
                        dir = GetDir(msg.data),
                        music = GetMusilList(msg.data)
                    };
                    data = Newtonsoft.Json.JsonConvert.SerializeObject(MusicListData);
                    break;
                case "music-init":
                    type = msg.type;
                    MusciPlayer.Init(msg.data);
                    MusicPlayData MusicInitData = new MusicPlayData
                    {
                        name = MusciPlayer.MusicName,
                        MusicPositionTime = MusciPlayer.GetMusicPositionTime(),
                        MusicTotalTime = MusciPlayer.MusicTotalTime
                    };
                    data = Newtonsoft.Json.JsonConvert.SerializeObject(MusicInitData);
                    break;
                case "music-play":
                    type = msg.type;
                    MusicPlayData MusicPlayData = new MusicPlayData
                    {
                        name = MusciPlayer.MusicName,
                        MusicPositionTime = MusciPlayer.GetMusicPositionTime(),
                        MusicTotalTime = MusciPlayer.MusicTotalTime
                    };
                    data = Newtonsoft.Json.JsonConvert.SerializeObject(MusicPlayData);
                    MusciPlayer.Play();
                    break;
                case "music-stop":
                    type = msg.type;
                    MusciPlayer.Stop();
                    break;
                case "music-pause":
                    type = msg.type;
                    MusciPlayer.Pause();
                    break;
                default:
                    type = "error";
                    data = "not fount type:" + msg.type;
                    break;
            }
            return new Msg()
            {
                type = type,
                data = data
            };
        }

        #region EventBus
        public void SubEvent()
        {
            Sub = true;
            EventBus.NetWorkSpeed.Add(NetWorkSpeed);
            EventBus.OpenHardware.Add(OpenHardware);
            EventBus.Audio.Add(Audio);
            EventBus.MusicPositionTime.Add(MusicPositionTime);
            EventBus.MusicDone.Add(MusicDone);
            var msg = new Msg()
            {
                type = "ws-sub",
                data = ""
            };
            SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(msg));
        }

        public void UnSubEvent()
        {
            Sub = false;
            MusciPlayer.Stop();
            EventBus.NetWorkSpeed.Cut(NetWorkSpeed);
            EventBus.OpenHardware.Cut(OpenHardware);
            EventBus.Audio.Cut(Audio);
            EventBus.MusicPositionTime.Cut(MusicPositionTime);
            EventBus.MusicPositionTime.Cut(MusicPositionTime);
            SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(new Msg()
            {
                type = "ws-unsub",
                data = ""
            }));
        }

        private void NetWorkSpeed(NetWorkSpeedData data)
        {
            string msg = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(new Msg()
            {
                type = "netWork",
                data = msg
            }));
        }

        private void Audio(double[] data)
        {
            string msg = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(new Msg()
            {
                type = "audio",
                data = msg
            }));
        }

        private void OpenHardware(OpenHardwareData data)
        {
            string msg = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(new Msg()
            {
                type = "openHardware",
                data = msg
            }));
        }

        private void MusicPositionTime(int time)
        {
            MusicPlayData MusicInitData = new MusicPlayData
            {
                name = MusciPlayer.MusicName,
                MusicPositionTime = MusciPlayer.GetMusicPositionTime(),
                MusicTotalTime = MusciPlayer.MusicTotalTime
            };
            var data = Newtonsoft.Json.JsonConvert.SerializeObject(MusicInitData);
            SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(new Msg()
            {
                type = "MusicPositionTime",
                data = data
            }));
        }

        private void MusicDone(string str)
        {
            SendAll(Newtonsoft.Json.JsonConvert.SerializeObject(new Msg()
            {
                type = "MusicDone",
                data = ""
            }));
        }

        #endregion

        private void SendAll(string msg)
        {
            foreach (var client in UserClient)
            {
                client.connection.Send(msg);
            }
        }

        /// <summary>
        /// 根据路径获取目录
        /// </summary>
        /// <param name="dir"></param>
        /// <returns></returns>
        private string GetDir(string dir)
        {
            var data = Path.GetDirAndName(dir);
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            return result;
        }

        /// <summary>
        /// 根据路径获取音乐列表
        /// </summary>
        /// <param name="dir"></param>
        /// <returns></returns>
        private string GetMusilList(string dir)
        {
            var data = Path.GetMusicFile(dir);
            var result = Newtonsoft.Json.JsonConvert.SerializeObject(data);
            return result;
        }
    }
}
