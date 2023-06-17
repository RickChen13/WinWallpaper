<template>
  <div
    class="modules"
    v-show="params.musicPlayer.show"
    id="musicPlayer"
    style="z-index: 999; pointer-events: unset"
  >
    <div class="modules-div music-main" :style="mpStyle">
      <div class="container">
        <div class="audio">
          <div class="music-name">
            <span v-html="musicName"></span>
          </div>
          <!-- <div class="barbox">
            <div
              class="progressall"
              id="progressall"
              @click="musicGoto($event)"
            >
              <div class="progresscurrent" id="progresscurrent"></div>
            </div>
          </div> -->
          <div class="time">
            <span class="runTime" v-text="runTime"></span> /
            <span class="allTime" v-text="allTime"></span>
          </div>
          <div class="btn-div">
            <!-- 目录 -->
            <button @click="listShowCilck()">
              <i class="bi bi-list-ul" title="目录列表"></i>
            </button>
            <!-- 上一曲 -->
            <button @click="prev()"><i class="bi bi-skip-start"></i></button>
            <!-- 暂停/播放 -->
            <button @click="controls()">
              <i :class="isPlaying ? `bi bi-pause` : `bi bi-play`"></i>
            </button>
            <!-- 下一曲 -->
            <button @click="next()"><i class="bi bi-skip-end"></i></button>
            <!-- 播放列表 -->
            <button @click="playListCilck()">
              <i class="bi bi-music-note-list" title="播放列表"></i>
            </button>
          </div>
          <!-- <audio id="musicAudio" :src="src"></audio> -->
        </div>
        <!-- 目录 -->
        <div v-show="listShow">
          <ul class="music-list">
            <template v-for="(item, i) in dirs" :key="i">
              <li @click="goto(item.path)">
                <span v-html="item.name"></span>
              </li>
            </template>

            <template v-for="(item, i) in files" :key="i">
              <li
                @mousedown="filesListMousedown()"
                @mouseup="filesListMouseup(i)"
                :title="item.name"
              >
                <span v-html="item.name"></span>
              </li>
            </template>
          </ul>
        </div>
        <!-- 播放列表 -->
        <div v-show="playListShow">
          <ul class="music-list">
            <template v-for="(item, i) in playList" :key="i">
              <li
                :class="item.class"
                @mousedown="playListMousedown(i)"
                @mouseup="playListMouseup(i)"
                :title="item.name"
                :id="`music-${i}`"
              >
                <span v-html="item.name"></span>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/musicPlayer/MusicPlayer";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/musicPlayer/MusicPlayer.scss";
</style>