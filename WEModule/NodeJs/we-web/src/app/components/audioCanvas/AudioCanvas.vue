<template>
  <canvas class="audio-canvas" id="AudioCanvas" ref="audioCanvas"></canvas>
</template>

<script lang="ts">
import Component from "./AudioCanvas";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@use "./AudioCanvas.scss";
</style>