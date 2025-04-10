<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import backIcon from '@/assets/images/saving/back.png'
import { TRANSLATIONS } from '@/constants/translate'

import { useRouter } from 'vue-router'
import { faL } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()

const props = defineProps({
  id: String
})

const emit = defineEmits(['close'])

const transaction = ref(null)
const includeInBudget = ref(true)

onMounted(async () => {
  const res = await axios.get(`http://localhost:3000/cashflows/${props.id}`)
  transaction.value = res.data
  includeInBudget.value = res.data.includeInBudget
})

const reload = ref(false);
const close = () => {
  const currentPath = router.currentRoute.value.path
  if (reload.value && currentPath !== '/home/calendar') {
    location.reload();
  }
  emit('close')
}

const getCategoryKey = (koreanCategory) => {
  const entry = Object.entries(TRANSLATIONS).find(([_, value]) => value === koreanCategory)
  return entry ? entry[0] : 'bonus'
}

const icons = import.meta.glob('@/assets/images/all/*.png', { eager: true, import: 'default' })

const getIconPath = (category) => {
  const key = getCategoryKey(category)
  const path = `/src/assets/images/all/${key}.png`
  return icons[path] || icons['/src/assets/images/clover/clover_default.png']
}

const toggleBudget = async () => {
  includeInBudget.value = !includeInBudget.value
  await axios.patch(`http://localhost:3000/cashflows/${transaction.value.id}`, {
    includeInBudget: includeInBudget.value,
  })
  reload.value = !reload.value;
}

const deleteItem = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  await axios.delete(`http://localhost:3000/cashflows/${transaction.value.id}`)
  location.reload();
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
  <div class="modal-content">
  <div class="container-fluid bg-light-gray min-vh-80 px-3 py-3">
    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <img :src="backIcon" alt="뒤로가기" class="icon-back" @click="close" />
      <h5 class="m-0 custom-bold text-center flex-grow-1">세부 정보</h5>

      <div style="width: 20px"></div>
      <!-- 버튼 -->
      <div class="d-flex justify-content-end gap-2 mt-2">
        <img
          src="@/assets/images/saving/delete.png"
          alt="삭제"
          class="icon-delete"
          @click="deleteItem"
        />
      </div>
    </div>

    <!-- 내용 카드 -->
    <div v-if="transaction" class="box shadow-sm p-3 d-flex flex-column gap-3">
      <!-- 카테고리 / 금액 -->
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
          <div class="icon-wrapper">
            <img :src="getIconPath(transaction.category)" alt="카테고리" class="category-icon" />
          </div>

          <div>
            <div class="custom-light text-dark">{{ transaction.category }}</div>
          </div>
        </div>
        <div class="custom-light text-green text-end">
          {{ transaction.cashflowType ? '+' : '-' }}₩{{
            transaction.cashflowValue.toLocaleString('ko-KR')
          }}
        </div>
      </div>

      <!-- 메모 -->
      <div class="d-flex justify-content-between">
        <div class="custom-bold">메모</div>
        <div class="custom-light text-end">{{ transaction.cashflowName }}</div>
      </div>
      <!-- 날짜 -->
      <div class="d-flex justify-content-between">
        <div class="custom-bold">날짜</div>
        <div class="custom-light text-end">{{ transaction.date }}</div>
      </div>

      <!-- 예산 포함 -->
      <div
        v-if="!transaction.cashflowType"
        class="d-flex justify-content-between align-items-center"
      >
        <div class="custom-bold">예산 포함</div>
        <label class="switch">
          <input type="checkbox" v-model="includeInBudget" @click="toggleBudget" />
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  </div>
  </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(4px); /* 배경 흐림 효과 */
  background-color: rgba(255, 255, 255, 0.1); /* 흐림 효과와 잘 어울리는 투명한 배경 */  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

}
.bg-light-gray {
  background-color: #f6f6f6;
}
.box {
  background: #fff;
  border-radius: 12px;
  letter-spacing: -0.05em;
}
.custom-bold {
  font-family: 'MyFontBold';
}
.custom-light {
  font-family: 'MyFont';
}
.icon-back {
  width: 20px;
  cursor: pointer;
}
.category-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  font-size: 20px;
  margin-right: 10px;
  background-color: #f0f0f0;
  margin-right: 14px;
  margin-left: 6px;
}
.icon-delete {
  width: 20px;
  cursor: pointer;
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: #f0f0f0;
  background-image: url('@/assets/images/all/toggle_before.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #61905a;
}
input:checked + .slider:before {
  transform: translateX(20px);
  background-image: url('@/assets/images/all/toggle_after.jpg');
}

.min-vh-80 {
  min-height: 60vh;
}
</style>
