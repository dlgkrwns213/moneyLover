<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

import backIcon from '@/assets/images/saving/back.png'
import { TRANSLATIONS } from '@/constants/translate'

const route = useRoute()
const router = useRouter()

const transaction = ref(null)
const includeInBudget = ref(true)

onMounted(async () => {
  const id = route.params.id
  const res = await axios.get(`http://localhost:3000/cashflows/${id}`)

  transaction.value = res.data
  includeInBudget.value = res.data.includeInBudget
})

const getCategoryKey = (koreanCategory) => {
  const entry = Object.entries(TRANSLATIONS).find(([_, value]) => value === koreanCategory)
  return entry ? entry[0] : 'bonus'
}

const icons = import.meta.glob('@/assets/images/all/*.png', { eager: true, import: 'default' })

const getIconPath = (category) => {
  const key = getCategoryKey(category)
  const path = `/src/assets/images/all/${key}.png`
  // 이미지 로딩 오류시 기본 클로버 이미지가 뜨도록
  return icons[path] || icons['/src/assets/images/clover/clover_default.png']
}

const toggleBudget = async () => {
  includeInBudget.value = !includeInBudget.value
  await axios.patch(`http://localhost:3000/cashflows/${transaction.value.id}`, {
    includeInBudget: includeInBudget.value,
  })
}

const deleteItem = async () => {
  const result = await Swal.fire({
    title: '정말 삭제하시겠습니까?',
    text: '삭제 후 되돌릴 수 없습니다.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: '삭제하기',
    cancelButtonText: '취소',
    customClass: {
      title: 'swal-title',
      popup: 'swal-popup',
      confirmButton: 'swal-confirm',
    },
  })

  if (result.isConfirmed) {
    try {
      await axios.delete(`http://localhost:3000/cashflows/${transaction.value.id}`)

      Swal.fire({
        title: '삭제 완료!',
        text: '항목이 삭제되었습니다.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        customClass: {
          title: 'swal-title',
          popup: 'swal-popup',
        },
        willClose: () => {
          router.push('/')
        },
      })
    } catch (err) {
      Swal.fire({
        title: '오류 발생!',
        text: '삭제에 실패했습니다.',
        icon: 'error',
      })
    }
  }
}
</script>

<template>
  <div class="container-fluid bg-light-gray min-vh-100 px-3 py-3">
    <!-- 상단 헤더 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <img :src="backIcon" alt="뒤로가기" class="icon-back" @click="router.back()" />
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
</template>

<style scoped>
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
</style>
