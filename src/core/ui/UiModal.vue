<template>

  <div class="modal" :class="{'is-active': active}">
    <div class="modal-background" @mousedown="cancel"></div>
    <div class="modal-content">
      <slot></slot>
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

<style lang="scss">
.modal-content {
  background: #fff !important;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(33,150,243,0.08), 0 1.5px 8px rgba(33,150,243,0.06);
  padding: 32px 24px 24px 24px;
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
