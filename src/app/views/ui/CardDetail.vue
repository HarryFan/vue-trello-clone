<template>
  <div class="card-detail">
    <div class="card-detail__header">
      <input v-model="editTitle" class="card-detail__title" @blur="saveTitle" @keyup.enter="saveTitle" @keyup.esc="resetTitle" />
      <div class="card-detail__meta">
        <span class="card-detail__list">{{ listTitle }}</span>
        <span v-if="item.date" class="card-detail__date"><i class="far fa-calendar-alt"></i> {{ item.date }}</span>
      </div>
    </div>
    <div class="card-detail__section">
      <label class="card-detail__label">描述</label>
      <textarea v-model="editDesc" class="card-detail__desc" @blur="saveDesc" @keyup.enter="saveDesc" @keyup.esc="resetDesc" rows="3" />
    </div>
    <!-- 可擴展：標籤、成員、附件、核對清單、評論等區塊 -->
  </div>
</template>

<script>
/**
 * CardDetail - 卡片詳情面板（Dialog 內容）
 * @prop {Object} item - 卡片資料
 * @prop {String} listTitle - 所屬列表名稱
 * @event update - { item } 當資料變更時
 */
export default {
  props: {
    item: { type: Object, required: true },
    listTitle: { type: String, default: '' },
  },
  data() {
    return {
      editTitle: this.item.title,
      editDesc: this.item.description || '',
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(val) {
        this.editTitle = val.title
        this.editDesc = val.description || ''
      },
    },
  },
  methods: {
    saveTitle() {
      if (this.editTitle !== this.item.title) {
        this.$emit('update', { ...this.item, title: this.editTitle })
      }
    },
    resetTitle() {
      this.editTitle = this.item.title
    },
    saveDesc() {
      if (this.editDesc !== this.item.description) {
        this.$emit('update', { ...this.item, description: this.editDesc })
      }
    },
    resetDesc() {
      this.editDesc = this.item.description || ''
    },
  },
}
</script>

<style lang="scss" scoped>
.card-detail {
  $primary-blue: #2c6bed;
  $secondary-blue: #4a90e2;
  $light-blue: #b6d4ff;
  $dark-blue: #1a4894;
  $blue-gray: #f0f4f9;

  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 340px;
  max-width: 520px;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  @media (max-width: 600px) {
    min-width: 0;
    max-width: 98vw;
    padding: 0 4vw;
    gap: 14px;
  }

  &__header {
    border-bottom: 1px solid $light-blue;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 1.2em;
    font-weight: bold;
    border: none;
    width: 100%;
    margin-bottom: 6px;
    background: transparent;
    outline: none;
    color: $dark-blue;
    @media (max-width: 600px) {
      font-size: 1em;
    }
  }

  &__meta {
    font-size: 0.9em;
    color: $secondary-blue;
    display: flex;
    gap: 16px;
    @media (max-width: 600px) {
      font-size: 0.85em;
      gap: 8px;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 0.95em;
    color: $secondary-blue;
  }

  &__desc {
    width: 100%;
    min-height: 60px;
    border: 1px solid $light-blue;
    border-radius: 4px;
    padding: 8px;
    font-size: 1em;
    resize: vertical;
    background: white;
    color: $dark-blue;
    &:focus {
      border-color: $primary-blue;
      outline: none;
    }
    @media (max-width: 600px) {
      font-size: 0.95em;
      padding: 6px;
    }
  }
}
</style>
