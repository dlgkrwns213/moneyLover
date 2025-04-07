<template>
  <li>
    <div class="item-list-group">
      <div class="item-row">
        <div class="icon">
          <img
            :src="`/src/assets/images/${getCategoryKeyFromLabel(category)}.png`"
            style="width: 100%"
          />
        </div>
        <div class="text-content">
          <div class="left">
            <div class="top">{{ category }}</div>
            <div class="bottom" v-if="memo">{{ memo }}</div>
          </div>
          <div class="right">
            <div class="top">-₩ {{ formatMoney(value) }}</div>
            <div class="bottom">{{ date }}</div>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>
<script setup>
import { TRANSLATIONS } from '@/constants/translate';

defineProps({
  category: String,
  memo: String,
  value: Number,
  date: String,
});

// 천단위 쉼표 함수
function formatMoney(value) {
  if (!value) return '0';
  return new Intl.NumberFormat('ko-KR').format(value);
}

function getCategoryKeyFromLabel(label) {
  const reversed = Object.entries(TRANSLATIONS).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  return reversed[label] || 'etc'; // 못 찾으면 'etc'로 처리
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
.text-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  flex: 1; /* ✅ 너비 꽉 차게 */
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
  margin-left: auto; /* ✅ 오른쪽으로 강제 밀기 */
}
.left.has-memo {
  justify-content: flex-start; /* 메모가 있으면 위로 정렬 */
}

.top {
  font-weight: bold;
  font-size: 15px;
}

.bottom {
  font-size: 13px;
  color: gray;
  margin-top: 2px;
  white-space: nowrap;
}
.icon {
  width: 60px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 10px;
}
</style>
