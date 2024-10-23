import BaseViews from "@/fast/base/BaseView";
import { defineComponent, getCurrentInstance, inject } from "vue";
import Calendar from "@/common/Calendar";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      setup() {
        const proxy = getCurrentInstance();
        let calendar = new Calendar();
        let params: any = inject("params");
        return {
          proxy,
          calendar,
          params,
        };
      },
      data() {
        return {
          myClass: "modules-div",
          //日期
          date: "",
          //日期样式
          dateStyle: "",

          //天干地支信息
          lunar: "",
          //天干地支样式
          lunarStyle: "",

          //农历信息
          gzDate: "",
          //农历样式
          gzDateStyle: "",

          //时间
          His: "",
          //时间样式
          timeStyle: "",
        };
      },
      created() { },
      mounted() { },
      methods: {
        /**
         * 加载日期时间(供外部使用)
         */
        loading_datetime() {
          if (
            this.params.dateTime.date.show ||
            this.params.dateTime.time.show
          ) {
            this.setTime();
          } else {
            this.date = "";
            this.His = "";
          }
        },
        /**
         * 刷新(供外部使用)
         */
        repeat() {
          this.setTime();
        },
        /**
         * 设置样式
         */
        setStyle() {
          if (this.params.dateTime.multicolor) {
            this.myClass = "multicolor-text modules-div";
          } else {
            this.myClass = "modules-div";
          }
          this.timeStyle = this.getStyle(this.params.dateTime.time);
          this.dateStyle = this.getStyle(this.params.dateTime.date);
          this.lunarStyle = this.getStyle(this.params.dateTime.lunar);
          this.gzDateStyle = this.getStyle(this.params.dateTime.gzDate);
        },
        /**
         * 获取样式
         *
         * @returns
         */
        getStyle(array: any) {
          return `width: ${this.params.width}px;
                line-height: ${this.params.height}px;
                height: ${this.params.height}px;
                font-size:${array.fontSize}px;
                left: ${array.x - 50}%;
                top: ${50 - array.y}%;`;
        },
        /**
         * 补零
         *
         * @param {number} num
         * @param {number} len
         * @returns
         */
        formatZero(num: string | number, len: number) {
          let result;
          if (String(num).length >= len) {
            result = num;
          } else {
            result = (Array(len).join("0") + num).slice(-len);
          }
          return result;
        },
        /**
         * 设置时间
         */
        setTime() {
          let t = new Date();
          if (this.params.dateTime.date.show) {
            let b = new Array(
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月"
            );
            let month = t.getMonth();
            let c = new Array(
              "",
              "一号",
              "二号",
              "三号",
              "四号",
              "五号",
              "六号",
              "七号",
              "八号",
              "九号",
              "十号",
              "十一号",
              "十二号",
              "十三号",
              "十四号",
              "十五号",
              "十六号",
              "十七号",
              "十八号",
              "十九号",
              "二十号",
              "二十一号",
              "二十二号",
              "二十三号",
              "二十四号",
              "二十五号",
              "二十六号",
              "二十七号",
              "二十八号",
              "二十九号",
              "三十号",
              "三十一号"
            );
            let day = t.getDate();
            let a = new Array(
              "星期天",
              "星期一",
              "星期二",
              "星期三",
              "星期四",
              "星期五",
              "星期六"
            );
            let week = new Date().getDay();
            this.date = `${b[month]}${c[day]}  ${a[week]}`;
          } else if (this.date != "") {
            this.date = "";
          }
          if (this.params.dateTime.time.show) {
            this.His = `${this.formatZero(t.getHours(), 2)} : ${this.formatZero(
              t.getMinutes(),
              2
            )} <span class="seconds">${this.formatZero(
              t.getSeconds(),
              2
            )}</span>`;
          } else if (this.His != "") {
            this.His = "";
          }
          if (
            this.params.dateTime.lunar.show ||
            this.params.dateTime.gzDate.show
          ) {
            let lunar = this.calendar.solar2lunar(
              String(t.getFullYear()),
              String(t.getMonth() + 1),
              String(t.getDate())
            );
            if (lunar) {
              if (this.params.dateTime.lunar.show) {
                this.lunar = `${lunar.Animal}年 ${lunar.IMonthCn} ${lunar.IDayCn}`;
              } else {
                this.lunar = "";
              }
              if (this.params.dateTime.gzDate.show) {
                this.gzDate = `${lunar.gzYear}年 ${lunar.gzMonth}月 ${lunar.gzDay}日`;
              } else {
                this.gzDate = "";
              }
            }
          } else {
            this.lunar = "";
            this.gzDate = "";
          }
        },
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
