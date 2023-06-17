import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance, ref, inject } from "vue";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "audioCanvas",
      setup() {
        const proxy = getCurrentInstance();
        let audioCanvas = ref<InstanceType<typeof HTMLCanvasElement>>();
        let audioCanvasCtx =
          ref<InstanceType<typeof CanvasRenderingContext2D>>();

        let params: any = inject("params");
        return {
          proxy,
          audioCanvas,
          audioCanvasCtx,
          params,
        };
      },
      data() {
        let w: number = 0;
        let h: number = 0;
        let minW: number = 0;
        let start: number = 0;
        let jumpStart: number = 0;

        let waveArr = new Array(120);
        let arr: PointData[] = [];
        let arr1: PointData[] = [];
        let arr2: PointData[] = [];
        return {
          w,
          h,
          minW,
          start,
          jumpStart,
          waveArr,
          arr,
          arr1,
          arr2,
        };
      },
      created() {},
      mounted() {
        this.audioCanvas = document.getElementById(
          "AudioCanvas"
        ) as HTMLCanvasElement;
        this.audioCanvas.height = window.innerHeight;
        this.audioCanvas.width = window.innerWidth;
        this.audioCanvasCtx = this.audioCanvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;
      },
      methods: {
        audioCanvasFunc() {
          window.WallpaperAudio = this.wallpaperAudioListener;
        },
        wallpaperAudioListener(audioArray: any) {
          this.darw(audioArray);
        },
        /**
         *  生成点
         *
         * @param arr
         */
        async createPoint(arr: any) {
          this.arr1 = [];
          this.arr2 = [];
          if (this.audioCanvas != undefined) {
            if (this.params.audioCanvas.lineStyle == 1) {
              for (let i = 0; i < arr.length; i++) {
                let deg =
                  (Math.PI / 180) *
                  (i + this.params.audioCanvas.circleConfig.offsetAngle) *
                  (180 / (arr.length / 2)); //角度
                let w1 = arr[i] ? arr[i] : 0;
                let w2;
                if (this.waveArr[i]) {
                  w2 = this.waveArr[i] - 0.1;
                } else {
                  w2 = 0;
                }
                w1 = Math.max(w1, w2);
                this.waveArr[i] = w1 =
                  w1 > 1.2
                    ? w1 < 12
                      ? w1 < 24
                        ? 1.2
                        : w1 / 20
                      : w1 / 10
                    : w1;

                let w =
                  w1 * (this.params.audioCanvas.circleConfig.range * 0.1) * 100;
                let offset1 =
                  (this.params.audioCanvas.circleConfig.r * 0.1 * this.minW) /
                    2 +
                  w +
                  1; // 外圆偏移
                let offset2 =
                  (this.params.audioCanvas.circleConfig.r * 0.1 * this.minW) /
                    2 -
                  w -
                  1; // 内圆偏移
                let p1 = this.getXY(offset1, deg);
                let p2 = this.getXY(offset2, deg);
                this.arr1.push({
                  x: p1.x,
                  y: p1.y,
                });
                this.arr2.push({
                  x: p2.x,
                  y: p2.y,
                });
              }
              if (this.params.audioCanvas.circleConfig.rotation) {
                this.params.audioCanvas.circleConfig.offsetAngle +=
                  this.params.audioCanvas.circleConfig.rotation / 100;
                if (this.params.audioCanvas.circleConfig.offsetAngle >= 360) {
                  this.params.audioCanvas.circleConfig.offsetAngle = 0;
                } else if (
                  this.params.audioCanvas.circleConfig.offsetAngle <= 0
                ) {
                  this.params.audioCanvas.circleConfig.offsetAngle = 360;
                }
              }
            } else if (this.params.audioCanvas.lineStyle == 2) {
              let barWidth = Math.round(
                (1.0 / arr.length) *
                  this.audioCanvas.width *
                  (this.params.audioCanvas.lineConfig.lineWidth * 0.1) *
                  0.1
              );
              for (let i = 0; i < arr.length; i++) {
                let w1 = arr[i] ? (arr[i] > 1 ? arr[i] : 1) : 1;
                let height =
                  this.h *
                  Math.min(
                    w1 *
                      (this.params.audioCanvas.lineConfig.range * 0.1) *
                      0.05,
                    1
                  );
                this.arr1.push({
                  x: this.params.audioCanvas.lineConfig.startX + barWidth * i,
                  y: this.params.audioCanvas.lineConfig.startY - height,
                });
                this.arr2.push({
                  x: this.params.audioCanvas.lineConfig.startX + barWidth * i,
                  y: this.params.audioCanvas.lineConfig.startY + height,
                });
              }
            } else {
              for (let i = 0; i < 1; i++) {
                this.arr1.push({
                  x: 0,
                  y: 0,
                });
                this.arr2.push({
                  x: 0,
                  y: 0,
                });
              }
            }
          }
        },

        /**
         * 圆获取xy
         * @param offset
         * @param deg
         * @returns
         */
        getXY(offset: number, deg: number) {
          return {
            x:
              Math.cos(deg) * offset +
              this.params.audioCanvas.circleConfig.cX * 0.1 * this.w,
            y:
              Math.sin(deg) * offset +
              this.params.audioCanvas.circleConfig.cY * 0.1 * this.h,
          };
        },

        /**
         * 设置宽高
         */
        setWH() {
          this.w = window.innerWidth;
          this.h = window.innerHeight;
          this.minW = Math.min(this.w, this.h);
        },

        /**
         * 设置样式
         */
        setStyle() {
          if (
            this.audioCanvas != undefined &&
            this.audioCanvasCtx != undefined
          ) {
            this.audioCanvasCtx.fillStyle = "rgba(255,255,255,0)";
            this.audioCanvasCtx.shadowBlur = this.params.audioCanvas.shadowBlur;
            this.audioCanvasCtx.lineWidth = this.params.audioCanvas.lineWidth;
            this.audioCanvasCtx.clearRect(
              0,
              0,
              this.audioCanvas.width,
              this.audioCanvas.height
            );
            this.audioCanvasCtx.fillRect(
              0,
              0,
              this.audioCanvas.width,
              this.audioCanvas.height
            );
            this.setLineColor();
          }
        },

        /**
         * 设置线条颜色
         */
        setLineColor() {
          if (
            this.audioCanvas != undefined &&
            this.audioCanvasCtx != undefined
          ) {
            if (this.params.audioCanvas.multicolor) {
              let gradient = this.audioCanvasCtx.createLinearGradient(
                0,
                0,
                this.audioCanvas.width,
                this.audioCanvas.height
              );
              let arr: string[] = new Array(21);
              arr[0 + this.start] = arr[
                1 + this.start <= 20 ? 1 + this.start : this.start - 20
              ] = "#6699FFcc";
              arr[2 + this.start <= 20 ? 2 + this.start : this.start - 19] =
                arr[3 + this.start <= 20 ? 3 + this.start : this.start - 18] =
                  "#66CCFFcc";
              arr[4 + this.start <= 20 ? 4 + this.start : this.start - 17] =
                arr[5 + this.start <= 20 ? 5 + this.start : this.start - 16] =
                  "#9999FFcc";
              arr[6 + this.start <= 20 ? 6 + this.start : this.start - 15] =
                arr[7 + this.start <= 20 ? 7 + this.start : this.start - 14] =
                  "#99CCFFcc";
              arr[8 + this.start <= 20 ? 8 + this.start : this.start - 13] =
                arr[9 + this.start <= 20 ? 9 + this.start : this.start - 12] =
                  "#99FFFFcc";
              arr[10 + this.start <= 20 ? 10 + this.start : this.start - 11] =
                arr[11 + this.start <= 20 ? 11 + this.start : this.start - 10] =
                  "#CC66FFcc";
              arr[12 + this.start <= 20 ? 12 + this.start : this.start - 9] =
                arr[13 + this.start <= 20 ? 13 + this.start : this.start - 8] =
                  "#CC99FFcc";
              arr[14 + this.start <= 20 ? 14 + this.start : this.start - 7] =
                arr[15 + this.start <= 20 ? 15 + this.start : this.start - 6] =
                  "#CCCCFFcc";
              arr[16 + this.start <= 20 ? 16 + this.start : this.start - 5] =
                arr[17 + this.start <= 20 ? 17 + this.start : this.start - 4] =
                  "#FF66FFcc";
              arr[18 + this.start <= 20 ? 18 + this.start : this.start - 3] =
                arr[19 + this.start <= 20 ? 19 + this.start : this.start - 2] =
                  "#FF99FFcc";
              arr[20 + this.start <= 20 ? 20 + this.start : this.start - 1] =
                "#FFCCFFcc";
              gradient.addColorStop(0, arr[0]);
              gradient.addColorStop(0.05, arr[1]);
              gradient.addColorStop(0.1, arr[2]);
              gradient.addColorStop(0.15, arr[3]);
              gradient.addColorStop(0.2, arr[4]);
              gradient.addColorStop(0.25, arr[5]);
              gradient.addColorStop(0.3, arr[6]);
              gradient.addColorStop(0.35, arr[7]);
              gradient.addColorStop(0.4, arr[8]);
              gradient.addColorStop(0.45, arr[9]);
              gradient.addColorStop(0.5, arr[10]);
              gradient.addColorStop(0.55, arr[11]);
              gradient.addColorStop(0.6, arr[12]);
              gradient.addColorStop(0.65, arr[13]);
              gradient.addColorStop(0.7, arr[14]);
              gradient.addColorStop(0.75, arr[15]);
              gradient.addColorStop(0.8, arr[16]);
              gradient.addColorStop(0.85, arr[17]);
              gradient.addColorStop(0.9, arr[18]);
              gradient.addColorStop(0.95, arr[19]);
              gradient.addColorStop(1, arr[20]);
              this.jumpStart += 1;
              if (this.jumpStart == 15) {
                this.jumpStart = 0;
                this.start += 1;
                if (this.start > 20) {
                  this.start = 0;
                }
              }
              this.audioCanvasCtx.strokeStyle = gradient;
            } else {
              if (this.params.audioCanvas.lineColorFollow) {
                if (this.params.scheme.schemecolor_bool) {
                  this.audioCanvasCtx.strokeStyle =
                    this.params.scheme.schemecolor;
                } else {
                  this.audioCanvasCtx.strokeStyle =
                    this.params.scheme.schemecolor_color;
                }
              } else {
                this.audioCanvasCtx.strokeStyle = this.params.audioCanvas.color;
              }
            }
          }
        },

        /**
         * 绘制图案
         *
         * @param arr
         */
        async darw(arr: any) {
          if (
            this.audioCanvas != undefined &&
            this.audioCanvasCtx != undefined
          ) {
            this.setWH();
            this.setStyle();
            await this.createPoint(arr);
            this.audioCanvasCtx.beginPath();
            let count = arr.length;
            if (this.params.audioCanvas.lineStyle == 0) {
              count = 1;
            }

            for (let i = 0; i < count; i++) {
              this.audioCanvasCtx.moveTo(this.arr1[i].x, this.arr1[i].y);
              this.audioCanvasCtx.lineTo(this.arr2[i].x, this.arr2[i].y);
            }
            this.audioCanvasCtx.closePath();
            this.audioCanvasCtx.stroke();
          }
        },
      },
      components: {},
    });
    return vue;
  }
}

interface PointData {
  x: number;
  y: number;
}
export default Component;
