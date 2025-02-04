import BaseViews from "@/fast/base/BaseView";
import { defineComponent, ref, computed } from "vue";

import AudioCanvas from "@/app/components/audioCanvas/AudioCanvas.vue";
import Background from "@/app/components/background/Background.vue";
import Date from "@/app/components/date/Date.vue";
import Weather from "@/app/components/weather/Weather.vue";
import DoublePY from "@/app/components/doublePY/DoublePY.vue";
import Monitor from "@/app/components/monitro/Monitro.vue";
import NetWorkSeppkMonitor from "@/app/components/netWorkSeppkMonitor/NetWorkSeppkMonitor.vue";
import MusicPlayer from "@/app/components/musicPlayer/MusicPlayer.vue";
import MonitorTool from "@/app/plugins/Monitor";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      setup() {
        const audioCanvas = ref<InstanceType<typeof AudioCanvas>>();
        const background = ref<InstanceType<typeof Background>>();
        const date = ref<InstanceType<typeof Date>>();
        const weather = ref<InstanceType<typeof Weather>>();
        const doublePY = ref<InstanceType<typeof DoublePY>>();
        const monitor = ref<InstanceType<typeof Monitor>>();
        const netWorkSeppkMonitor =
          ref<InstanceType<typeof NetWorkSeppkMonitor>>();
        const musicPlayer = ref<InstanceType<typeof MusicPlayer>>();
        return {
          audioCanvas,
          background,
          date,
          weather,
          doublePY,
          monitor,
          netWorkSeppkMonitor,
          musicPlayer,
        };
      },
      data() {
        let initUserConfigArr: any = [];
        const monitorTool = new MonitorTool();
        return {
          monitorTool,
          initUserConfigArr,
          ///是否为首次加载
          initUserConfig: true,

          params: {
            //屏幕宽 px
            width: window.innerWidth,
            //屏幕高 px
            height: window.innerHeight,
            isMobile: false,
            scheme: {
              schemecolor_bool: false,
              //主题配色
              schemecolor: "#ffffffcc",
              //主配色
              schemecolor_color: "#ffffffcc",
            },
            background: {
              //图片更换时间
              refreshTime: 5,
              lastActive: "0",
              //是否更换图片
              isRefresh: false,
            },
            audioCanvas: {
              lineStyle: 2,
              color: "#ffffffcc", // 颜色
              multicolor: true,
              lineColorFollow: true,
              arr: [], // 获取到的频谱数组
              range: 0.3, // 振幅
              shadowBlur: 15,
              // 线宽
              lineWidth: 8,
              circleConfig: {
                range: 0.5, // 振幅
                r: 7, // 圆的半径
                rotation: 8, // 旋转速度
                offsetAngle: 0, //开始旋转角度
                waveArr: new Array(120),
                cX: 5, // 圆中心点在x轴位置
                cY: 5,
              },
              //直线设置
              lineConfig: {
                range: 0.07, // 振幅
                //尺度1-10
                lineWidth: 80,
                //开始位置 x轴 px
                startX: 50,
                //开始位置 y轴中心线位置 px
                startY: 1000,
              },
            },
            dateTime: {
              multicolor: false,
              time: {
                show: true,
                fontSize: 65,
                x: 90,
                y: 90,
              },
              date: {
                show: true,
                fontSize: 18,
                x: 90,
                y: 84,
              },
              gzDate: {
                show: true,
                fontSize: 18,
                x: 90,
                y: 81,
              },
              lunar: {
                show: true,
                fontSize: 18,
                x: 90,
                y: 78,
              },
            },
            weather: {
              multicolor: false,
              show: true,
              fontSize: 18,
              x: 90,
              y: 75,
              city: "广州",
              //天气刷新间隔 秒
              refresh: 1800,
            },
            monitro: {
              multicolor: false,
              show: true,
              fontSize: 12,
              x: 90,
              y: 71,
              cpu: {
                show: true,
              },
              gpu: {
                show: true,
              },
              ram: {
                show: true,
              },
              hdd: {
                show: true,
              },
            },
            doublePY: {
              show: true,
              type: "ms",
              x: 2,
              y: 92,
              leftStyle: "#ffffffcc",
              rightStyle: "#ffffffcc",
            },
            musicPlayer: {
              show: true,
              x: 82,
              y: 40,
              rootDir: "E:\\Music",
            },
            netWorkSpeekMonitor: {
              show: true,
              multicolor: false,
              x: 90,
              y: 73,
              fontSize: 12,
            },
            websocket: {
              webSocketPort: "9999",
            },
          },
        };
      },
      created() { },
      mounted() {
        this.wallpaperPropertyListener();
      },
      methods: {
        init(userParams: any) {
          this.initUserConfigArr = userParams;
          this.initUserConfig = false;
          this.audioCanvas?.audioCanvasFunc();
          this.background?.init();
          this.date?.setStyle();
          this.weather?.setStyle();
          this.doublePY?.init();
          this.monitor?.init();
          this.netWorkSeppkMonitor?.setStyle();
          this.monitorTool.restart(this.params.websocket.webSocketPort);
          this.repeat();
        },
        repeat() {
          this.background?.repeat();
          this.date?.repeat();
          this.weather?.repeat();

          setTimeout(() => {
            this.repeat();
          }, 1000);
        },

        wallpaperPropertyListener() {
          //#region
          let dateLoadingDatetime = () => {
            if (!this.initUserConfig) {
              this.date?.loading_datetime();
            }
          };
          let dateSetStyle = () => {
            if (!this.initUserConfig) {
              this.date?.setStyle();
            }
          };

          let weatherInit = () => {
            if (!this.initUserConfig) {
              this.weather?.init();
            }
          };
          let weatherSetStyle = () => {
            if (!this.initUserConfig) {
              this.weather?.setStyle();
            }
          };

          let doublePYSetStyle = () => {
            if (!this.initUserConfig) {
              this.doublePY?.setStyle();
            }
          };

          let monitroSetStyle = () => {
            if (!this.initUserConfig) {
              this.monitor?.setStyle();
            }
          };

          let netWorkSpeekMonitorSetStyle = () => {
            if (!this.initUserConfig) {
              this.netWorkSeppkMonitor?.setStyle();
            }
          };

          let musicPlayerSetStyle = () => {
            if (!this.initUserConfig) {
              this.musicPlayer?.setStyle();
            }
          };
          let musicPlayerStart = () => {
            if (!this.initUserConfig) {
              this.musicPlayer?.init();
            }
          };

          let backgroundInit = () => {
            if (!this.initUserConfig) {
              this.background?.init();
            }
          };
          let webSocketPort = () => {
            if (!this.initUserConfig) {
              this.monitorTool.restart(this.params.websocket.webSocketPort);
            }
          };

          let doublePY_type = () => {
            if (!this.initUserConfig) {
              this.doublePY?.changeData();
            }
          };

          let imgLastActive = () => {
            if (!this.initUserConfig) {
              this.initUserConfigArr.imgLastActive.value =
                this.params.background.lastActive;
            }
          };
          //#endregion

          //监听配置
          window.wallpaperPropertyListener = {
            applyUserProperties: (userParams: any) => {
              if (userParams.isMobile) {
                this.params.isMobile = userParams.isMobile.value;
                backgroundInit();
              }

              if (userParams.webSocketPort) {
                this.params.websocket.webSocketPort =
                  userParams.webSocketPort.value;
                webSocketPort();
              }
              //#region  音频可视化设置

              //#region 音频模板
              if (userParams.lineStyle) {
                this.params.audioCanvas.lineStyle = userParams.lineStyle.value;
              }
              // 音频颜色是否开启彩色
              if (userParams.lineMulticolor) {
                this.params.audioCanvas.multicolor =
                  userParams.lineMulticolor.value;
              }
              //音频颜色是否跟随主配色
              if (userParams.lineColorFollow) {
                this.params.audioCanvas.lineColorFollow =
                  userParams.lineColorFollow.value;
              }
              // 音频颜色 默认颜色
              if (userParams.lineColor) {
                this.params.audioCanvas.color = this.changeColor4Wallpaper(
                  userParams.lineColor.value
                );
              }
              //#endregion
              //#region 圆
              //圆的半径
              if (userParams.line1_r) {
                this.params.audioCanvas.circleConfig.r =
                  userParams.line1_r.value;
              }
              //旋转速度
              if (userParams.lineStyle) {
                this.params.audioCanvas.circleConfig.rotation =
                  userParams.line1_rotation.value;
              }
              //圆中心点在x轴位置
              if (userParams.line1_cX) {
                this.params.audioCanvas.circleConfig.cX =
                  userParams.line1_cX.value;
              }
              //圆中心点在y轴位置
              if (userParams.line1_cY) {
                this.params.audioCanvas.circleConfig.cY =
                  userParams.line1_cY.value;
              }
              //振幅
              if (userParams.line1_range) {
                this.params.audioCanvas.circleConfig.range =
                  userParams.line1_range.value;
              }
              //#endregion
              //#region 直线
              //振幅
              if (userParams.line2_range) {
                this.params.audioCanvas.lineConfig.range =
                  userParams.line2_range.value;
              }
              //宽
              if (userParams.line2_width) {
                this.params.audioCanvas.lineConfig.lineWidth =
                  userParams.line2_width.value;
                this.loadLineX();
              }
              //Y轴
              if (userParams.line2_startY) {
                this.params.audioCanvas.lineConfig.startY =
                  userParams.line2_startY.value;
              }
              //#endregion

              //#endregion

              //#region 图片设置
              //图片更换时间 毫秒
              if (userParams.imgRefreshTime) {
                this.params.background.refreshTime =
                  userParams.imgRefreshTime.value;
                backgroundInit();
              }
              //是否更换图片
              if (userParams.imgIsRefresh) {
                this.params.background.isRefresh =
                  userParams.imgIsRefresh.value;
                if (!userParams.imgIsRefresh.value && !this.initUserConfig) {
                  this.params.background.lastActive =
                    this.initUserConfigArr.imgLastActive.value;
                }
                backgroundInit();
              }
              //默认图片
              if (userParams.imgLastActive) {
                this.params.background.lastActive =
                  userParams.imgLastActive.value;
                imgLastActive();
              }
              //#endregion

              //#region 时间设置
              //时间显示
              if (userParams.modules_timeShow) {
                this.params.dateTime.time.show =
                  userParams.modules_timeShow.value;
                dateLoadingDatetime();
              }
              //时间字体大小
              if (userParams.modules_timeFontSize) {
                this.params.dateTime.time.fontSize =
                  userParams.modules_timeFontSize.value;
                dateSetStyle();
              }
              //时间x轴位置
              if (userParams.modules_timeX) {
                this.params.dateTime.time.x = userParams.modules_timeX.value;
                dateSetStyle();
              }
              //时间y轴位置
              if (userParams.modules_timeY) {
                this.params.dateTime.time.y = userParams.modules_timeY.value;
                dateSetStyle();
              }
              //#endregion

              //#region 日期设置
              //日期显示
              if (userParams.modules_dateShow) {
                this.params.dateTime.date.show =
                  userParams.modules_dateShow.value;
                dateLoadingDatetime();
              }
              //日期字体大小
              if (userParams.modules_dateFontSize) {
                this.params.dateTime.date.fontSize =
                  userParams.modules_dateFontSize.value;
                dateSetStyle();
              }
              //日期x轴位置
              if (userParams.modules_dateX) {
                this.params.dateTime.date.x = userParams.modules_dateX.value;
                dateSetStyle();
              }
              //日期y轴位置
              if (userParams.modules_dateY) {
                this.params.dateTime.date.y = userParams.modules_dateY.value;
                dateSetStyle();
              }
              //#endregion

              //#region 天干地支设置
              //天干地支显示
              if (userParams.modules_lunarShow) {
                this.params.dateTime.lunar.show =
                  userParams.modules_lunarShow.value;
                dateLoadingDatetime();
              }
              //天干地支字体大小
              if (userParams.modules_lunarFontSize) {
                this.params.dateTime.lunar.fontSize =
                  userParams.modules_lunarFontSize.value;
                dateSetStyle();
              }
              //天干地支x轴位置
              if (userParams.modules_lunarX) {
                this.params.dateTime.lunar.x = userParams.modules_lunarX.value;
                dateSetStyle();
              }
              //天干地支y轴位置
              if (userParams.modules_lunarY) {
                this.params.dateTime.lunar.y = userParams.modules_lunarY.value;
                dateSetStyle();
              }
              //#endregion

              //#region 农历设置
              //农历显示
              if (userParams.modules_gzDateShow) {
                this.params.dateTime.gzDate.show =
                  userParams.modules_gzDateShow.value;
                dateLoadingDatetime();
              }
              //农历字体大小
              if (userParams.modules_gzDateFontSize) {
                this.params.dateTime.gzDate.fontSize =
                  userParams.modules_gzDateFontSize.value;
                dateSetStyle();
              }
              //农历x轴位置
              if (userParams.modules_gzDateX) {
                this.params.dateTime.gzDate.x =
                  userParams.modules_gzDateX.value;
                dateSetStyle();
              }
              //农历y轴位置
              if (userParams.modules_gzDateY) {
                this.params.dateTime.gzDate.y =
                  userParams.modules_gzDateY.value;
                dateSetStyle();
              }
              //#endregion

              //#region 天气设置
              //天气显示
              if (userParams.modules_weatherShow) {
                this.params.weather.show = userParams.modules_weatherShow.value;
                weatherSetStyle();
                weatherInit();
              }
              //天气字体大小
              if (userParams.modules_weatherFontSize) {
                this.params.weather.fontSize =
                  userParams.modules_weatherFontSize.value;
                weatherSetStyle();
              }
              //天气x轴位置
              if (userParams.modules_weatherX) {
                this.params.weather.x = userParams.modules_weatherX.value;
                weatherSetStyle();
              }
              //天气y轴位置
              if (userParams.modules_weatherY) {
                this.params.weather.y = userParams.modules_weatherY.value;
                weatherSetStyle();
              }
              //天气城市
              if (userParams.modules_city) {
                this.params.weather.city = userParams.modules_city.value;
                weatherSetStyle();
              }
              //天气刷新间隔
              if (userParams.modules_weatherRefresh) {
                this.params.weather.refresh =
                  userParams.modules_weatherRefresh.value;
                weatherSetStyle();
              }
              //#endregion

              //#region 双拼设置
              //双拼显示
              if (userParams.doublePY_show) {
                this.params.doublePY.show = userParams.doublePY_show.value;
              }
              // 类型
              if (userParams.doublePY_type) {
                let type = userParams.doublePY_type.value;
                switch (type) {
                  case "1":
                    this.params.doublePY.type = "ms";
                    break;
                  default:
                    this.params.doublePY.type = "ms";
                    break;
                }
                doublePY_type();
              }
              // x轴位置
              if (userParams.doublePY_x) {
                this.params.doublePY.x = userParams.doublePY_x.value;
                doublePYSetStyle();
              }
              // y轴位置
              if (userParams.doublePY_y) {
                this.params.doublePY.y = userParams.doublePY_y.value;
                doublePYSetStyle();
              }
              // 键位颜色
              if (userParams.doublePY_leftStyle) {
                this.params.doublePY.leftStyle = this.changeColor4Wallpaper(
                  userParams.doublePY_leftStyle.value
                );
                doublePYSetStyle();
              }
              // 键位对应颜色
              if (userParams.doublePY_rightStyle) {
                this.params.doublePY.rightStyle = this.changeColor4Wallpaper(
                  userParams.doublePY_rightStyle.value
                );
                doublePYSetStyle();
              }
              //#endregion

              //#region 系统资源设置
              //系统资源
              if (userParams.monitro_show) {
                this.params.monitro.show = userParams.monitro_show.value;
              }
              //字体大小
              if (userParams.monitro_fontSize) {
                this.params.monitro.fontSize =
                  userParams.monitro_fontSize.value;
                monitroSetStyle();
              }
              //天气x轴位置
              if (userParams.monitro_x) {
                this.params.monitro.x = userParams.monitro_x.value;
                monitroSetStyle();
              }
              //y轴位置
              if (userParams.monitro_y) {
                this.params.monitro.y = userParams.monitro_y.value;
                monitroSetStyle();
              }
              //#endregion

              //#region 网速
              if (userParams.netWorkSpeekMonitor_show) {
                this.params.netWorkSpeekMonitor.show =
                  userParams.netWorkSpeekMonitor_show.value;
              }
              if (userParams.netWorkSpeekMonitor_multicolor) {
                this.params.netWorkSpeekMonitor.multicolor =
                  userParams.netWorkSpeekMonitor_multicolor.value;
                netWorkSpeekMonitorSetStyle();
              }
              if (userParams.netWorkSpeekMonitor_x) {
                this.params.netWorkSpeekMonitor.x =
                  userParams.netWorkSpeekMonitor_x.value;
                netWorkSpeekMonitorSetStyle();
              }
              if (userParams.netWorkSpeekMonitor_y) {
                this.params.netWorkSpeekMonitor.y =
                  userParams.netWorkSpeekMonitor_y.value;
                netWorkSpeekMonitorSetStyle();
              }
              if (userParams.netWorkSpeekMonitor_fontSize) {
                this.params.netWorkSpeekMonitor.fontSize =
                  userParams.netWorkSpeekMonitor_fontSize.value;
                netWorkSpeekMonitorSetStyle();
              }
              //#endregion

              //#region 音乐播放器
              if (userParams.musicPlayer_show) {
                this.params.musicPlayer.show =
                  userParams.musicPlayer_show.value;
                musicPlayerStart();
              }
              if (userParams.musicPlayer_Root) {
                this.params.musicPlayer.rootDir =
                  userParams.musicPlayer_Root.value;
                musicPlayerStart();
              }
              if (userParams.musicPlayer_x) {
                this.params.musicPlayer.x = userParams.musicPlayer_x.value;
                musicPlayerSetStyle();
              }
              if (userParams.musicPlayer_y) {
                this.params.musicPlayer.y = userParams.musicPlayer_y.value;
                musicPlayerSetStyle();
              }
              //#endregion

              if (this.initUserConfig) {
                this.init(userParams);
              }
            },
          };
        },

        /**
         * 计算音频直线x轴开始位置
         */
        loadLineX() {
          this.params.audioCanvas.lineConfig.startX =
            window.innerWidth *
            (10 - this.params.audioCanvas.lineConfig.lineWidth * 0.1) *
            0.05;
        },

        /**
         * 转换Wallpaper里面的颜色
         *
         * @param color Wallpaper给出的颜色
         * @returns
         */
        changeColor4Wallpaper(color: string): string {
          let customColor;
          if (color[0] === "#") {
            if (color.length === 7) {
              customColor = `${color}cc`;
            } else {
              customColor = color;
            }
          } else {
            let customColorArr: any = color.split(" ");
            customColor = customColorArr.map(function (c: number) {
              return Math.ceil(c * 255);
            });
            customColor = `rgba(${customColor},0.8)`;
          }
          return customColor;
        },
      },
      components: {
        AudioCanvas,
        Background,
        Date,
        Weather,
        DoublePY,
        Monitor,
        NetWorkSeppkMonitor,
        MusicPlayer,
      },
      provide() {
        return {
          params: computed(() => this.params),
        };
      },
    });
    return vue;
  }
}

export default Component;
