import mitt from "mitt";

type Events = {
  "app-change": string;
  "app-auto-play": boolean;
};
const EventBus = mitt<Events>();
export default EventBus;
