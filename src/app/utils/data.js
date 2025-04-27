const uuidv1 = require('uuid/v1')

// 子任務物件工廠
export function makeSubItem(text, isCompleted = false, id = null) {
  return {
    id: id || uuidv1(),
    text,
    isCompleted
  }
}

// 卡片物件工廠，支援建立/更新時間、子任務、圖片
export function makeItem(
  title,
  description = '',
  date = null,
  subItems = [],
  images = [],
  id = null,
  createdAt = null,
  updatedAt = null
) {
  const now = new Date().toISOString()
  return {
    id: id || uuidv1(),
    title,
    description,
    date,
    subItems,
    images,
    createdAt: createdAt || now,
    updatedAt: updatedAt || now
  }
}

export function makeList(title, items = []) {
  const id = uuidv1()
  return { id, title, items }
}

export function makeData() {
  return [
    makeList('One', [
      makeItem('1 1'),
      makeItem('1 2'),
      makeItem('1 3'),
    ]),
    makeList('Two', [
      makeItem('2 1'),
      makeItem('2 2'),
      makeItem('2 3'),
    ]),
    makeList('Three', [
      makeItem('3 1'),
      makeItem('3 2'),
      makeItem('3 3'),
    ]),
  ]
}

// --- 圖片 localStorage 工具 ---
export function saveImageToStorage(imageData) {
  try {
    const imageId = uuidv1()
    localStorage.setItem(`trello_image_${imageId}`, imageData)
    return imageId
  } catch (e) {
    console.error('Error saving image to localStorage:', e)
    return null
  }
}

export function getImageFromStorage(imageId) {
  try {
    return localStorage.getItem(`trello_image_${imageId}`)
  } catch (e) {
    console.error('Error getting image from localStorage:', e)
    return null
  }
}

export function removeImageFromStorage(imageId) {
  try {
    localStorage.removeItem(`trello_image_${imageId}`)
  } catch (e) {
    console.error('Error removing image from localStorage:', e)
  }
}
