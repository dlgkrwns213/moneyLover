<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import checkGreen from '@/assets/images/saving/check_green.png'
import checkGray from '@/assets/images/saving/check_gray.png'

const route = useRoute()
const router = useRouter()

const saving = ref(null)
const schedule = ref([])

// 저장 내역 불러오기
onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/saving/${route.params.id}`)
    saving.value = res.data
    schedule.value = res.data.schedule
  } catch (err) {
    console.error('저축 데이터를 불러오는 데 실패했습니다.', err)
  }
})

// 퍼센트 계산
const percent = computed(() => {
  if (!saving.value) return 0
  return Math.floor((saving.value.saved / saving.value.targetAmount) * 100)
})

// 체크 토글
const toggleCheck = async (index) => {
  const item = schedule.value[index]
  item.done = !item.done

  const totalSaved = schedule.value.filter(i => i.done).reduce((acc, cur) => acc + cur.amount, 0)

  try {
    await axios.patch(`http://localhost:3000/saving/${route.params.id}`, {
      schedule: schedule.value,
      saved: totalSaved,
      percent: Math.floor((totalSaved / saving.value.targetAmount) * 100)
    })

    saving.value.saved = totalSaved
    saving.value.percent = Math.floor((totalSaved / saving.value.targetAmount) * 100)
  } catch (err) {
    alert('업데이트 중 오류가 발생했습니다.')
    console.error(err)
  }
}

// 삭제
const deleteSaving = async () => {
  if (!confirm('정말 이 저축을 삭제하시겠습니까?')) return
  try {
    await axios.delete(`http://localhost:3000/saving/${route.params.id}`)
    router.push('/saving')
  } catch (err) {
    alert('삭제 중 오류가 발생했습니다.')
  }
}
</script>

<template>
  <div class="container-fluid bg-light-gray min-vh-100 px-3 py-3">
<!-- 헤더 -->
<div class="d-flex justify-content-between align-items-center mb-3 px-1">
  <!-- 뒤로가기 버튼 -->
  <img
    src="@/assets/images/saving/back.png"
    alt="뒤로가기"
    class="icon-back"
    @click="router.back()"
  />

  <!-- 가운데 제목 -->
  <h4 class="text-dark fw-bold m-0 text-center flex-grow-1">저축</h4>

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
            <img src="@/assets/images/saving/piggy.png" alt="저금통" class="me-2" style="width: 36px;" />
            <span class="fw-bold" style="font-size: 1.1rem">{{ saving?.name }}</span>
          </div>

       <!-- 게이지바 -->
       <div class="progress rounded-pill" style="height: 10px;">
        <div class="progress-bar bg-green" :style="{ width: percent + '%' }"></div>
      </div>

      <div class="d-flex justify-content-between"style="font-size: 0.9rem">
        <div class="">₩{{ saving?.saved?.toLocaleString() }}<br /><small class="opacity-75">적립</small></div>
        <div class="">{{ percent }}%<br /><small class="opacity-75">진행</small></div>
        <div class="">₩{{ saving?.targetAmount?.toLocaleString() }}<br /><small class="opacity-75">목표</small></div>
      </div>
    </div>
    

    <!-- 스케줄 리스트 -->
    <div class="d-flex flex-column gap-2 overflow-auto pb-5" style="max-height: 70vh;">
      <div
        v-for="(item, index) in schedule"
        :key="index"
        class="d-flex justify-content-between align-items-center box border border-green px-3 py-2"
      >
        <div>
          <div class="small">{{ item.date }}</div>
          <div :class="[item.done ? 'text-green' : 'text-gray', 'fw-bold']">
            +₩{{ item.amount.toLocaleString() }}
          </div>
        </div>
        <img
          :src="item.done ? checkGreen : checkGray"
          class="icon-check"
          @click="toggleCheck(index)"
        />
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
.bg-green {
  background-color: #61905A !important;
}
.border-green{
  border-color: #61905A !important;
}
</style>
