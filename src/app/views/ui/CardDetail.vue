<template>
  <div class="card-detail">
    <div class="card-detail__header">
      <input v-model="editTitle" class="card-detail__title" @blur="saveTitle" @keyup.enter="saveTitle" @keyup.esc="resetTitle" />
      <button class="close-btn" @click="onCloseClick" title="關閉">&times;</button>
      <div class="card-detail__meta">
        <span class="card-detail__list">{{ listTitle }}</span>
        <span v-if="item.date" class="card-detail__date"><i class="far fa-calendar-alt"></i> {{ item.date }}</span>
      </div>
    </div>
    <div class="card-detail__section">
      <label class="card-detail__label">描述</label>
      <textarea v-model="editDesc" class="card-detail__desc" @blur="saveDesc" @keyup.enter="saveDesc" @keyup.esc="resetDesc" rows="3" />
    </div>
    <!-- 圖片上傳/預覽區塊 -->
    <div class="card-detail__section">
      <label class="card-detail__label">圖片</label>
      <div class="images">
        <div v-for="imgId in editImages" :key="imgId" class="image-preview">
          <img :src="getImageFromStorage(imgId)" alt="Task image" />
          <button class="delete is-small" @click="removeImage(imgId)"></button>
        </div>
        <div class="image-upload">
          <input type="file" ref="fileInput" accept="image/*" @change="onImageUpload" style="display:none" />
          <button class="button is-info is-light" @click="$refs.fileInput.click()">
            <span class="icon"><i class="fas fa-upload"></i></span>
            <span>上傳圖片</span>
          </button>
        </div>
      </div>
    </div>
    <!-- 細項清單區塊 -->
    <div class="card-detail__section">
      <label class="card-detail__label">細項</label>
      <div class="subitems">
        <div v-for="(sub, idx) in editSubItems" :key="sub.id" class="subitem-row">
          <input type="checkbox" v-model="sub.isCompleted" @change="onSubItemToggle(idx)" />
          <span :class="{ 'completed': sub.isCompleted }">{{ sub.text }}</span>
        </div>
        <div class="subitem-add">
          <input v-model="newSubItemText" @keyup.enter="addSubItem" placeholder="新增細項..." />
          <button class="button is-small is-info" @click="addSubItem" :disabled="!newSubItemText.trim()">新增</button>
        </div>
      </div>
    </div>
    <div class="card-detail__footer">
      <button class="button is-primary" @click="onConfirmClick">確認</button>
    </div>
  </div>
</template>

<script>
import { saveImageToStorage, getImageFromStorage, removeImageFromStorage } from 'app/utils/data'
export default {
  props: {
    item: { type: Object, required: true },
    listTitle: { type: String, default: '' },
  },
  data() {
    return {
      editTitle: this.item.title,
      editDesc: this.item.description || '',
      editImages: this.item.images ? [...this.item.images] : [],
      editSubItems: this.item.subItems ? JSON.parse(JSON.stringify(this.item.subItems)) : [],
      newSubItemText: '',
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(val) {
        this.editTitle = val.title
        this.editDesc = val.description || ''
        this.editImages = val.images ? [...val.images] : []
        this.editSubItems = val.subItems ? JSON.parse(JSON.stringify(val.subItems)) : []
        this.newSubItemText = ''
      },
    },
  },
  methods: {
    onCloseClick() {
      console.log('[CardDetail] 關閉按鈕被點擊')
      this.$emit('close')
    },
    onConfirmClick() {
      this.emitUpdate()
      this.$emit('close')
    },
    saveTitle() {
      if (this.editTitle !== this.item.title) this.emitUpdate()
    },
    resetTitle() {
      this.editTitle = this.item.title
    },
    saveDesc() {
      if (this.editDesc !== this.item.description) this.emitUpdate()
    },
    resetDesc() {
      this.editDesc = this.item.description || ''
    },
    emitUpdate() {
      this.$emit('update', {
        ...this.item,
        title: this.editTitle,
        description: this.editDesc,
        images: this.editImages,
        subItems: this.editSubItems,
        updatedAt: new Date().toISOString(),
      })
    },
    // 圖片功能
    getImageFromStorage(imgId) {
      return getImageFromStorage(imgId)
    },
    removeImage(imgId) {
      removeImageFromStorage(imgId)
      this.editImages = this.editImages.filter(id => id !== imgId)
      this.emitUpdate()
    },
    onImageUpload(e) {
      const file = e.target.files[0]
      if (!file) return
      if (file.size > 1024 * 1024) {
        alert('圖片大小不能超過 1MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (evt) => {
        const base64 = evt.target.result
        const imgId = saveImageToStorage(base64)
        if (imgId) {
          this.editImages.push(imgId)
          this.emitUpdate()
        }
      }
      reader.readAsDataURL(file)
    },
    // 細項功能
    onSubItemToggle(idx) {
      this.editSubItems[idx].isCompleted = !this.editSubItems[idx].isCompleted
      this.emitUpdate()
    },
    addSubItem() {
      const text = this.newSubItemText.trim()
      if (!text) return
      this.editSubItems.push({ id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5), text, isCompleted: false })
      this.newSubItemText = ''
      this.emitUpdate()
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
    position: relative;
    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      font-size: 2em;
      color: #aaa;
      cursor: pointer;
      line-height: 1;
      padding: 0 8px;
      transition: color 0.2s;
      &:hover {
        color: #e57373;
      }
    }
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
    margin-bottom: 10px;
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
  // 圖片樣式
  .images {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    .image-preview {
      position: relative;
      width: 80px;
      height: 80px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
      .delete {
        position: absolute;
        top: 3px;
        right: 3px;
        z-index: 2;
      }
    }
    .image-upload {
      display: flex;
      align-items: center;
      .button {
        padding: 0.4em 1.1em;
        font-size: 0.95em;
      }
    }
  }
  // 細項樣式
  .subitems {
    display: flex;
    flex-direction: column;
    gap: 6px;
    .subitem-row {
      display: flex;
      align-items: center;
      gap: 8px;
      .completed {
        text-decoration: line-through;
        color: #bbb;
      }
    }
    .subitem-add {
      display: flex;
      gap: 6px;
      margin-top: 6px;
      input {
        flex: 1;
        min-width: 0;
      }
    }
  }
  &__footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    .button.is-primary {
      min-width: 90px;
      font-size: 1.1em;
    }
  }
}
</style>
