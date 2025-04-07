<!-- 담당자: 예빈 -->
<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
const remain = ref(100)
const budget = ref(100)
const percent = ref(100)
</script>

<template>
  <div class="card mb-3 rounded-4" style="max-width: 540px">
    <div class="row g-0 align-items-center">
      <div class="col-md-4">
        <img src="" />
      </div>

      <!-- text -->
      <div class="col-md-8">
        <div class="card-body">
          <!-- 예산 -->
          <div class="line">
            <span class="label">예산</span>
            <span class="value">{{ budget }}</span>
          </div>
          <!-- 남음 -->
          <div class="line">
            <span class="label">남음</span>
            <span class="value">{{ remain }}</span>
          </div>
          <!-- 퍼센트 -->
          <div class="line" id="percent">
            <span class="label">퍼센트</span>
            <span class="value">{{ percent }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.budget-card {
  width: 100%;
  max-width: 540px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background-color: #fff;
}

.line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  text-align: left;
  font-weight: bold;
  flex: 1;
}

.value {
  text-align: right;
  flex: 1;
  color: #6c757d;
}
</style>
