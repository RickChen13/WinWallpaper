import mitt from "mitt";

export type MusicPlayType = {
  name: string;
  MusicPositionTime: number;
  MusicTotalTime: number;
};

export type MusicListType = {
  dir: string[];
  music: {
    class: string;
    name: string;
    src: string;
  }[];
};
type Event = {
  openHardware: any;
  netWork: any;
  audio: any;
  "music-list-get": MusicListType;
  "music-init-get": MusicPlayType;
  "music-play-get": MusicPlayType;
  "music-stop-get": void;
  "music-list-send": {
    path: string;
  };
  "music-pause-get": void;

  "music-init-send": {
    musicPath: string;
  };
  "music-play-send": void;
  "music-stop-send": void;
  "music-pause-send": void;
  MusicPositionTime: MusicPlayType;
  MusicDone: void;
  "ws-sub": void;
  "ws-unsub": void;
};

const EventBus = mitt<Event>();

export default EventBus;
