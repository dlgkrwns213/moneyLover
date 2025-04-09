<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBudgetStore } from '@/stores/budget'
import axios from 'axios'
import '@/assets/main.css'

const router = useRouter()
const inputValue = ref(0)
const budgetStore = useBudgetStore()

function saveBudget() {
  budgetStore.setBudget(Number(inputValue.value))
  router.push('/')
}

const goToSearch = () => {
  router.push('/SearchFilter')
}

function goBack() {
  window.history.back()
}
</script>

<template>
  <!-- Bootstrap CSS -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <!-- Bootstrap Icons -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    rel="stylesheet"
  />
  <div class="header">
    <span class="icon" @click="goBack">
      <i class="bi bi-x"></i>
    </span>
    <span class="menu-budgetsetting">예산설정</span>
    <span class="icon" @click="goToSearch">
      <i class="bi bi-search"></i>
    </span>
  </div>

  <div class="page-wrapper">
    <div class="donut-row">
      <div class="donut-column">
        <div class="month">4월</div>
        <div class="donut-content">
          <div class="donut-container">
            <img class="donut-image" src="/src/assets/images/clover/clover_setting.png" />
          </div>

          <!-- 오른쪽: 텍스트 -->
          <div class="info">
            <div class="line">
              <span class="label">예산 설정</span>
            </div>
            <div class="submit">
              <div class="input-group">
                <input type="number" v-model="inputValue" class="form-control" />
                <span class="input-group-text">
                  <i class="bi bi-pencil" @click="saveBudget"></i
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-group {
  width: 175px;
  height: 38px;
  padding-right: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 360px;
  height: 50px;
  padding: 0 10px;
  background-color: #f6f6f6;
  border-bottom: 1px solid #f6f6f6;
  margin: 0 auto;
  font-family: 'MyFontBold';
}

.icon {
  width: 24px;
  text-align: center;
}
.bi-pencil {
  cursor: pointer;
}

.bi-x {
  font-size: 40px;
  cursor: pointer;
  color: #444;
}

.menu-budgetsetting {
  text-align: center;
  font-family: 'MyFontBold';
  font-size: 20px;
  color: #444;
}

.bi-search {
  font-family: 'MyFontBold';
  font-size: 20px;
  color: #444;
}

.input-group .form-control {
  border-radius: 8px 0 0 8px;
  font-size: 12px;
}

.input-group-text {
  background-color: #f1f1f1;
  border-radius: 0 8px 8px 0;
}

.month {
  font-family: 'MyFontBold';
  font-size: 20px;
  margin-bottom: 8px;
  color: #444;
}

.donut-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
}

.donut-row {
  display: flex;
  align-items: center;
  background-color: rgb(255, 255, 255);
  border-radius: 16px;
  width: 350px;
  height: 200px;
  border: 1px solid green;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
  padding: 12px;
}

.donut-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.donut-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 100%;
}

.donut-container {
  position: relative;
  width: 180px;
  height: 100px;
  flex-shrink: 0;
}

.donut-image {
  /* position: absolute;
  top: 50%;

  transform: translate(-170%, -50%);
  border-radius: 50%;
  object-fit: contain;
  z-index: 1; */
  position: absolute;
  width: 130px;
  height: 130px;
  left: 10%;
  bottom: -15px;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0;
  font-family: 'MyFont';
}

.line {
  display: flex;
  justify-content: space-between;
}

.label {
  padding: 10px;
  font-weight: bold;
  color: #444;
  flex: 1;
}

.value {
  padding: 10px;
  text-align: right;
  flex: 1;
}

.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
</style>
