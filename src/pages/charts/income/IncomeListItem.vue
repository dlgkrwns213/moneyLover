<template>
  <li>
    <div class="list-group-item">
      <div class="item-row">
        <div class="icon">
          <img
            :src="`/src/assets/images/${getCategoryKeyFromLabel(category)}.png`"
            style="width: 100%"
          />
        </div>
        <div class="content">
          <div class="dataDetail">
            <span class="item-category">{{ index + 1 }} {{ category }}</span>
            <span class="money">+₩{{ formatMoney(value) }}</span>
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

const bgc = [
  '#1F77B4', // 파랑
  '#FF7F0E', // 주황
  '#2CA02C', // 초록
  '#D62728', // 빨강
  '#9467BD', // 보라
  '#8C564B', // 갈색
  '#E377C2', // 핑크
  '#7F7F7F', // 회색
  '#BCBD22', // 연두
  '#17BECF', // 청록

  '#AEC7E8', // 연파랑
  '#FFBB78', // 연주황
  '#98DF8A', // 연초록
  '#FF9896', // 연분홍
  '#C5B0D5', // 연보라
  '#C49C94', // 살색
  '#F7B6D2', // 연핑크
  '#C7C7C7', // 연회색
  '#DBDB8D', // 베이지/연노랑
  '#9EDAE5', // 하늘청록

  '#393B79', // 짙은 남색
  '#637939', // 짙은 올리브
  '#8C6D31', // 짙은 황토
  '#843C39', // 진한 적갈색
]

defineProps({
  index: Number,
  category: String,
  value: Number,
  percent: String,
  count: Number,
})

// 천단위 쉼표 함수
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
  padding-right: 10px;
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
  font-size: 13px;
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
