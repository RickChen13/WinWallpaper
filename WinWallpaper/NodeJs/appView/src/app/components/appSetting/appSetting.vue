<template>
  <div class="app-setting">
    <template v-if="title != ''">
      <div class="title">
        <div class="name">
          <h3>{{ title }}</h3>
        </div>
        <div class="image">
          <n-image
            width="150"
            height="150"
            :src="imgSrc"
            fallback-src="./07akioni.jpeg"
          />
        </div>
      </div>
      <hr />
    </template>

    <div class="config">
      <template v-for="value in properties" :key="value.setTingsId">
        <div v-if="value.show">
          <template v-if="value.type == 'text'">
            <div v-html="value.text"></div>
          </template>
          <template v-if="value.type == 'textinput'">
            <div class="setting-row">
              <div class="setting-left">
                <span v-html="value.text"></span>
              </div>
              <div class="setting-right">
                <input
                  type="text"
                  :value="value.value"
                  @keyup.enter="textInput($event, value)"
                  @blur="textInput($event, value)"
                  @change="textInput($event, value)"
                />
              </div>
            </div>
          </template>
          <template v-if="value.type == 'chcekbook'">
            <div class="setting-row">
              <div class="setting-left">
                <span v-html="value.text"></span>
              </div>
              <div class="setting-right chcekbook">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="value.value"
                  @click="checkbookInput($event, value)"
                />
              </div>
            </div>
          </template>
          <template v-if="value.type == 'color'">
            <div class="setting-row">
              <div class="setting-left">
                <span v-html="value.text"></span>
              </div>
              <div class="setting-right color">
                <input
                  type="color"
                  :value="value.value"
                  @change="colorInput($event, value)"
                />
              </div>
            </div>
          </template>
          <template v-if="value.type == `select`">
            <div class="setting-row">
              <div class="setting-left">
                <span v-html="value.text"></span>
              </div>
              <div class="setting-right select">
                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    v-text="value.options[value.value].label"
                  ></button>
                  <ul
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <template
                      v-for="(val, index) in value.options"
                      :key="index"
                    >
                      <li>
                        <a
                          @click="select(value, val.value)"
                          class="dropdown-item"
                          v-text="val.label"
                        ></a>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
          </template>
          <template v-if="value.type == 'slider'">
            <div class="setting-row">
              <div class="setting-left">
                <span v-html="value.text"></span>
              </div>
              <div class="setting-right slider">
                <div class="range">
                  <input
                    type="range"
                    class="form-range"
                    :min="value.min"
                    :max="value.max"
                    :value="value.value"
                    step="1"
                    @input="sliderInput($event, value)"
                  />
                </div>
                <div
                  @dblclick="$event.target.disabled = false"
                  @blur="sliderInput($event, value)"
                  class="text"
                >
                  <input
                    type="text"
                    :value="value.value"
                    disabled="disabled"
                    @keyup.enter="sliderInput($event, value, true)"
                    @blur="sliderInput($event, value, true)"
                  />
                </div>
              </div>
            </div>
          </template>
          <br />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Component from "@/app/components/appSetting/appSetting";
const components = new Component();
export default components.vue();
</script>

<style lang="scss" scoped>
@import "@/app/components/appSetting/appSetting.scss";
</style>