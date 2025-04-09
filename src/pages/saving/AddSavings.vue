<!-- AddSavings.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useSavingStore } from '@/stores/saving'

const router = useRouter()
const savingStore = useSavingStore()

// 폼 입력값
const name = ref('')
const nameInputRef = ref(null)
const targetAmount = ref('')
const frequency = ref('매일')
const repeatCount = ref(4)
const startDate = dayjs().format('YYYY-MM-DD')
const repeatOptions = Array.from({ length: 96 }, (_, i) => i + 4)

// 종료 날짜 계산
const endDate = computed(() => calculateEndDate(startDate, frequency.value, repeatCount.value))

// 1회 금액 계산
const perAmount = computed(() => {
  const total = parseInt(targetAmount.value || '0')
  return repeatCount.value > 0 ? Math.floor(total / repeatCount.value) : 0
})

// 날짜 계산 함수
const calculateEndDate = (start, freq, count) => {
  const base = dayjs(start)
  const unit = freq === '매주' ? 'week' : freq === '매달' ? 'month' : 'day'
  return base.add(count - 1, unit).format('YYYY-MM-DD')
}

// 스케줄 생성 함수
const generateSchedule = (start, freq, count, amount) => {
  const schedule = []
  let currentDate = dayjs(start)
  const unit = freq === '매주' ? 'week' : freq === '매달' ? 'month' : 'day'

  for (let i = 0; i < count; i++) {
    schedule.push({
      date: currentDate.format('YYYY-MM-DD'),
      amount,
      done: false
    })
    currentDate = currentDate.add(1, unit)
  }

  return schedule
}

// 저장 로직
const saveData = async () => {
  if (!name.value || !targetAmount.value) {
    alert('입력값을 확인해주세요!')
    return
  }

  const savingData = {
    name: name.value,
    targetAmount: parseInt(targetAmount.value),
    startDate,
    endDate: endDate.value,
    frequency: frequency.value,
    repeatCount: repeatCount.value,
    perAmount: perAmount.value,
    schedule: generateSchedule(startDate, frequency.value, repeatCount.value, perAmount.value),
    saved: 0,
    percent: 0
  }

  try {
    const newId = await savingStore.addSaving(savingData)
    if (newId) {
      alert('저축이 저장되었습니다!')
      router.push(`/saving/${newId}`)
    } else {
      alert('저장에 성공했지만 ID를 받아오지 못했습니다.')
    }
  } catch (err) {
    alert('저장 중 오류가 발생했습니다.')
    console.error(err)
  }
}
</script>

<template>
  <div class="fixed-wrapper">
  <div class="container-fluid bg-light-gray min-vh-100 py-3 px-3">
    <div class="d-flex justify-content-between align-items-center mb-3 px-1 position-relative">
  <!-- 뒤로가기 버튼 (좌측) -->
  <img
    src="@/assets/images/saving/close.png"
    alt="뒤로가기"
    class="icon-close"
    @click="router.push('/saving')"  />

  <!-- 제목 (가운데 정렬을 위해 절대 위치 사용) -->
  <h4 class="custom-bold text-dark fw-bold m-0 position-absolute start-50 top-50 translate-middle">저축</h4>

  <!-- 저장 버튼 (우측) -->
  <img
    src="@/assets/images/saving/check_green.png"
    alt="저장"
    class="check-icon"
    @click="saveData"
  />
</div>
    <div class="card saving-card p-4 ps-4 pe-4">
      <div class="d-flex align-items-center mb-3">
        <img src="@/assets/images/saving/saving_coin.png" alt="코인" class="icon me-2" />
        <input
          ref="nameInputRef"
          v-model="name"
          maxlength="10"
          placeholder="이름을 추가하세요."
          class="custom-light form-control form-control-sm name-input"
        />
        <img
          src="@/assets/images/saving/edit.png"
          alt="수정"
          class="edit-icon ms-2"
          @click="() => nameInputRef?.value?.focus()"
        />
      </div>

      <div class="custom-bold row gy-3">
        <div class="custom-bold col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">목표 금액</span>
          <input
            v-model="targetAmount"
            type="number"
            placeholder="금액을 입력하십시오."
            class="custom-light form-control form-control-sm input-amount text-end"
          />
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">시작 날짜</span>
          <span class="custom-light text-green">{{ startDate }}</span>
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">종료 날짜</span>
          <span class="custom-light text-green">{{ endDate }}</span>
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">주기</span>
          <select v-model="frequency" class="custom-light form-select form-select-sm w-auto text-green border-0">
            <option value="매일">매일</option>
            <option value="매주">매주</option>
            <option value="매달">매달</option>
          </select>
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">반복 횟수</span>
          <select v-model="repeatCount" class="custom-light form-select form-select-sm w-auto text-green border-0">
            <option v-for="n in repeatOptions" :key="n" :value="n">
              {{ n }}번
            </option>
          </select>
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">한 번 금액</span>
          <span class="text-green">{{ perAmount.toLocaleString() }}</span>
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
.text-dark {
  color: #000;
}
.saving-card {
  padding: 1rem;
  background-color: white;
  border: none;
  border-radius: 12px;
  letter-spacing: -0.05em;
}
.name-input {
  background: transparent;
  border: none;
  padding: 4rem, 0;
  letter-spacing: -0.05em;
  font-size: 0.95rem;
  flex-grow: 1;
}
.input-amount {
  background: transparent;
  border: none;
  border-bottom: 1px solid #61905A;
  width: 180px;
  letter-spacing: -0.05em;
}
.label-text {
  font-weight: bold;
  color: #000;
  letter-spacing: -0.05em;
}
.icon {
  width: 40px;
}
.edit-icon {
  width: 16px;
  cursor: pointer;
}
.check-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.icon-close {
  width: 20px;
  cursor: pointer;
}
.custom-bold{
font-family: "MYfontBold";
}
.custom-light{
  font-family: "Myfont"
}
.row-item {
  padding: 4px 0;
}
</style>
