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

    <!-- 子任務區塊 -->
    <div class="card-detail__section">
      <label class="card-detail__label">子任務</label>
      <div class="subtasks">
        <div v-for="sub in editSubItems" :key="sub.id" class="subtask">
          <label>
            <input type="checkbox" v-model="sub.isCompleted" @change="emitUpdate" />
            <span :class="{ 'is-completed': sub.isCompleted }">{{ sub.text }}</span>
          </label>
          <button class="delete is-small" @click="removeSubItem(sub.id)"></button>
        </div>
        <div class="add-subtask">
          <input v-model="newSubTask" class="input" placeholder="新增子任務..." @keyup.enter="addSubTask" />
        </div>
      </div>
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
  </div>
</template>

<script>
import { makeSubItem, saveImageToStorage, getImageFromStorage, removeImageFromStorage } from 'app/utils/data'
export default {
  props: {
    item: { type: Object, required: true },
    listTitle: { type: String, default: '' },
  },
  data() {
    return {
      editTitle: this.item.title,
      editDesc: this.item.description || '',
      editSubItems: this.item.subItems ? [...this.item.subItems] : [],
      editImages: this.item.images ? [...this.item.images] : [],
      newSubTask: '',
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(val) {
        this.editTitle = val.title
        this.editDesc = val.description || ''
        this.editSubItems = val.subItems ? [...val.subItems] : []
        this.editImages = val.images ? [...val.images] : []
      },
    },
  },
  methods: {
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
    addSubTask() {
      const text = this.newSubTask.trim()
      if (text) {
        this.editSubItems.push(makeSubItem(text))
        this.newSubTask = ''
        this.emitUpdate()
      }
    },
    removeSubItem(id) {
      this.editSubItems = this.editSubItems.filter(i => i.id !== id)
      this.emitUpdate()
    },
    emitUpdate() {
      this.$emit('update', {
        ...this.item,
        title: this.editTitle,
        description: this.editDesc,
        subItems: this.editSubItems,
        images: this.editImages,
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
  // 子任務樣式
  .subtasks {
    display: flex;
    flex-direction: column;
    gap: 5px;
    .subtask {
      display: flex;
      align-items: center;
      label {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 6px;
        .is-completed {
          text-decoration: line-through;
          color: #888;
        }
      }
      .delete {
        margin-left: 8px;
      }
    }
    .add-subtask {
      margin-top: 4px;
      .input {
        width: 100%;
        font-size: 0.95em;
      }
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
}
</style>
