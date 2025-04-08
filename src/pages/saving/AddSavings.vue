<!-- AddSavings.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import dayjs from 'dayjs'

const router = useRouter()

// 폼 입력값
const name = ref('')
const nameInputRef = ref(null)
const targetAmount = ref('')
const frequency = ref('매일')
const repeatOptions = Array.from({ length: 96 }, (_, i) => i + 4)
const repeatCount = ref(4)
const startDate = dayjs().format('YYYY-MM-DD')

// 종료 날짜 계산
const endDate = computed(() => {
  const base = dayjs(startDate)
  switch (frequency.value) {
    case '매주':
      return base.add(repeatCount.value - 1, 'week').format('YYYY-MM-DD')
    case '매달':
      return base.add(repeatCount.value - 1, 'month').format('YYYY-MM-DD')
    default:
      return base.add(repeatCount.value - 1, 'day').format('YYYY-MM-DD')
  }
})

// 1회 금액 계산
const perAmount = computed(() => {
  const total = parseInt(targetAmount.value || '0')
  const count = parseInt(repeatCount.value || '1')
  return count > 0 ? Math.floor(total / count) : 0
})

// 저장 로직
const saveData = async () => {
  if (!name.value || !targetAmount.value) {
    alert('입력값을 확인해주세요!')
    return
  }

  const schedule = []
  let currentDate = dayjs(startDate)

  for (let i = 0; i < repeatCount.value; i++) {
    schedule.push({
      date: currentDate.format('YYYY-MM-DD'),
      amount: perAmount.value,
      done: false,
    })

    switch (frequency.value) {
      case '매주':
        currentDate = currentDate.add(1, 'week')
        break
      case '매달':
        currentDate = currentDate.add(1, 'month')
        break
      default:
        currentDate = currentDate.add(1, 'day')
        break
    }
  }

  const savingData = {
    name: name.value,
    targetAmount: parseInt(targetAmount.value),
    startDate,
    endDate: endDate.value,
    frequency: frequency.value,
    repeatCount: repeatCount.value,
    perAmount: perAmount.value,
    schedule,
    saved: 0, // 저장된 금액 초기화
    percent: 0, // 진행률 초기화
  }

  try {
    const res = await axios.post('http://localhost:3000/saving', savingData)
    const newId = res.data.id
    alert('저축이 저장되었습니다!')
    router.push(`/saving/${newId}`)
  } catch (err) {
    alert('저장 중 오류가 발생했습니다.')
    console.error(err)
  }
}
</script>

<template>
  <div class="container-fluid bg-light-gray min-vh-100 py-3 px-3">
    <div class="d-flex justify-content-between align-items-center mb-3 px-1 position-relative">
  <!-- 뒤로가기 버튼 (좌측) -->
  <img
    src="@/assets/images/saving/close.png"
    alt="뒤로가기"
    class="icon-close"
    @click="router.push('/saving')"  />

  <!-- 제목 (가운데 정렬을 위해 절대 위치 사용) -->
  <h4 class="text-dark fw-bold m-0 position-absolute start-50 top-50 translate-middle">저축</h4>

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
          class="form-control form-control-sm name-input"
        />
        <img
          src="@/assets/images/saving/edit.png"
          alt="수정"
          class="edit-icon ms-2"
          @click="() => nameInputRef?.value?.focus()"
        />
      </div>

      <div class="row gy-3">
        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">목표 금액</span>
          <input
            v-model="targetAmount"
            type="number"
            placeholder="금액을 입력하십시오."
            class="form-control form-control-sm input-amount text-end"
          />
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">시작 날짜</span>
          <span class="text-green">{{ startDate }}</span>
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">종료 날짜</span>
          <span class="text-green">{{ endDate }}</span>
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">주기</span>
          <select v-model="frequency" class="form-select form-select-sm w-auto text-green border-0">
            <option value="매일">매일</option>
            <option value="매주">매주</option>
            <option value="매달">매달</option>
          </select>
        </div>

        <div class="col-12 d-flex justify-content-between align-items-center row-item">
          <span class="label-text">반복 횟수</span>
          <select v-model="repeatCount" class="form-select form-select-sm w-auto text-green border-0">
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
</template>

<style scoped>
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
.row-item {
  padding: 4px 0;
}
</style>
