<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const name = ref('')
const nameInputRef = ref(null)
const targetAmount = ref('')
const frequency = ref('매일')
const repeatOptions = Array.from({ length: 96 }, (_, i) => i + 4) // 4 ~ 99
const repeatCount = ref(4)
const startDate = dayjs().format('YYYY-MM-DD')

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

const perAmount = computed(() => {
  const total = parseInt(targetAmount.value || '0')
  const count = parseInt(repeatCount.value || '1')
  return count > 0 ? Math.floor(total / count) : 0
})

const saveData = () => {
  if (!name.value || !targetAmount.value) return alert('입력값을 확인해주세요!')
  alert('저축이 저장되었습니다!')
  router.push('/saving')
}
</script>

<template>
  <div class="container-fluid bg-light-gray min-vh-100 py-3 px-3">
    <div class="text-center position-relative mb-3">
      <h4 class="fw-bold text-dark m-0">저축</h4>
      <img
        src="@/assets/images/saving/check_green.png"
        alt="저장"
        class="check-icon position-absolute end-0 top-50 translate-middle-y"
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
/* 색상 및 공통 스타일 */
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

/* 입력 스타일 */
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

/* 텍스트 및 아이콘 */
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
.row-item {
  padding: 4px 0;
}
</style>
