<template>
  <div class="item">
    <i
      @click="settingHanlder"
      class="material-icons">{{option.icon}}</i>
    <transition name="top">
    <div
      v-if="visible"
      class="setting dialog">
      <Searches/>
      <Featrues/>
      <Background/>
      <More/>
      <div class="bottom">
        <span
          class="button"
          @click.stop="close">忽略</span>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import Searches from './searches.vue'
import Featrues from './featrues.vue'
import Background from './background.vue'
import More from './more.vue'

export default {
  props: {
    option: {
      type: Object,
      require: true
    },
    visible: {
      type: Boolean,
      require: true
    }
  },
  components: {
    Searches,
    Featrues,
    Background,
    More
  },
  methods: {
    close() {
      this.$emit('close', 'setting')
    },
    settingHanlder() {
      this.$emit('settingHandler')
    }
  }
}
</script>
