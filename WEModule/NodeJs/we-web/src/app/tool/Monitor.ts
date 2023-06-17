import EventBus from "@/fast/plugins/mitt/EventBus";

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
    EventBus.on("music-list-send", (data) => {
      let msg = {
        type: "music-list",
        data: data.path,
      };
      this.send(msg);
    });
    EventBus.on("music-init-send", (data) => {
      let msg = {
        type: "music-init",
        data: data.musicPath,
      };
      this.send(msg);
    });
    EventBus.on("music-play-send", () => {
      let msg = {
        type: "music-play",
        data: "",
      };
      this.send(msg);
    });
    EventBus.on("music-stop-send", () => {
      let msg = {
        type: "music-stop",
        data: "",
      };
      this.send(msg);
    });
    EventBus.on("music-pause-send", () => {
      let msg = {
        type: "music-pause",
        data: "",
      };
      this.send(msg);
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
    this.ws.onopen = (event) => {
      this.onOpen(event);
    };

    this.ws.onmessage = (message) => {
      this.onMessage(message);
    };

    this.ws.onclose = (event) => {
      this.onclose(event);
    };

    this.ws.onerror = (error) => {
      this.onError(error);
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

  private onOpen(event: Event) {
    this.isOnline = true;
  }

  private onMessage(message: MessageEvent<any>) {
    let msg = JSON.parse(message.data);

    switch (msg.type) {
      case "openHardware":
        msg.data = JSON.parse(msg.data);
        EventBus.emit("openHardware", msg.data);
        break;
      case "netWork":
        msg.data = JSON.parse(msg.data);
        EventBus.emit("netWork", msg.data);
        break;
      case "audio":
        msg.data = JSON.parse(msg.data);
        EventBus.emit("audio", msg.data);
        break;
      case "music-list":
        msg.data = JSON.parse(msg.data);
        msg.data.dir = JSON.parse(msg.data.dir);
        msg.data.music = JSON.parse(msg.data.music);
        EventBus.emit("music-list-get", msg.data);
        break;
      case "music-init":
        msg.data = JSON.parse(msg.data);
        EventBus.emit("music-init-get", msg.data);
        break;
      case "music-play":
        msg.data = JSON.parse(msg.data);
        EventBus.emit("music-play-get", msg.data);
        break;
      case "music-stop":
        EventBus.emit("music-stop-get");
        break;
      case "music-pause":
        EventBus.emit("music-pause-get");
        break;
      case "MusicPositionTime":
        msg.data = JSON.parse(msg.data);
        EventBus.emit("MusicPositionTime", msg.data);
        break;
      case "MusicDone":
        EventBus.emit("MusicDone");
        break;
      case "ws-sub":
        EventBus.emit("ws-sub");
        break;
      case "ws-unsub":
        EventBus.emit("ws-unsub");
        break;
      case "error":
        console.log("error", msg.data);
        break;
      default:
        console.log(msg);
        break;
    }
  }

  private onclose(event: CloseEvent) {
    this.needReconnection = true;
    setTimeout(() => {
      this.reconnection();
    }, Math.ceil(Math.random() * 10));
  }

  private onError(error: Event) {
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
