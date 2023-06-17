<template>
  <div class="apps" id="apps">
    <div class="apps-main">
      <template v-for="(item, index) in appList" :key="index">
        <div
          class="apps-app"
          :style="appsAppStyle"
          v-on:dblclick="changeApp(item)"
          @contextmenu="showContextMenu($event, index)"
        >
          <div class="apps-app-img">
            <n-image
              width="150"
              height="150"
              :src="item.path + '\\' + item.config.preview"
              fallback-src="./07akioni.jpeg"
            />
          </div>
          <div class="apps-app-title">
            <span v-text="item.config.title"></span>
          </div>
        </div>
      </template>

      <n-dropdown
        placement="bottom-start"
        trigger="manual"
        :x="xRef"
        :y="yRef"
        :options="ContextMenu"
        :show="showDropdownRef"
        :on-clickoutside="onClickoutside"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/apps/apps";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/apps/apps.scss";
</style>