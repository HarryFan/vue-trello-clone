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
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 340px;
  max-width: 520px;
  width: 100%;
  box-sizing: border-box;
  @media (max-width: 600px) {
    min-width: 0;
    max-width: 98vw;
    padding: 0 4vw;
    gap: 14px;
  }
}
.card-detail__header {
  border-bottom: 1px solid #FFF9C4;
  margin-bottom: 12px;
}
.card-detail__title {
  font-size: 1.2em;
  font-weight: bold;
  border: none;
  width: 100%;
  margin-bottom: 6px;
  background: transparent;
  outline: none;
  color: #C7A600;
  @media (max-width: 600px) {
    font-size: 1em;
  }
}
.card-detail__meta {
  font-size: 0.9em;
  color: #FFD600;
  display: flex;
  gap: 16px;
  @media (max-width: 600px) {
    font-size: 0.85em;
    gap: 8px;
  }
}
.card-detail__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card-detail__label {
  font-size: 0.95em;
  color: #FFD600;
}
.card-detail__desc {
  width: 100%;
  min-height: 60px;
  border: 1px solid #FFF9C4;
  border-radius: 4px;
  padding: 8px;
  font-size: 1em;
  resize: vertical;
  background: #FFFDE7;
  color: #C7A600;
  @media (max-width: 600px) {
    font-size: 0.95em;
    padding: 6px;
  }
}
</style>
