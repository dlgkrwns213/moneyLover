<template>
  <li>
    <div class="item-list-group">
      <div class="item-row">
        <div class="icon">
          <img
            :src="`/src/assets/images/outcome/${getCategoryKeyFromLabel(category)}.png`"
            style="width: 100%"
          />
        </div>
        <div class="text-content">
          <div class="left">
            <div class="top">{{ category }}</div>
            <div class="bottom" v-if="memo">{{ memo }}</div>
          </div>
          <div class="right">
            <div class="top">-₩{{ formatMoney(value) }}</div>
            <div class="bottom">{{ date }}</div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>
<script setup>
import { TRANSLATIONS } from '@/constants/translate'

defineProps({
  category: String,
  memo: String,
  value: Number,
  date: String,
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

  return reversed[label] || 'etc' // 못 찾으면 'etc'로 처리
}
</script>
<style scoped>
.item-row {
  display: flex;
}
.text-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  flex: 1;
  min-width: 0;
}
.left {
  display: flex;
  flex-direction: column;
}
.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  margin-left: auto;
}
.left.has-memo {
  justify-content: flex-start;
}

.top {
  font-weight: bold;
  font-size: 14px;
  font-family: 'MyFontBold';
}

.bottom {
  font-size: 10px;
  color: gray;
  margin-top: 2px;
  white-space: nowrap;
  font-family: 'MyFont';
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
</style>
