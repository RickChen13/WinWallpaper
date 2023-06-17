using NAudio.Utils;
using NAudio.Wave;
using System;
using System.Threading;
using System.Threading.Tasks;
using WEModule.app.common.@event;
using WEModule.app.common;

namespace WEModule.app.modules.musicPlayer
{
    public class MusciPlayer
    {
        public WaveOutEvent OutputDevice { get; private set; }
        public int MusicTotalTime { get; private set; }
        public string MusicName { get; private set; }
        private Path Path { get; set; }
        private Task MusicTask { get;  set; }
        private bool Loop { get;  set; } = false;
        public MusciPlayer()
        {
            OutputDevice = new WaveOutEvent();
            Path = new Path();
            MusicTotalTime = 0;

        }
        public void Init(string path)
        {
            MusicPositionTimeStop();
            OutputDevice.Dispose();
            var audioFile = new AudioFileReader(path);
            OutputDevice.Init(audioFile);
            MusicName = Path.GetFileName(path);
            MusicTotalTime = TimeSapn2Int(audioFile.TotalTime);
        }
        public void Play()
        {
            if (!Loop)
            {
                OutputDevice.Play();
                MusicPositionTimeStart();
            }
        }
        public void Pause()
        {
            OutputDevice.Pause();
            MusicPositionTimeStop();
        }
        public void Stop()
        {
            OutputDevice.Stop();            
            MusicPositionTimeStop();
            OutputDevice.Dispose();
        }
        public int GetMusicPositionTime()
        {
            int time = TimeSapn2Int(OutputDevice.GetPositionTimeSpan());
            return time;
        }
        private void MusicPositionTimeStart()
        {
            Loop = true;
            MusicTask = new Task(() =>
            {
                try
                {
                    while (Loop)
                    {
                        int time = GetMusicPositionTime();
                        EventBus.MusicPositionTime.Call( time);
                        if (time == MusicTotalTime)
                        {
                            Loop = false;
                            EventBus.MusicDone.Call("");
                        }
                        Thread.Sleep(500);
                    }
                }
                catch { }
            });
            MusicTask.Start();
        }
        private void MusicPositionTimeStop()
        {
            Loop = false;
            if (MusicTask != null)
            {
                MusicTask.Wait();
                MusicTask = null;
            }
            
        }
        private int TimeSapn2Int(TimeSpan timeSpan)
        {
            DateTime dt = Convert.ToDateTime(timeSpan.ToString());
            int time = (Convert.ToInt32(dt.Hour) * 3600) + (Convert.ToInt32(dt.Minute) * 60) + Convert.ToInt32(dt.Second) + Convert.ToInt32(dt.Millisecond > 0 ? 1 : 0);
            return time;
        }
    }
}
