<template>
  <li>
    <div class="list-group-item">
      <div class="item-row">
        <div class="icon">
          <img :src="getImageSrc(category)" style="width: 100%" />
        </div>
        <div class="content">
          <div class="dataDetail">
            <span class="item-category">{{ index + 1 }} {{ category }}</span>
            <span class="money">-₩{{ formatMoney(value) }}</span>
          </div>
          <div class="category-meta">
            <span class="item-percent">{{ percent }}%</span>
            <span class="item-count"> {{ count }}건</span>
          </div>
          <div class="gauge-bar">
            <div
              class="gauge-fill"
              :style="{
                width: percent + '%',
                backgroundColor: bgc[index % bgc.length],
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { TRANSLATIONS } from '@/constants/translate'

defineProps({
  index: Number,
  category: String,
  value: Number,
  percent: String,
  count: Number,
})

const bgc = [
  '#ff6b6b',
  '#feca57',
  '#1dd1a1',
  '#54a0ff',
  '#d395d0',
  '#ff9999',
  '#1F77B4',
  '#FF9896',
  '#9EDAE5',
  '#FF7F0E',
  '#2CA02C',
  '#D62728',
  '#9467BD',
  '#8C564B',
  '#7F7F7F',
  '#BCBD22',
  '#17BECF',
  '#AEC7E8',
  '#FFBB78',
  '#98DF8A',
  '#C5B0D5',
  '#C49C94',
  '#F7B6D2',
  '#C7C7C7',
  '#393B79',
  '#637939',
  '#8C6D31',
  '#843C39',
]

function formatMoney(value) {
  if (!value) return '0'
  return new Intl.NumberFormat('ko-KR').format(value)
}

function getCategoryKeyFromLabel(label) {
  const reversed = Object.entries(TRANSLATIONS).reduce((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {})
  return reversed[label] || 'etc'
}

const icons = import.meta.glob('@/assets/images/outcome/*.png', {
  eager: true,
  import: 'default',
})

const getImageSrc = (category) => {
  const key = getCategoryKeyFromLabel(category)
  const path = `/src/assets/images/outcome/${key}.png`
  return icons[path] || icons['/src/assets/images/outcome/etc.png']
}
</script>

<style scoped>
li {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 10px;
  list-style: none;
}
li:last-child {
  border-bottom: none;
}
.item-row {
  display: flex;
}
.icon {
  width: 40px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  padding-right: 5px;
}
.content {
  width: 100%;
  padding: 10px;
}
.dataDetail {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-family: 'MyFontBold';
  font-size: 14px;
}
.category-meta {
  display: flex;
  justify-content: space-between;
  color: gray;
  font-size: 10px;
  font-family: 'MyFont';
}
.gauge-bar {
  width: 100%;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  margin-top: 6px;
  overflow: hidden;
}
.gauge-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.4s ease;
}
</style>
