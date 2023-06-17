import BaseViews from "@/fast/base/BaseView";
import EventBus from "@/fast/mitt/EventBus";
import { defineComponent, getCurrentInstance, inject, nextTick } from "vue";

/**
 *
 * ------------bug-------------
 *
 * 网络歌曲转跳时间问题(待详细测试)
 *
 *
 */

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "musicPlayer",
      setup() {
        const proxy = getCurrentInstance();
        let params: any = inject("params");
        return {
          proxy,
          params,
        };
      },
      data() {
        let audio = document.getElementById("musicAudio") as HTMLAudioElement,
          progressall = document.getElementById("progressall") as HTMLElement,
          progresscurrent = document.getElementById(
            "progresscurrent"
          ) as HTMLElement,
          files: any = [],
          playList: any = [],
          dirs: any = [],
          clickSongTimer: any = null,
          dblClickSongTimer: any = null,
          any: any = null,
          timer: any;
        return {
          mpStyle: ``,
          // 音乐播放器document
          audio: audio,
          progressall: progressall,
          progresscurrent: progresscurrent,
          // 音乐名称
          musicName: "无音乐",
          // 播放进度
          runTime: "00:00",
          // 总时长
          allTime: "00:00",
          allTimeNumber: 0,
          // 播放路径
          src: "",
          // 播放|停止 按钮
          controlsName: "bi bi-play",
          // 定时器id
          timer: timer,

          // 播放索引
          index: 0,

          activeIndex: -1,
          clickSongTimer: clickSongTimer,

          isDblCilckIndex: false,
          dblClickSongTimer: dblClickSongTimer,

          // 是否在播放
          isPlaying: false,
          // 是否能播放
          isCanPlay: true,

          // 播放目录
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
          //
          showDir: "",

          timeIndex: 0,
        };
      },
      created() {},
      methods: {
        init() {
          if (this.params.musicPlayer.show) {
            this.rootDir = this.params.musicPlayer.rootDir;
            this.audio = document.getElementById(
              "musicAudio"
            ) as HTMLAudioElement;
            this.progressall = document.getElementById(
              "progressall"
            ) as HTMLElement;
            this.progresscurrent = document.getElementById(
              "progresscurrent"
            ) as HTMLElement;

            this.setInitParams();

            this.goto(this.rootDir);
          }
        },
        /**
         * 设置初始参数
         */
        setInitParams() {
          this.isPlaying = false;
          this.isCanPlay = false;
          this.controlsName = "bi bi-play";
          this.src = "";
          this.index = 0;
          this.activeIndex = -1;
          this.musicName = "无音乐";
          this.runTime = "00:00";
          this.allTime = "00:00";
          this.progresscurrent.style.width = "0px";
          this.clearIntervalTimer();
          this.setInitAudioEvent();
        },

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
         * 跳转到指定目录
         * @param {string} dir 目录
         */
        async goto(dir: string) {
          this.setStyle();
          let files = await window.DesktopJsApi.GetMusilList(dir);
          let filesResult = JSON.parse(files);
          this.files = filesResult;
          let dirs = await window.DesktopJsApi.GetDir(dir);
          let dirsResult = JSON.parse(dirs);
          this.dirs = dirsResult;
          this.showDir = dir;
          if (dir != this.rootDir) {
            this.dirs.unshift({
              name: "..",
              path: this.showDir.substring(0, this.showDir.lastIndexOf("\\")),
            });
          }
        },
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
                    this.loadingPlay();
                  }
                } else {
                  this.isCanPlay = false;
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
              //
              this.clearClickSongParam();
            }, 300);
          }
        },
        playListMousedown() {
          this.playListParams.mouseLock = true;
          this.playListParams.mouseTimer = setTimeout(() => {
            if (this.playListParams.mouseLock) {
              this.setInitParams();
              this.playList = [];
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
                this.isCanPlay = false;
              }
            }
          }
        },

        /**
         * 清除oncanplay钩子
         */
        setInitAudioEvent() {
          if (this.isPlaying) {
            this.audio.oncanplay = () => {};
          }
        },

        /**
         * 播放or暂停
         */
        controls() {
          if (this.isPlaying) {
            this.pause();
          } else {
            this.loadingPlay();
          }
        },
        /**
         * 播放前准备
         */
        loadingPlay() {
          this.addPlaySong();
          if (!this.isCanPlay) {
            this.audio.oncanplay = () => {
              this.isCanPlay = true;
              this.play();
              this.addPlayEvent();
            };
          } else {
            this.play();
            this.addPlayEvent();
          }
        },
        /**
         * 添加播放歌曲到播放器
         */
        addPlaySong() {
          if (this.src == this.playList[this.index].src) {
            this.audio.currentTime = 0;
          }
          this.musicName = this.playList[this.index].name;
          this.playList[this.index].class = "music-active";
          this.src = this.playList[this.index].src;
          this.audio.onloadedmetadata = () => {
            this.allTimeNumber = this.audio.duration;
            this.allTime = this.mathTime(String(this.audio.duration));
          };
        },
        /**
         * 添加播放事件
         */
        addPlayEvent() {
          this.audio.onplaying = () => {
            this.controlsName = "bi bi-pause";
            this.isPlaying = true;
          };
          this.audio.onpause = () => {
            this.controlsName = "bi bi-play";
            this.isPlaying = false;
          };
          this.audio.onended = () => {
            this.next();
          };
        },
        /**
         * 音乐进度转跳
         * @param $event
         */
        musicGoto($event: MouseEvent) {
          if (this.isCanPlay) {
            if (!this.isPlaying) {
              this.setInitAudioEvent();
            }
            let gotoWidth = $event.offsetX;
            let progressallWidth = this.progressall.offsetWidth;
            let percent = (gotoWidth / progressallWidth) * this.allTimeNumber;
            this.audio.currentTime = percent;
            this.setMusicProgress();
          }
        },
        /**
         * 设置进度
         */
        setMusicProgress() {
          this.runTime = this.mathTime(String(this.audio.currentTime));
          let progressallWidth = this.progressall.offsetWidth;
          let pre =
            ((100 * this.audio.currentTime) / (100 * this.audio.duration)) *
            progressallWidth;
          this.progresscurrent.style.width = pre + "px";
        },
        /**
         * 播放音乐
         */
        play() {
          this.audio.play();
          this.isPlaying = true;
          this.setInitAudioEvent();
          this.controlsName = "bi bi-pause";
          this.timeIndex = 0;
          this.readCurrentTime();
        },
        /**
         * 读取音乐进度
         */
        readCurrentTime() {
          this.setMusicProgress();
          if (this.audio.currentTime == this.audio.duration) {
            this.clearIntervalTimer();
            this.next();
          }
          if (this.isPlaying) {
            this.timer = setTimeout(() => {
              this.readCurrentTime();
              if (this.timeIndex <= 0) {
                const str = `正在播放：${this.musicName}`;
                EventBus.emit("danmaku", str);
                this.timeIndex = 100;
              }
              this.timeIndex--;
            }, 100);
          }
        },
        /**
         * 停止播放音乐
         */
        pause() {
          this.audio.pause();
          this.isPlaying = false;
          this.clearIntervalTimer();
          this.controlsName = "bi bi-play";
        },
        /**
         * 下一首
         */
        next() {
          this.clearIntervalTimer();
          this.isCanPlay = false;
          this.playList[this.index].class = "";
          this.index++;
          if (this.index >= this.playList.length) {
            this.index = 0;
          }
          this.showSongView();
          this.loadingPlay();
        },
        /**
         * 上一首
         */
        prev() {
          this.clearIntervalTimer();
          this.isCanPlay = false;
          this.playList[this.index].class = "";
          this.index--;
          if (this.index < 0) {
            this.index = this.playList.length - 1;
          }
          this.showSongView();
          this.loadingPlay();
        },
        /**
         * 转跳到现在播放的歌曲的地方显示
         */
        showSongView() {
          document.querySelector(`#music-${this.index}`)?.scrollIntoView(false);
        },
        /**
         * 清除定时器
         */
        clearIntervalTimer() {
          clearInterval(this.timer);
          this.timer = null;
        },
        /**
         * 转换时间格式 00:00
         * @param {string} time 时间
         */
        mathTime(time: string) {
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
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
