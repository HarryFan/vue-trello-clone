# Vue Trello Clone

A simple Trello clone in Vue, Vuex and Bulma

![screenshot](docs/screenshot.png)


## Features

Trello features

- Single board
- Re-orderable lists and tasks

Task functionality

- Title, description, date
- Quick entry and full entry modal
- Icons and colors to indicate due and overdue items
- Editable tasks

UI features

- Fast keyboard interaction
- Smooth animation

State management

- Vuex state management
- Persistence


## Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit
npm run unit:watch

# run all tests
npm test
```

## Quick start

Once running in the browser, you can execute the following in the console to create the above layout:

```js
function days (num) { return new Date(Date.now() + (1000 * 60 * 60 * 24 * num)) }
store.dispatch('setLists', [ { title:'To do', items:[ { title:'Washing up', date:days(-5) }, { title:'Buy new suit', description:'Need to get this in time for the wedding!', date:days(2) }, { title:'Go to wedding', description:'', date:days(10) }, { title:'Go shopping' }, { title:'Post on Twitter about Trello clone' } ] }, { title:'Doing', items:[ { title:'Take Trello screenshot' }, { title:'Publish Trello readme' } ] }, { title:'Done', items:[ { title:'Build Trello clone', description:'Use Vue, Vuex, Vue Smooth Dnd and Bulma' } ] } ])
```

---

## 部署與正式環境啟動指南

### 1. 取得專案原始碼

```bash
git pull
```
> 若尚未 clone，請改用：
> ```bash
> git clone <專案 Git 倉庫網址>
> cd <專案資料夾>
> ```

### 2. 安裝相依套件

```bash
npm install
```

### 3. 建置正式版靜態檔案

```bash
npm run build
```

### 4. 啟動本地正式伺服器預覽

```bash
npx serve -s dist
```
- 預設網址：http://localhost:5000（或終端機顯示的 port）
- 請用瀏覽器開啟該網址預覽正式網站

### 5. 注意事項
- 請勿直接用「Open with Live Server」或 file:// 開啟 dist/index.html，這樣無法正確預覽 SPA 網站。
- 若要部署到正式主機，只需將 dist 資料夾內容上傳至 Web 伺服器（如 Nginx、Apache、雲端空間等）。
- 如有任何問題，請聯絡開發人員協助。

---
