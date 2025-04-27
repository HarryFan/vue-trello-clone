<template>

  <div class="card" :class="classes" :data-id="item.id">
    <div class="icons">
      <span v-if="isDue" class="icon icon-due has-text-warning" :title="`Item is due on ${item.date}`">
        <i class="fas fa-star"></i>
      </span>
      <span v-else-if="timestamp" class="icon icon-date" :title="`Item is due on ${item.date}`">
        <i class="far fa-bell"></i>
      </span>
      <span class="icon icon-edit" @click="edit">
        <i class="fas fa-edit"></i>
      </span>
      <span class="icon icon-delete" @click.stop="deleteItem" title="刪除任務">
        <i class="fas fa-trash-alt"></i>
      </span>
    </div>
    <div>
      <p class="item-title">{{ item.title }}</p>
      <p class="item-description" v-if="item.description">{{ item.description }}</p>
      <p class="item-timestamp" v-if="item.updatedAt && item.updatedAt !== item.createdAt">
        <span class="timestamp-label">更新：</span>
        <span class="timestamp-value">{{ formatCreatedAt(item.updatedAt) }}</span>
      </p>
      <p class="item-timestamp" v-else-if="item.createdAt">
        <span class="timestamp-label">建立：</span>
        <span class="timestamp-value">{{ formatCreatedAt(item.createdAt) }}</span>
      </p>
    </div>
  </div>

</template>

<script>

export default {
  props: {
    item: Object
  },

  computed: {
    classes () {
      return {
        'is-due': this.isDue,
        'is-overdue': this.isOverdue,
      }
    },

    timestamp () {
      return Number(new Date(this.item.date))
    },

    isOverdue () {
      return this.timestamp && this.timestamp < Date.now()
    },

    isDue () {
      const date = this.timestamp
      const due = date - (1000 * 60 * 60 * 24) * 3
      const now = Date.now()
      return date > now && now > due
    },
  },

  methods: {
    edit () {
      this.$emit('edit', this.item)
    },
    deleteItem () {
      this.$emit('delete', this.item)
    },
    formatCreatedAt (createdAt) {
      // 顯示 yyyy/MM/dd HH:mm
      if (!createdAt) return ''
      const d = new Date(createdAt)
      const yyyy = d.getFullYear()
      const mm = (d.getMonth() + 1).toString().padStart(2, '0')
      const dd = d.getDate().toString().padStart(2, '0')
      const hh = d.getHours().toString().padStart(2, '0')
      const min = d.getMinutes().toString().padStart(2, '0')
      return `${yyyy}/${mm}/${dd} ${hh}:${min}`
    }
  }
}

</script>

<style lang="scss" scoped>
  .card {
    position: relative;
    border-radius: 3px;
    cursor: default;
  }

  .item-description {
    font-size: 0.7em;
  }

  .item-timestamp {
    font-size: 0.68em;
    color: #8a8a8a;
    margin-top: 2px;
    .timestamp-label {
      font-weight: bold;
      color: #b0b0b0;
    }
    .timestamp-value {
      font-family: monospace;
    }
  }

  .icons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;
    z-index: 2;
  }

  .is-overdue {
    color: red;
    border: 1px solid red;
  }

  .card:hover {
    .icon-due,
    .icon-date {
      display: none;
    }
  }

  .icon-edit, .icon-date {
    color: #DDD;
  }

  .icon-edit, .icon-delete {
    display: none;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    font-size: 1.1em;
    background: transparent;
    border: none;
    box-shadow: none;
    margin: 0;
    padding: 0;
  }

  .icon-edit {
    color: #b0b0b0;
    margin-right: 0;
  }

  .icon-delete {
    color: #e57373;
    margin-left: 2px;
    transition: color 0.2s;
  }

  .icon-delete:hover {
    color: #c62828;
  }

  .card:hover .icon-edit,
  .card:hover .icon-delete {
    display: flex;
  }

  @media (max-width: 600px) {
    .icons {
      top: 7px;
      right: 7px;
      gap: 0.3em;
    }
    .icon-edit, .icon-delete {
      width: 20px;
      height: 20px;
      font-size: 1em;
    }
  }
</style>
