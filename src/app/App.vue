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
  html, body {
    height: 100%;
  }

  body {
    padding: 20px;
  }
</style>
