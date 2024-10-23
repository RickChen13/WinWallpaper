import mitt from "mitt";
import { onBeforeUnmount } from 'vue';

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
export type Event = {
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

type Option<K extends keyof Event> = {
    name: K; // 对应 Event 的键
    callback: Fn<Event[K]>; // 对应 Event 的值作为回调函数的参数类型
};

const EventBus = mitt<Event>();
export const useEventBus = <K extends keyof Event>(option?: Option<K>) => {
    if (option) {
        EventBus.on(option.name, option.callback);
        onBeforeUnmount(() => {
            EventBus.off(option.name, option.callback);
        });
    }

    return {
        on: EventBus.on,
        off: EventBus.off,
        emit: EventBus.emit,
        all: EventBus.all
    };
};

