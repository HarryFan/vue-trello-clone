<template>

  <div class="query-form card">
    <div class="card-content">
      <h2 class="title">新增任務</h2>
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
    }
  }
}

</script>

<style lang="scss">

</style>
