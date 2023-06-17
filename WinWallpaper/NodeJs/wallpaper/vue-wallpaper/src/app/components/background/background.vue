<template >
  <div class="background" id="background">
    <template v-for="(item, index) in show.list" :key="index">
      <img
        :src="item.path"
        :class="item.class"
        width="100%"
        height="100%"
        @load="load(isInit)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/background/background";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scope>
@import "@/app/components/background/background.scss";
</style>
