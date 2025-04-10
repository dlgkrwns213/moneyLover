<script setup>
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSavingStore } from '@/stores/saving'
import checkGreen from '@/assets/images/saving/check_green.png'
import checkGray from '@/assets/images/saving/check_gray.png'

const route = useRoute()
const router = useRouter()
const savingStore = useSavingStore()

// 저장 내역 불러오기
onMounted(() => {
  savingStore.fetchSavingById(route.params.id)
})

const saving = computed(() => savingStore.currentSaving)
const schedule = computed(() => saving.value?.schedule || [])

const savedAmount = computed(() => {
  if (!saving.value || !Array.isArray(saving.value.schedule)) return 0
  return saving.value.schedule
    .filter(item => item.done)
    .reduce((sum, item) => sum + item.amount, 0)
})

// 퍼센트 계산
const percent = computed(() => {
  const target = Number(saving.value?.targetAmount || 0)
  const saved = savedAmount.value
  if (!target) return 0
  return Math.floor((saved / target) * 100)
})

// 체크 토글
const toggleCheck = (index) => {
  savingStore.toggleScheduleCheck(index)
}

// 삭제
const deleteSaving = async () => {
  if (!confirm('정말 이 저축을 삭제하시겠습니까?')) return
  try {
    await savingStore.deleteSaving(route.params.id)
    router.push('/saving')
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="fixed-wrapper">
    <div class="container-fluid bg-light-gray min-vh-100 px-3 py-3">
      <!-- 헤더 -->
      <div class="d-flex justify-content-between align-items-center mb-3 px-1">
        <!-- 뒤로가기 버튼 -->
        <img
          src="@/assets/images/saving/back.png"
          alt="뒤로가기"
          class="icon-back"
          @click="router.push('/saving')"
        />

        <!-- 가운데 제목 -->
        <h4 class="custom-bold text-dark fw-bold m-0 text-center flex-grow-1">저축</h4>

        <!-- 삭제 버튼 -->
        <img
          src="@/assets/images/saving/delete.png"
          alt="삭제"
          class="icon-delete"
          @click="deleteSaving"
        />
      </div>

      <!-- 상단 정보 박스 -->
      <div class="box shadow-sm mb-3 p-3 d-flex flex-column gap-2">
        <div class="d-flex align-items-center mb-2">
          <img
            src="@/assets/images/saving/piggy.png"
            alt="저금통"
            class="me-2"
            style="width: 36px;"
          />
          <span class="custom-bold fw-bold" style="font-size: 1.1rem">{{ saving?.name }}</span>
        </div>

        <!-- 게이지바 -->
        <div class="progress rounded-pill" style="height: 10px;">
          <div class="progress-bar bg-green" :style="{ width: percent + '%' }"></div>
        </div>

        <div class="custom-light d-flex justify-content-between" style="font-size: 0.8rem">
          <div class="">₩{{ saving?.saved?.toLocaleString() }}<br /><small class="opacity-75">적립</small></div>
          <div class="">{{ percent }}%<br /><small class="d-block text-center opacity-75">진행</small></div>
          <div class="">₩{{ saving?.targetAmount?.toLocaleString() }}<br /><small class="d-block text-end opacity-75">목표</small></div>
        </div>
      </div>

      <!-- 스케줄 리스트 -->
      <div class="d-flex flex-column gap-2 overflow-auto pb-5" style="max-height: 70vh;">
        <div
          v-for="(item, index) in schedule"
          :key="index"
          class="d-flex justify-content-between align-items-center box border border-green px-3 py-3 mb-2 rounded-4 shadow-sm"
        >
          <!-- 날짜 -->
          <div class="custom-bold small">{{ item.date }}</div>

          <!-- 금액 + 체크아이콘 -->
          <div class="d-flex align-items-center gap-2">
            <div :class="[item.done ? 'text-green' : 'text-gray', 'fw-bold', 'custom-bold', 'small']">
              +₩{{ item.amount.toLocaleString() }}
            </div>
            <img
              :src="item.done ? checkGreen : checkGray"
              class="icon-check"
              @click="toggleCheck(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed-wrapper {
  width: 360px;
  height: 740px;
  overflow: hidden;
  background-color: #f0f0f0;
  margin: 0 auto;
  position: relative; 
  top: 0;
  left: 0;
  transform: none;
}

.bg-light-gray {
  background-color: #F6F6F6;
}

.text-green {
  color: #61905A;
}

.text-gray {
  color: #bbb;
}

.box {
  background: #fff;
  border-radius: 12px;
  letter-spacing: -0.05em;
}

.icon-check {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.icon-delete {
  width: 20px;
  cursor: pointer;
}

.icon-back {
  width: 20px;
  cursor: pointer;
}

.custom-bold {
  font-family: "MYfontBold";
}

.custom-light {
  font-family: "Myfont";
}

.bg-green {
  background-color: #61905A !important;
}

.border-green {
  border-color: #61905A !important;
}
</style>
