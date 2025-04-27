<template>

  <div class="query-form card">
    <div class="card-content">
      <h2 class="title title-earth">新增任務</h2>
      <ui-input name="title"
                label="標題"
                v-model="title"
                v-validate="'required'"
                :error="getError('title')"
                @enter="validate"
      />
      <ui-input name="description"
                type="textarea"
                label="描述"
                v-model="description"
      />
      <ui-input name="date"
                type="date"
                label="日期"
                v-model="date"
                @enter="validate"
      />
      <!-- 圖片上傳/預覽區塊 -->
      <div class="images">
        <div v-for="imgId in images" :key="imgId" class="image-preview">
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
      <div class="field is-grouped">
        <ui-button type="primary" @click="validate">{{ id ? '更新' : '新增' }}</ui-button>
        <ui-button type="text" @click="cancel">取消</ui-button>
      </div>
    </div>
  </div>

</template>

<script>

function data () {
  return {
    id: null,
    title: '',
    description: '',
    date: null,
    images: [],
    message: '',
  }
}

export default {
  data () {
    return data()
  },

  computed: {
    values () {
      return this.$data
    }
  },

  methods: {
    show (data) {
      Object.assign(this, data)
      this.$el.querySelector('input').focus()
    },

    validate () {
      this.$validator
        .validate()
        .then(state => {
          if (state) {
            return this.submit()
          }
          this.message = '請填寫所有必填欄位！'
        })
    },

    submit () {
      this.$emit('submit', this.values)
      this.reset()
    },

    cancel () {
      this.$emit('cancel', this.values)
      this.reset()
    },

    reset () {
      Object.assign(this, data())
    },

    getError (name) {
      return (this.errors.first(name) || '').replace(/The .+ field/, 'This field')
    },
    // 圖片功能
    getImageFromStorage(imgId) {
      try {
        return localStorage.getItem(`trello_image_${imgId}`)
      } catch (e) {
        return ''
      }
    },
    removeImage(imgId) {
      try {
        localStorage.removeItem(`trello_image_${imgId}`)
      } catch (e) {}
      this.images = this.images.filter(id => id !== imgId)
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
        // 產生一個隨機 id
        const imgId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        try {
          localStorage.setItem(`trello_image_${imgId}`, base64)
          this.images.push(imgId)
        } catch (e) {
          alert('圖片儲存失敗，請檢查瀏覽器空間')
        }
      }
      reader.readAsDataURL(file)
    },
  }
}

</script>

<style scoped lang="scss">
@import '@/../res/assets/styles/index.scss';

.query-form.card {
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(33,150,243,0.08), 0 1.5px 8px rgba(33,150,243,0.06);
  padding: 0 0 12px 0;
  background: #fff !important;
  @media (max-width: 600px) {
    max-width: 98vw;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
  }
}
.card-content {
  padding: 32px 32px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  @media (max-width: 600px) {
    padding: 18px 8px 10px 8px;
    gap: 10px;
  }
}
.title {
  font-size: 1.3em;
  color: #1976d2;
  margin-bottom: 12px;
  @media (max-width: 600px) {
    font-size: 1.1em;
    margin-bottom: 8px;
  }
}
.title-earth {
  color: $color-primary;
  font-weight: bold;
  letter-spacing: 1px;
}
.field.is-grouped {
  gap: 12px;
  margin-top: 12px;
  @media (max-width: 600px) {
    gap: 6px;
    margin-top: 8px;
    flex-direction: column;
    align-items: stretch;
  }
}
.images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
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
</style>
