<template>
  <div class="board-container">
    <div class="board">

      <div class="clear-button">
        <ui-button :disabled="lists.length === 0" @click="reset">清空</ui-button>
      </div>

      <div class="lists-container">

        <Container
          lock-axis="x"
          :orientation="containerOrientation"
          drag-handle-selector=".list-drag-handle"
          @drop="onListDrop"
        >
          <Draggable v-for="(list, listIndex) in lists" :key="list.id">
            <section class="list-container" ref="list" :data-id="list.id">

              <div class="list-header">
                <span class="list-drag-handle">&#x2630;</span>
                <span class="list-title">{{ list.title }}</span>
                <span class="list-delete" title="刪除此清單" @click="deleteList(list.id)">
                  <i class="fas fa-trash-alt"></i>
                </span>
              </div>

              <Container
                group-name="list"
                drag-class="card-ghost"
                drop-class="card-ghost-drop"
                non-drag-area-selector=".icon"
                :animation-duration="100"
                @drop="e => onCardDrop(e, list, listIndex)"
              >
                <Draggable v-for="item in list.items" :key="item.id">
                  <Card :item="item" @edit="editItem" @delete="deleteItem(list.id, item.id)"/>
                </Draggable>

              </Container>

              <div class="item-entry">
                <ui-item-entry :list-id="list.id"
                               placeholder="新增卡片"
                               icon="ellipsis-h"
                               @enter="onAddItem"/>
              </div>

            </section>

          </Draggable>

        </Container>

        <div class="new-list">
          <ui-item-entry placeholder="新增清單" @enter="onAddList"/>
        </div>
      </div>

    </div>

    <ui-modal :active="detailModal" :cancellable="1" @close="hideDetailModal">
      <CardDetail v-if="detailItem" :item="detailItem" :list-title="detailListTitle" @update="updateDetailItem" />
    </ui-modal>

    <ui-modal ref="modal"
              :active="modal"
              :cancellable="1"
              @close="hideModal"
    >
      <UiItemForm ref="form"
                  @submit="onAddFullItem"
                  @cancel="hideModal"/>
    </ui-modal>

  </div>

</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'

import Card from './Card'
import UiItemForm from '../ui/UiItemForm'
import UiItemEntry from '../ui/UiItemEntry'
import CardDetail from '../ui/CardDetail'
import { makeDropHandler } from '../../utils/plugins'

export default {
  components: {
    Container,
    Draggable,
    UiItemEntry,
    UiItemForm,
    Card,
    CardDetail,
  },

  data: function () {
    return {
      modal: false,
      activeListId: null,
      detailModal: false,
      detailItem: null,
      detailListTitle: '',
      containerOrientation: window.innerWidth <= 600 ? 'vertical' : 'horizontal',
    }
  },

  computed: {
    lists () {
      return this.$store.state.board.lists
    }
  },

  mounted() {
    window.addEventListener('resize', this.updateOrientation)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateOrientation)
  },

  methods: {
    onAddList ({ text }) {
      this.$store.commit('addList', { title: text })
      this.$nextTick(() => {
        const lists = this.$refs.list
        lists[lists.length - 1]
          .querySelector('input')
          .focus()
      })
    },

    onAddItem ({ id, text, more }) {
      if (more) {
        this.activeListId = id
        this.modal = true
        this.showModal({ title: text })
        return
      }
      this.addItem(id, text)
    },

    onAddFullItem (item) {
      item.id
        ? this.$store.commit('updateItem', { itemId: item.id, ...item })
        : this.addItem(this.activeListId, item.title, item.description, item.date)
      this.hideModal()
    },

    addItem (listId, title, description, date) {
      this.$store.commit('addItem', { listId, title, description, date })
    },

    editItem (item) {
      // 找到所屬列表名稱
      const list = this.lists.find(l => l.items.find(i => i.id === item.id))
      this.detailListTitle = list ? list.title : ''
      this.detailItem = { ...item }
      this.detailModal = true
    },

    showModal (item) {
      this.modal = true
      this.$nextTick(() => {
        this.$refs.form.show(item)
      })
    },

    hideDetailModal () {
      this.detailModal = false
      this.detailItem = null
    },

    updateDetailItem (item) {
      this.$store.commit('updateItem', { itemId: item.id, ...item })
      this.detailItem = { ...item }
    },

    hideModal () {
      this.focusInput(this.activeListId)
      this.modal = false
    },

    focusInput (listId) {
      const index = this.lists.findIndex(list => list.id === listId)
      if (index > -1) {
        this.$refs.list[index].querySelector('input').focus()
      }
    },

    onListDrop: makeDropHandler('onListDropComplete'),

    onListDropComplete: function (src, trg) {
      this.$store.commit('moveList', [src.index, trg.index])
    },

    onCardDrop: makeDropHandler('onCardDropComplete'),

    onCardDropComplete (src, trg, element, payload) {
      this.$store.commit('moveItem', [
        src.params[1],
        src.index,
        trg.params[1],
        trg.index,
      ])
    },

    reset () {
      if (confirm('確定要清空看板嗎？')) {
        this.$store.commit('reset')
      }
    },

    deleteItem(listId, itemId) {
      if (confirm('確定要刪除此任務嗎？')) {
        this.$store.commit('removeItem', { itemId })
      }
    },

    deleteList(listId) {
      if (confirm('確定要刪除此清單（底下所有任務將一併刪除）？')) {
        this.$store.commit('removeList', { listId })
      }
    },

    updateOrientation() {
      this.containerOrientation = window.innerWidth <= 600 ? 'vertical' : 'horizontal'
    },
  }
}
</script>

<style lang="scss">
  .board {
    padding:0 1px;
    margin-top: 20px;
    white-space: nowrap;
    position: relative;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    > * {
      display: inline-block;
    }
    @media (max-width: 900px) {
      margin-top: 10px;
    }
    @media (max-width: 600px) {
      white-space: normal;
      display: block;
      overflow-x: visible;
      margin-top: 6px;
      padding: 0 2vw;
    }
  }

  $column-width: 320px;
  $column-width-mobile: 85vw;

  .list-container {
    width: $column-width;
    min-width: 220px;
    max-width: 100vw;
    padding: 10px;
    margin: 5px;
    margin-right: 20px;
    background-color: #f3f3f3;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
    border-radius: 8px;
    @media (max-width: 600px) {
      width: $column-width-mobile;
      min-width: 0;
      margin: 12px 0 18px 0;
      border-radius: 8px;
      box-shadow: 0 1.5px 8px rgba(33,150,243,0.10);
      padding: 10px 6px 16px 6px;
      background: #f7fbff;
      border: 1.5px solid #e0f2ff;
    }
  }

  .lists-container {
    > * {
      display: inline-block;
      vertical-align: top;
    }
    @media (max-width: 600px) {
      display: block;
      > * {
        display: block;
        width: 100%;
        margin-right: 0;
      }
    }
  }

  .list-header {
    margin-bottom: 5px;
    font-size: 18px;
    @media (max-width: 600px) {
      font-size: 1.1em;
      font-weight: bold;
      color: #1976d2;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .list-delete {
      float: right;
      cursor: pointer;
      color: #ccc;
      &:hover {
        color: #f44336;
      }
    }
  }

  .card {
    margin: 5px;
    background-color: white;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
    padding: 10px;
    border-radius: 6px;
    @media (max-width: 600px) {
      margin: 8px 0;
      padding: 12px 8px;
      box-shadow: 0 1px 4px rgba(33,150,243,0.10);
      border-radius: 6px;
      border: 1px solid #e0f2ff;
    }
  }

  .item-entry {
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid #DDD;
    @media (max-width: 600px) {
      padding-top: 6px;
      margin-top: 6px;
      border-top: none;
    }
  }

  .new-list {
    width: $column-width;
    margin-left: -10px;
    @media (max-width: 900px) {
      width: 220px;
      margin-left: -5px;
    }
    @media (max-width: 600px) {
      width: $column-width-mobile;
      margin-left: 0;
    }
  }

  .clear-button {
    position: absolute;
    top: 20px;
    right: 20px;
    @media (max-width: 600px) {
      position: static;
      margin-bottom: 10px;
      width: 100%;
      text-align: right;
    }
  }

  .card-ghost {
    transition: 0.25s all;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
    transform: scale(1.1);
  }

  .card-ghost-drop {
    transform: scale(1);
  }

  .list-drag-handle {
    cursor: move;
    padding: 5px;
  }
</style>
