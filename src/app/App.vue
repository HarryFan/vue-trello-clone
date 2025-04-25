<template>
  <div id="app">
    <div>
      <h1 class="is-size-3">任務清單</h1>
      <p class="subtitle is-6">請在輸入框新增清單與卡片。若要輸入更多細節，請按 CMD 或 CTRL + Enter。</p>
    </div>
    <div>
      <board/>
    </div>
  </div>
</template>

<script>
import Board from 'elements/Board'
export default {
  components: {
    Board
  }
}
</script>

<style lang="scss">
  $primary: #B6862C;
  $primary-dark: #8D6E33;
  $primary-light: #FAF6EF;
  $primary-bg: #fff;

  html, body {
    height: 100%;
    background: $primary-bg;
  }

  body {
    padding: 20px;
    background: $primary-bg;
  }

  #app {
    color: $primary-dark;
  }

  h1, .is-size-3 {
    color: $primary;
    letter-spacing: 1px;
  }

  .subtitle {
    color: $primary-dark;
  }

  .button.is-primary {
    background: $primary;
    border-color: $primary-dark;
    color: #222;
    font-weight: bold;
    &:hover, &:focus {
      background: $primary-dark;
      border-color: $primary-dark;
      color: #fff;
    }
    &[disabled],
    &.is-disabled {
      background: #FAF6EF;
      border-color: #FAF6EF;
      color: #bdb76b;
      opacity: 0.7;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
</style>
