import { useEventBus } from "@/app/plugins/mitt/EventBus";

class Monitor {
  isOnline = false;
  isStop: boolean = false;
  needReconnection: boolean = true;
  ws: WebSocket | null;
  port = "9999";

  constructor() {
    this.ws = null;
    this.setEvent();
  }

  private setEvent() {
    useEventBus({
      name: "music-list-send", callback: (data) => {
        let msg = {
          type: "music-list",
          data: data.path,
        };
        this.send(msg);
      }
    });

    useEventBus({
      name: "music-init-send", callback: (data) => {
        let msg = {
          type: "music-init",
          data: data.musicPath,
        };
        this.send(msg);
      }
    });

    useEventBus({
      name: "music-play-send", callback: () => {
        let msg = {
          type: "music-play",
          data: "",
        };
        this.send(msg);
      }
    });
    useEventBus({
      name: "music-stop-send", callback: () => {
        let msg = {
          type: "music-stop",
          data: "",
        };
        this.send(msg);
      }
    });
    useEventBus({
      name: "music-pause-send", callback: () => {
        let msg = {
          type: "music-pause",
          data: "",
        };
        this.send(msg);
      }
    });


  }

  send(msg: any) {
    if (this.ws != null && this.isOnline) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  start(port?: string) {
    this.port = port ? port : this.port;
    this.ws = new WebSocket(`ws://127.0.0.1:${this.port}`);
    this.ws.onopen = () => {
      this.onOpen();
    };

    this.ws.onmessage = (message) => {
      this.onMessage(message);
    };

    this.ws.onclose = () => {
      this.onclose();
    };

    this.ws.onerror = () => {
      this.onError();
    };
  }

  stop() {
    this.isStop = true;
    if (this.ws != null) {
      this.ws.close();
      this.ws = null;
    }
    setTimeout(() => {
      this.isStop = false;
    }, 30);
  }

  restart(port?: string) {
    this.stop();
    this.start(port);
  }

  private onOpen() {
    this.isOnline = true;
  }

  private onMessage(message: MessageEvent<any>) {
    let msg = JSON.parse(message.data);

    switch (msg.type) {
      case "openHardware":
        msg.data = JSON.parse(msg.data);
        useEventBus().emit("openHardware", msg.data);
        break;
      case "netWork":
        msg.data = JSON.parse(msg.data);
        useEventBus().emit("netWork", msg.data);
        break;
      case "audio":
        msg.data = JSON.parse(msg.data);
        useEventBus().emit("audio", msg.data);
        break;
      case "music-list":
        msg.data = JSON.parse(msg.data);
        msg.data.dir = JSON.parse(msg.data.dir);
        msg.data.music = JSON.parse(msg.data.music);
        useEventBus().emit("music-list-get", msg.data);
        break;
      case "music-init":
        msg.data = JSON.parse(msg.data);
        useEventBus().emit("music-init-get", msg.data);
        break;
      case "music-play":
        msg.data = JSON.parse(msg.data);
        useEventBus().emit("music-play-get", msg.data);
        break;
      case "music-stop":
        useEventBus().emit("music-stop-get");
        break;
      case "music-pause":
        useEventBus().emit("music-pause-get");
        break;
      case "MusicPositionTime":
        msg.data = JSON.parse(msg.data);
        useEventBus().emit("MusicPositionTime", msg.data);
        break;
      case "MusicDone":
        useEventBus().emit("MusicDone");
        break;
      case "ws-sub":
        useEventBus().emit("ws-sub");
        break;
      case "ws-unsub":
        useEventBus().emit("ws-unsub");
        break;
      case "error":
        console.log("error", msg.data);
        break;
      default:
        console.log(msg);
        break;
    }
  }

  private onclose() {
    this.needReconnection = true;
    setTimeout(() => {
      this.reconnection();
    }, Math.ceil(Math.random() * 10));
  }

  private onError() {
    this.needReconnection = true;
    setTimeout(() => {
      this.reconnection();
    }, Math.ceil(Math.random() * 100));
  }

  private reconnection() {
    if (!this.isStop) {
      setTimeout(() => {
        if (this.needReconnection) {
          this.needReconnection = false;
          this.start();
        }
      }, 5000);
    }
  }
}

export default Monitor;
