import BaseViews from "@/fast/base/BaseView";
import { defineComponent, ref, Ref } from "vue";
import easyDanmaku from "easy-danmaku-js";
import EventBus from "@/fast/mitt/EventBus";

class Component extends BaseViews {
  constructor() {
    super();
  }

  public vue() {
    const vue = defineComponent({
      name: "danmaku",
      setup() {},
      data() {
        const createDanmaku = () => {
          return new easyDanmaku({
            el: "#danmaku", //弹幕挂载节点
            colourful: true, //彩色弹幕
            line: 10, //弹幕行数
            wrapperStyle: "danmaku-wrapper", //默认弹幕样式
            coefficient: 1, //弹幕密度系数
            speed: 10, //弹幕播放速度
            runtime: 10, //播放一次的时常
            loop: false, //开启循环播放
            hover: false, //鼠标移入悬停
          });
        };
        let Danmaku: Ref<null | easyDanmaku> = ref(null);

        return {
          createDanmaku,
          Danmaku,
        };
      },
      mounted() {
        this.Danmaku = this.createDanmaku();
        let dom = document.getElementById("danmaku") as HTMLElement;
        dom.style.position = "absolute";
        this.setEvent();
      },
      methods: {
        setEvent() {
          EventBus.on("danmaku", this.send);
        },
        removeEvent() {
          EventBus.off("danmaku", this.send);
        },
        send(data: string) {
          if (this.Danmaku != null) {
            this.Danmaku.send(data);
          }
        },
      },
      beforeUnmount() {
        this.removeEvent();
      },
      components: {},
    });
    return vue;
  }
}

export default Component;
