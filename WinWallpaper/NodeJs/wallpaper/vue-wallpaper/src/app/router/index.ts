import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import RootRouter from "@/app/router/node/root";

let routes: RouteRecordRaw[] = RootRouter; //.concat(IndexRouter,ArticleRouter)
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
