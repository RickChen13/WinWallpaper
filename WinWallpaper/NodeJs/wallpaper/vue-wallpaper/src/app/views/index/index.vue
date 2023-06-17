<template>
  <AudioCanvas ref="audioCanvas" />
  <Background ref="background" />
  <Date ref="date" />
  <DoublePY ref="doublePY" />
  <Monitro ref="monitro" />
  <MusicPlayer ref="musicPlayer" />
  <Weather ref="weather" />
  <NetWorkSeppkMonitor ref="netWorkSeppkMonitor" />
  <Danmaku ref="danmaku" v-if="params.danmaku.show" />
</template>

<script lang="ts">
import Component from "@/app/views/index/index";
const components = new Component();
export default components.vue();
</script>
