<!-- SavingManagement.vue -->
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSavingStore } from '@/stores/saving'
import { useUserStore } from '@/stores/user'
import Navigator from '@/pages/home/Navigator.vue'
import piggy from '@/assets/images/saving/piggy.png'
import piggyComplete from '@/assets/images/saving/piggyComplete.png'

const router = useRouter()
const savingStore = useSavingStore()
const userStore = useUserStore()

const goToAddSaving = () => {
  router.push('/add-saving')
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    savingStore.fetchSavings(userStore.userId)
  }
})
</script>

<template>
  <div class="fixed-wrapper">
    <div class="container-fluid bg-light-green min-vh-100 d-flex flex-column">
      <!-- Header -->
      <header class="text-center py-3">
        <h4 class="custom-bold text-dark fw-bold m-0">저축</h4>
      </header>

      <!-- 새로운 저축 등록하기 -->
      <div class="text-center my-3">
        <button class="btn" @click="goToAddSaving">
          <img
            src="@/assets/images/saving/add_saving.png"
            alt="새로운 저축 등록하기"
            class="img-fluid rounded-3 shadow-sm"
          />
        </button>
      </div>

      <!-- 저축 목록 -->
      <div class="flex-grow-1 px-3 overflow-auto d-flex flex-column bg-white rounded-4">
        <h6 class="custom-bold text-left mt-3 mb-2">저축 목록</h6>
        <hr class="border border-1 border-green opacity-100 mt-0" />

        <div
          v-if="savingStore.savings.length === 0"
          class="d-flex justify-content-center align-items-center flex-grow-1"
        >
          <img
            src="@/assets/images/saving/saving_empty.png"
            alt="행운 클로버"
            class="img-fluid"
            style="width: 200px; opacity: 0.7"
          />
        </div>

        <div v-else class="list-box d-flex flex-column gap-3 mb-5">
          <div
            v-for="saving in savingStore.savings"
            :key="saving.id"
            class="list-innerbox p-3 bg-white shadow-sm"
            @click="router.push(`/saving/${saving.id}`)"
          >
            <div class="d-flex align-items-center mb-2">
              <img
                :src="saving.percent < 100 ? piggy : piggyComplete"
                alt="저금통"
                class="me-2"
                style="width: 36px"
              />
              <span class="custom-bold" style="font-size: 1rem">{{ saving.name }}</span>
            </div>

            <!-- 게이지 바 -->
            <div class="progress rounded-pill mb-2" style="height: 10px">
              <div class="progress-bar"
                :class="saving.percent < 100 ? 'bg-green' : 'bg-orange'" 
                :style="{ width: saving.percent + '%' }">
              </div>
            </div>
            <div class="custom-light d-flex justify-content-between" style="font-size: 0.8rem">
              <div>
                ₩{{ (saving.saved || 0).toLocaleString() }}<br /><small
                  class="text-start opacity-75"
                  >적립</small
                >
              </div>
              <div>
                {{ saving.percent }}%<br /><small class="d-block text-center opacity-75"
                  >{{ saving.percent < 100 ? "진행" : "완료" }}</small
                >
              </div>
              <div>
                ₩{{ (saving.targetAmount || 0).toLocaleString() }}<br /><small
                  class="d-block text-end opacity-75"
                  >목표</small
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <Navigator />
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
.bg-light-green {
  background-color: #f6f6f6;
}
.list-box {
  border: 1px solid #61905a;
  border-radius: 12px;
}
.list-innerbox {
  border-radius: 12px;
}
.text-green {
  color: #61905a;
}
.border-green {
  border-color: #61905a !important;
}
.bg-green {
  background-color: #61905a !important;
}
.bg-orange {
  background-color: #eb8500 !important;
}
.custom-bold {
  font-family: 'MYfontBold';
}
.custom-light {
  font-family: 'Myfont';
}

* {
  letter-spacing: -0.05em;
}
</style>
