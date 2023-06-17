<template>
  <div class="modules" id="doublePY" v-show="params.doublePY.show">
    <div class="ms-dou-py-container" :style="msStyle">
      <template v-for="(PyRow, DataIndex) in data" :key="DataIndex">
        <div class="row">
          <template
            v-for="(PyButton, PyButtonIndex) in PyRow.button"
            :key="PyButtonIndex"
          >
            <div>
              <div class="left" :style="leftStyle">
                <div v-text="PyButton.left.value"></div>
              </div>
              <div class="right" :style="rightStyle">
                <template
                  v-for="(PyRight, PyRightIndex) in PyButton.right"
                  :key="PyRightIndex"
                >
                  <div v-html="PyRight.value"></div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/doublePY/DoublePY";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/doublePY/DoublePY.scss";
</style>