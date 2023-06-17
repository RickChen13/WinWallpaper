import mitt from "mitt";
type Events = {
  danmaku: string;
};
const EventBus = mitt<Events>();
export default EventBus;
