<!-- SavingManagement.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Navigator from '@/pages/home/Navigator.vue';

const router = useRouter()
// 임시 데이터
const savings = ref([
  // {
  //   name: '8월 여행 준비',
  //   saved: 100000,
  //   percent: 20,
  //   target: 500000,
  // }
])

const goToAddSaving = () => {
  router.push('/add-saving')
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/saving')
    savings.value = res.data.map(item => ({
      name: item.name,
      saved: item.saved,
      percent: item.percent,
      target: item.targetAmount,
      id: item.id,
    }))
  } catch (err) {
    console.error('저축 목록을 불러오는 데 실패했습니다:', err)
  }
})
</script>


<template>
  <div class="container-fluid bg-light-green min-vh-100 d-flex flex-column">
    <!-- Header -->
    <header class="text-center py-3">
      <h4 class="text-dark fw-bold m-0">저축</h4>
    </header>

    <!-- New Saving Button -->
    <div class="text-center my-3">
      <button class="btn" @click="goToAddSaving">
        <img src="@/assets/images/saving/add_saving.png" alt="새로운 저축 등록하기" class="img-fluid" />
      </button>
    </div>

    <!-- Savings List -->
    <div class="flex-grow-1 px-3 overflow-auto d-flex flex-column">
      <h5 class="text-center mt-3 mb-2">내 저축 목록</h5>
      <hr class="border border-1 border-green opacity-100 mt-0" />

      <div v-if="savings.length === 0" class="d-flex justify-content-center align-items-center flex-grow-1">
        <img src="@/assets/images/saving/saving_empty.png" alt="행운 클로버" class="img-fluid" style="width: 300px; opacity: 0.7;" />
      </div>

      <div v-else class="d-flex flex-column gap-3 mb-5">
        <div v-for="(saving, index) in savings" :key="saving.id" class="p-3 bg-white rounded-4 shadow-sm" @click="router.push(`/saving/${saving.id}`)">
          <div class="d-flex align-items-center mb-2">
            <img src="@/assets/images/saving/piggy.png" alt="저금통" class="me-2" style="width: 36px;" />
            <span class="fw-bold" style="font-size: 1.1rem">{{ saving.name }}</span>
          </div>
          
          <!-- 게이지바 -->
          <div class="progress rounded-pill mb-2" style="height: 10px;">
            <div class="progress-bar bg-green" :style="{ width: saving.percent + '%' }"></div>
          </div>
          <div class="d-flex justify-content-between" style="font-size: 0.9rem">
            <div>
              ₩{{ (saving.saved || 0).toLocaleString() }}<br /><small class="opacity-75">적립</small>
            </div>
            <div>
              {{ saving.percent }}%<br /><small class="opacity-75">진행</small>
            </div>
            <div>
              ₩{{ saving.target.toLocaleString() }}<br /><small class="opacity-75">목표</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Navigator />
  </div>
</template>



<style scoped>
.bg-light-green {
  background-color: #F6F6F6;
}
.text-green {
  color: #61905A;
}
.border-green {
  border-color: #61905A !important;
}
.bg-green {
  background-color: #61905A !important;
}
* {
  letter-spacing: -0.05em;
}
</style>
