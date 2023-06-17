<template>
  <canvas class="audio-canvas" id="AudioCanvas" ref="audioCanvas"></canvas>
</template>

<script lang="ts">
import Component from "@/app/components/audioCanvas/audioCanvas";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/audioCanvas/audioCanvas.scss";
</style>