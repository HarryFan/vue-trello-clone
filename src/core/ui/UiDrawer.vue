<template>
  <transition name="drawer-slide">
    <div v-if="active" class="ui-drawer" @keydown.esc="close" tabindex="0">
      <div class="ui-drawer__backdrop" @click="close" />
      <div class="ui-drawer__panel">
        <button class="ui-drawer__close" @click="close" aria-label="關閉詳情面板">
          <i class="fas fa-times"></i>
        </button>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * UiDrawer - 右側滑出的抽屜元件
 * @prop {Boolean} active - 是否顯示
 * @event close - 關閉事件
 */
export default {
  props: {
    active: { type: Boolean, default: false },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.ui-drawer {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: stretch;
}
.ui-drawer__backdrop {
  flex: 1;
  background: rgba(0,0,0,0.2);
}
.ui-drawer__panel {
  width: 420px;
  max-width: 90vw;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.08);
  padding: 32px 24px 24px 24px;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.ui-drawer__close {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.3em;
  color: #888;
  cursor: pointer;
}
.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: opacity 0.2s;
}
.drawer-slide-enter, .drawer-slide-leave-to {
  opacity: 0;
}
</style>
