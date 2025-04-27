<template>

  <div class="modal" :class="{'is-active': active}">
    <div class="modal-background" @mousedown="cancel"></div>
    <div class="modal-content">
      <slot v-on="$listeners"></slot>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    active: Boolean,
    cancellable: [Number, Boolean],
  },

  mounted () {
    window.addEventListener('keydown', this.onKeyDown)
  },

  destroyed () {
    window.removeEventListener('keydown', this.onKeyDown)
  },

  methods: {
    cancel () {
      if (this.cancellable) {
        this.close()
      }
    },

    close () {
      this.$emit('close')
    },

    onKeyDown (event) {
      if (event.key === 'Escape') {
        this.cancel()
      }
    }
  }
}

</script>

<style lang="scss" scoped>
@import '@/../res/assets/styles/index.scss';

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba($color-black, 0.12), 0 1.5px 8px rgba($color-primary, 0.08);
  color: $text-primary;
  padding: 2em 2.5em;
  border: 1px solid $color-grey;
  min-width: 340px;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-background {
  background: rgba(0,0,0,0.35);
}
</style>
