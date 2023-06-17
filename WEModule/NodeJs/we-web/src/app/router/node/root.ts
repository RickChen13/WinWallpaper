import { RouteRecordRaw } from "vue-router";

const root: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Index",
    component: () => import("@/app/views/index/Index.vue"),
  },
];

export default root;
