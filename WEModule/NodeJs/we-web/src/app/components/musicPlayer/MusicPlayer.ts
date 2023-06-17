import BaseViews from "@/fast/base/BaseView";
import EventBus, {
  MusicPlayType,
  MusicListType,
} from "@/fast/plugins/mitt/EventBus";
import { defineComponent, inject, nextTick } from "vue";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "musicPlayer",
      setup() {
        let params: any = inject("params");
        /**
         * 转换时间格式 00:00
         * @param {string} time 时间
         */
        const mathTime = (time: string) => {
          let duration = parseInt(time);
          let minute = parseInt(String(duration / 60));
          let sec = (duration % 60) + "";
          let isM0 = ":";
          let minuteStr =
            minute >= 10 ? minute : minute == 0 ? "00" : "0" + minute;
          if (sec.length == 1) {
            sec = "0" + sec;
          }
          return minuteStr + isM0 + sec;
        };
        return {
          params,
          mathTime,
        };
      },
      data() {
        let files: any = [],
          playList: any = [],
          dirs: any = [],
          clickSongTimer: any = null,
          dblClickSongTimer: any = null,
          any: any = null;
        return {
          mpStyle: ``,
          // 音乐名称
          musicName: "无音乐",
          // 播放进度
          runTime: "00:00",
          // 总时长
          allTime: "00:00",
          // 是否在播放
          isPlaying: false,
          // 播放|停止 按钮
          controlsName: "bi bi-play",
          // 播放索引
          index: 0,
          loadIndex: -1,
          activeIndex: -1,

          clickSongTimer: clickSongTimer,
          isDblCilckIndex: false,
          dblClickSongTimer: dblClickSongTimer,

          // 显示列表
          files: files,
          listShow: true,
          filesParams: {
            activeIndex: -1,
            mouseTimer: any,
            mouseLock: false,
          },
          //播放列表
          playList: playList,
          playListShow: false,
          playListParams: {
            mouseTimer: any,
            mouseLock: false,
          },

          // 文件夹
          dirs: dirs,
          // 根目录
          rootDir: "",
          showDir: "",
          gotoDir: "",
        };
      },
      created() {
        EventBus.on("music-list-get", this.musicListGet);
        EventBus.on("music-init-get", this.musicInitGet);
        EventBus.on("music-play-get", this.musicPlayGet);
        EventBus.on("music-pause-get", this.musicPauseGet);
        EventBus.on("music-stop-get", this.musicStopGet);
        EventBus.on("MusicPositionTime", this.MusicPositionTime);
        EventBus.on("MusicDone", this.MusicDone);
        EventBus.on("ws-sub", this.init);
        EventBus.on("ws-unsub", this.wsUnsub);
      },
      methods: {
        //#region init相关
        init() {
          if (this.params.musicPlayer.show) {
            this.rootDir = this.params.musicPlayer.rootDir;
            this.setInitParams();
            this.goto(this.rootDir);
          }
        },
        wsUnsub() {
          this.dirs = [];
          this.files = [];
          this.musicStopGet();
        },
        /**
         * 设置初始参数
         */
        setInitParams() {
          EventBus.emit("music-stop-send");
        },
        /**
         * 跳转到指定目录
         * @param {string} dir 目录
         */
        async goto(dir: string) {
          this.gotoDir = dir;
          this.setStyle();
          EventBus.emit("music-list-send", { path: dir });
        },
        //#endregion

        //#region 样式设置
        setStyle() {
          this.mpStyle = this.getStyle({
            x: this.params.musicPlayer.x,
            y: this.params.musicPlayer.y,
          });
        },
        /**
         * 获取样式
         */
        getStyle(data: any) {
          return `left: ${data.x}%;
                    top: ${50 - data.y}%;
                    `;
        },
        //#endregion

        //#region 显示相关
        /**
         * 显示播放列表
         */
        async listShowCilck() {
          if (this.playListShow) {
            this.playListShow = false;
          }
          this.listShow = !this.listShow;
          await nextTick();
          if (this.listShow) {
            this.showSongView();
          }
        },
        /**
         * 播放列表
         */
        playListCilck() {
          if (this.listShow) {
            this.listShow = false;
          }
          this.playListShow = !this.playListShow;
        },
        /**
         * 转跳到现在播放的歌曲的地方显示
         */
        showSongView() {
          document.querySelector(`#music-${this.index}`)?.scrollIntoView(false);
        },
        //#endregion

        //#region 歌单列表逻辑
        /**
         * 目录添加到播放列表
         * @param index
         */
        addSongToPlayList(index: number) {
          if (this.filesParams.activeIndex == index) {
            let info = {
              class: "",
              name: this.files[index].name,
              src: this.files[index].src,
            };
            this.playList[this.playList.length] = info;
            this.filesParams.activeIndex = -1;
          } else {
            this.filesParams.activeIndex = index;
          }
        },
        filesListMousedown(index: number) {
          this.filesParams.mouseLock = true;
          this.filesParams.mouseTimer = setTimeout(() => {
            if (this.filesParams.mouseLock) {
              this.playList = this.playList.concat(this.files);
              this.filesParams.mouseLock = false;
            }
          }, 500);
        },
        filesListMouseup(index: number) {
          if (this.filesParams.mouseLock == true) {
            this.filesParams.mouseLock = false;
            clearTimeout(this.filesParams.mouseTimer);
            this.filesParams.mouseTimer == null;
            this.addSongToPlayList(index);
          }
        },
        //#endregion

        //#region 播放列表逻辑
        /**
         * 双击播放，三击移除出列表
         * @param {number} index 索引
         */
        clickSong(index: number) {
          if (this.activeIndex == index) {
            clearTimeout(this.clickSongTimer);
            if (this.isDblCilckIndex) {
              clearTimeout(this.dblClickSongTimer);
              this.removePlaylistSong(index);
              //
              this.clearClickSongParam();
            } else {
              this.isDblCilckIndex = true;
              this.dblClickSongTimer = setTimeout(() => {
                if (this.index == index) {
                  if (this.isPlaying) {
                    this.pause();
                  } else {
                    this.play();
                  }
                } else {
                  this.playList[this.index].class = "";
                  this.index = index;
                  this.loadingPlay();
                }
                //
                this.clearClickSongParam();
              }, 200);
            }
          } else {
            this.activeIndex = index;
            this.clickSongTimer = setTimeout(() => {
              this.clearClickSongParam();
            }, 300);
          }
        },
        playListMousedown() {
          this.playListParams.mouseLock = true;
          this.playListParams.mouseTimer = setTimeout(() => {
            if (this.playListParams.mouseLock) {
              this.setInitParams();

              this.playListParams.mouseLock = false;
            }
          }, 500);
        },
        playListMouseup(index: number) {
          if (this.playListParams.mouseLock == true) {
            this.playListParams.mouseLock = false;
            clearTimeout(this.playListParams.mouseTimer);
            this.playListParams.mouseTimer == null;
            this.clickSong(index);
          }
        },
        clearClickSongParam() {
          this.activeIndex = -1;
          this.isDblCilckIndex = false;
          this.dblClickSongTimer = null;
          this.clickSongTimer = null;
        },
        /**
         * 移除播放列表歌曲
         *
         * @param index
         */
        removePlaylistSong(index: number) {
          //移除非播放器选中歌曲
          if (this.index != index) {
            if (this.index > index) {
              this.index -= 1;
            }
            this.playList.splice(index, 1);
          } //移除播放器选中歌曲
          else {
            //歌单已清空
            if (this.playList.length === 1) {
              this.playList.splice(index, 1);
              this.setInitParams();
            } //还有歌曲
            else {
              //播放器正在播放状态
              if (this.isPlaying) {
                this.next();
                if (this.playList.length === index + 1) {
                  this.playList.splice(index, 1);
                } else {
                  this.removePlaylistSong(index);
                }
              } //播放器暂停播放状态
              else {
                if (this.playList.length === index + 1) {
                  this.index = 0;
                }
                this.playList.splice(index, 1);
                this.runTime = "00:00";
                this.allTime = "00:00";
                this.musicName = this.playList[this.index].name;
                this.playList[this.index].class = "music-active";
                this.loadingPlay();
              }
            }
          }
        },
        //#endregion

        //#region 播放器逻辑
        /**
         * 播放or暂停
         */
        controls() {
          if (this.isPlaying) {
            this.pause();
          } else {
            this.play();
          }
        },
        /**
         * 播放前准备
         */
        loadingPlay() {
          this.loadIndex = this.index;
          this.addPlaySong();
        },
        /**
         * 添加播放歌曲到播放器
         */
        addPlaySong() {
          this.musicName = this.playList[this.index].name;
          this.playList[this.index].class = "music-active";
          EventBus.emit("music-init-send", {
            musicPath: this.playList[this.index].src,
          });
        },
        /**
         * 播放音乐
         */
        play() {
          if (this.playList.length > 0) {
            if (this.loadIndex != this.index) {
              this.loadingPlay();
            } else {
              EventBus.emit("music-play-send");
            }
          }
        },
        /**
         * 停止播放音乐
         */
        pause() {
          EventBus.emit("music-pause-send");
        },
        /**
         * 下一首
         */
        next() {
          if (this.playList.length > 0) {
            this.playList[this.index].class = "";
            this.index++;
            if (this.index >= this.playList.length) {
              this.index = 0;
            }
            this.showSongView();
            this.loadingPlay();
          }
        },
        /**
         * 上一首
         */
        prev() {
          if (this.playList.length > 0) {
            this.playList[this.index].class = "";
            this.index--;
            if (this.index < 0) {
              this.index = this.playList.length - 1;
            }
            this.showSongView();
            this.loadingPlay();
          }
        },
        //#endregion

        //#region EventBus
        musicListGet(data: MusicListType) {
          let files = data.music;
          let filesResult = files;
          this.files = filesResult;
          let dirs = data.dir;
          let dirsResult = dirs;
          this.dirs = dirsResult;
          this.showDir = this.gotoDir;
          if (this.gotoDir != this.rootDir) {
            this.dirs.unshift({
              name: "..",
              path: this.showDir.substring(0, this.showDir.lastIndexOf("\\")),
            });
          }
        },
        musicInitGet(data: MusicPlayType) {
          this.musicName = data.name;
          this.runTime = this.mathTime(String(data.MusicPositionTime));
          this.allTime = this.mathTime(String(data.MusicTotalTime));
          this.play();
        },
        musicPlayGet(data: MusicPlayType) {
          this.musicName = data.name;
          this.runTime = this.mathTime(String(data.MusicPositionTime));
          this.allTime = this.mathTime(String(data.MusicTotalTime));
          this.isPlaying = true;
          this.controlsName = "bi bi-pause";
        },
        musicPauseGet() {
          this.isPlaying = false;
          this.controlsName = "bi bi-play";
        },
        musicStopGet() {
          this.isPlaying = false;
          this.playList = [];
          this.controlsName = "bi bi-play";
          this.index = 0;
          this.activeIndex = -1;
          this.loadIndex = -1;
          this.musicName = "无音乐";
          this.runTime = "00:00";
          this.allTime = "00:00";
        },
        MusicPositionTime(data: MusicPlayType) {
          this.musicName = data.name;
          this.runTime = this.mathTime(String(data.MusicPositionTime));
          this.allTime = this.mathTime(String(data.MusicTotalTime));
        },
        MusicDone() {
          this.next();
        },
        //#endregion
      },

      components: {},
    });
    return vue;
  }
}

export default Component;
