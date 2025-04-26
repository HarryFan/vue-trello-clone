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
  $primary-blue: #2c6bed;
  $secondary-blue: #4a90e2;
  $light-blue: #b6d4ff;
  $dark-blue: #1a4894;
  $blue-gray: #f0f4f9;

  html, body {
    height: 100%;
    background: $blue-gray;
  }

  body {
    padding: 20px;
    background: $blue-gray;
  }

  #app {
    color: $dark-blue;
  }

  h1, .is-size-3 {
    color: $primary-blue;
    letter-spacing: 1px;
  }

  .subtitle {
    color: $secondary-blue;
  }

  .button.is-primary {
    background: $primary-blue;
    border-color: $dark-blue;
    color: white;
    font-weight: bold;
    &:hover, &:focus {
      background: $dark-blue;
      border-color: $dark-blue;
      color: white;
    }
    &[disabled],
    &.is-disabled {
      background: $light-blue;
      border-color: $light-blue;
      color: $secondary-blue;
      opacity: 0.7;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
</style>
