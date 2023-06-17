using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace WinWallpaper.app.common
{
    public class Path
    {
        private readonly string[] _musicType = new string[] { ".mp3", ".wav", ".wma", ".mp2", ".flac", ".midi", ".ra", ".ape", ".acc", ".cda", ".mov" };
        /// <summary>
        /// 获取目录下全部的文件夹和文件，0文件夹，1文件
        /// </summary>
        /// <param name="dir">路径</param>
        public Dictionary<int, string[]> GetDirInfo(string dir)
        {
            Dictionary<int, string[]> Dir = new Dictionary<int, string[]>
            {
                { 0, GetDir(dir) },
                { 1, GetDir(dir) }
            };
            return Dir;
        }


        /// <summary>
        /// 获取文件夹列表,该方法返回数组
        /// </summary>
        /// <param name="dir">路径</param>
        public string[] GetDir(string dir)
        {
            if (Directory.Exists(dir))
            {
                return Directory.GetDirectories(dir);
            }
            return new string[0];
        }

        public List<Files> GetDirAndName(string dir)
        {
            var dirs = GetDir(dir);
            var result = new List<Files>();
            for (int i = 0; i < dirs.Length; i++)
            {
                result.Add(new Files
                {
                    name = new DirectoryInfo(dirs[i]).Name,
                    path = dirs[i]
                });
            }
            return result;
        }

        /// <summary>
        /// 获取文件列表
        /// </summary>
        /// <param name="dir">路径</param>
        public string[] GetFile(string dir)
        {

            return Directory.GetFiles(dir);
        }

        /// <summary>
        /// 获取文件后缀
        /// </summary>
        /// <param name="dir">路径</param>
        public string GetExtension(string dir)
        {
            return System.IO.Path.GetExtension(dir);
        }

        /// <summary>
        /// 获取文件名
        /// </summary>
        /// <param name="dir">路径</param>
        /// <returns></returns>
        public string GetFileName(string dir)
        {
            return System.IO.Path.GetFileName(dir);
        }

        /// <summary>
        /// 获取该路径下的音乐文件
        /// </summary>
        /// <param name="dir">路径</param>
        /// <returns></returns>
        public List<MusicList> GetMusicFile(string dir)
        {
            string[] files = GetFile(dir);
            var result = new List<MusicList>();
            for (int i = 0; i < files.Length; i++)
            {
                if (IsMusic(files[i]))
                {
                    result.Add(new MusicList
                    {
                        name = GetFileName(files[i]),
                        src = files[i],
                        @class = "",
                    });
                }

            }
            return result;
        }

        /// <summary>
        /// 是否为音乐
        /// </summary>
        /// <param name="dir">路径</param>
        /// <returns></returns>
        public bool IsMusic(string dir)
        {
            string extension = GetExtension(dir).ToLower();
            return _musicType.Contains(extension); ;
        }

        /// <summary>
        /// 判断是否为文件
        /// </summary>
        /// <param name="dir">路径</param>
        /// <returns></returns>
        public bool IsFile(string dir)
        {
            bool result = false;
            if (File.Exists(dir))
            {
                result = true;
            }
            return result;
        }

        /// <summary>
        /// 判断是否为文件夹
        /// </summary>
        /// <param name="dir">路径</param>
        /// <returns></returns>
        public bool IsDir(string dir)
        {
            bool result = false;
            if (Directory.Exists(dir))
            {
                result = true;
            }
            return result;
        }

        /// <summary>
        /// 读取指定的文件（UTF-8）
        /// </summary>
        /// <param name="path">文件路径</param>
        /// <returns></returns>
        public string GetTxt(string path)
        {
            StreamReader sr = new StreamReader(path, Encoding.UTF8);
            string str = sr.ReadToEnd();
            sr.Close();
            sr.Dispose();
            return str;
        }

        public class MusicList
        {
            public string name;

            public string src;

            public string @class;
        }

        public class Files
        {
            public string name;

            public string path;
        }
    }
}
