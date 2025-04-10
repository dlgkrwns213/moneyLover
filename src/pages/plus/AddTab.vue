<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AddCalendarModal from './AddCalendarModal.vue'
import { getEntryFromPath } from '@/utils/navigation'
import Swal from 'sweetalert2'

import button_1 from '@/assets/images/keyboard/button_1.png'
import button_2 from '@/assets/images/keyboard/button_2.png'
import button_3 from '@/assets/images/keyboard/button_3.png'
import button_back from '@/assets/images/keyboard/button_back.png'
import button_4 from '@/assets/images/keyboard/button_4.png'
import button_5 from '@/assets/images/keyboard/button_5.png'
import button_6 from '@/assets/images/keyboard/button_6.png'
import button_pl from '@/assets/images/keyboard/button_pl.png'
import button_mu from '@/assets/images/keyboard/button_mu.png'
import button_7 from '@/assets/images/keyboard/button_7.png'
import button_8 from '@/assets/images/keyboard/button_8.png'
import button_9 from '@/assets/images/keyboard/button_9.png'
import button_mi from '@/assets/images/keyboard/button_mi.png'
import button_di from '@/assets/images/keyboard/button_di.png'
import button_dot from '@/assets/images/keyboard/button_dot.png'
import button_0 from '@/assets/images/keyboard/button_0.png'
import button_cdr from '@/assets/images/keyboard/button_cdr.png'
import button_check from '@/assets/images/keyboard/button_check.png'
import button_equal from '@/assets/images/keyboard/button_equal.png'

import { useUserStore } from '@/stores/user'

const router = useRouter()
const showCalendarModal = ref(false)

const selectedDate = ref(new Date())

function selectDate(dateString) {
  selectedDate.value = dateString
}

function formatDateWithWeekday(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
  return `${y}-${m}-${d} ${weekday}`
}

const userStore = useUserStore()

const imageMap = {
  1: button_1,
  2: button_2,
  3: button_3,
  back: button_back,
  4: button_4,
  5: button_5,
  6: button_6,
  pl: button_pl,
  mu: button_mu,
  7: button_7,
  8: button_8,
  9: button_9,
  mi: button_mi,
  di: button_di,
  dot: button_dot,
  0: button_0,
  cdr: button_cdr,
  check: button_check,
  equal: button_equal,
}

const calculateContent = [1, 2, 3, '<', 4, 5, 6, '+', 'x', 7, 8, 9, '-', '%', '.', 0, 'cdr', '=']

const inputValue = ref('0')
const cashflowName = ref('')
const calculateCompleted = ref(true)
const selectedCategory = ref('')
const selectedType = ref('')

const contentImage = computed(() => {
  const base = [1, 2, 3, 'back', 4, 5, 6, 'pl', 'mu', 7, 8, 9, 'mi', 'di', 'dot', 0, 'cdr']
  base.push(calculateCompleted.value ? 'check' : 'equal')
  return base
})

function handleCategoryUpdate({ type, category }) {
  selectedType.value = type
  selectedCategory.value = category
}

const formattedValue = computed(() => {
  let num = inputValue.value.replace(/,/g, '')
  if (num === '') return ''

  if (!/[+\-x%]/.test(num)) {
    return '₩ ' + parseInt(num).toLocaleString()
  }

  let result = ''
  let parts = num.split(/([+\-x%])/)

  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      result += part
    } else if (part !== '') {
      result += parseInt(part).toLocaleString()
    }
  })

  return result
})

function goBack() {
  const previous = getEntryFromPath()
  if (previous) {
    router.replace(previous)
  } else {
    router.replace('/')
  }
}

function getGridSpan(index) {
  const oneColumnIndexes = [7, 8, 12, 13]
  return {
    gridColumn: `span ${oneColumnIndexes.includes(index) ? 1 : 2}`,
  }
}

function calculateButtonClick(content) {
  const calculate = (expression) => {
    const formatResult = (num) => {
      const fixed = num.toFixed(2)
      return fixed.endsWith('.00') ? String(parseInt(fixed)) : String(parseFloat(fixed))
    }
    const sign = expression.match(/[+\-x%]/)
    if (!sign) return expression
    const [a, b] = expression.split(sign)
    const numA = Number(a),
      numB = Number(b)

    switch (sign[0]) {
      case '+':
        return formatResult(numA + numB)
      case '-':
        return formatResult(numA - numB)
      case 'x':
        return formatResult(numA * numB)
      case '%':
        return numB !== 0 ? formatResult(numA / numB) : '0'
      default:
        return '오류'
    }
  }

  const signs = ['+', '-', 'x', '%']
  if (signs.includes(content)) {
    const last = inputValue.value.slice(-1)
    if (signs.includes(last)) {
      inputValue.value = inputValue.value.slice(0, -1) + content
    } else {
      inputValue.value = calculate(inputValue.value) + content
    }
    calculateCompleted.value = false
  } else if (content === '=') {
    if (calculateCompleted.value) {
      const money = Number(inputValue.value)
      const formattedDate = formatDateWithWeekday(selectedDate.value)
      console.log(formattedDate)
      if (!selectedCategory.value)
        return Swal.fire({
          icon: 'warning',
          title: '카테고리를 정하세요.',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#429f50',
          customClass: {
            title: 'swal-title',
            confirmButton: 'swal-confirm',
          },
        })
      if (!cashflowName.value)
        return Swal.fire({
          icon: 'warning',
          title: '분류를 정하세요.',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#429f50',
          customClass: {
            title: 'swal-title',
            confirmButton: 'swal-confirm',
          },
        })
      if (money <= 0)
        return Swal.fire({
          icon: 'warning',
          title: '0 이하의 수는 넣을 수 없습니다.',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#429f50',
          customClass: {
            title: 'swal-title',
            confirmButton: 'swal-confirm',
          },
        })

      const newCashflow = {
        cashflowType: selectedType.value === 'outcome' ? false : true,
        userId: userStore.userId || 'unKnown', // 수정 예정
        cashflowName: cashflowName.value,
        cashflowValue: money,
        date: formattedDate,
        category: selectedCategory.value,
        includeInBudget: true,
      }

      axios
        .post('http://localhost:3000/cashflows', newCashflow)
        .then((res) => {
          console.log('저장 성공:', res.data)
          goBack()
        })
        .catch((err) => console.error('저장 실패:', err))
    } else {
      const last = inputValue.value.slice(-1)
      if (signs.includes(last)) {
        inputValue.value = inputValue.value.slice(0, -1)
      } else {
        inputValue.value = calculate(inputValue.value)
      }
      calculateCompleted.value = true
    }
  } else if (content === '<') {
    if (inputValue.value.length <= 1) {
      inputValue.value = '0'
    } else {
      inputValue.value = inputValue.value.slice(0, -1)
    }
  } else if (content === 'cdr') {
    showCalendarModal.value = true
  } else {
    if (inputValue.value === '0') inputValue.value = ''
    inputValue.value += content
  }
}
</script>

<template>
  <div class="add-page-wrapper">
    <div class="header">
      <button class="back-button" @click="goBack">
        <font-awesome-icon :icon="['fas', 'xmark']" class="xmark-icon" />
      </button>
      <br />

      <div class="tab-wrapper">
        <router-link
          to="/add/outcome"
          class="tab"
          :class="{ active: $route.path === '/add/outcome' }"
          >지출</router-link
        >
        <router-link to="/add/income" class="tab" :class="{ active: $route.path === '/add/income' }"
          >수입</router-link
        >
      </div>
    </div>

    <div class="scroll-area">
      <router-view @update-category="handleCategoryUpdate" />
    </div>

    <AddCalendarModal
      v-if="showCalendarModal"
      @close="showCalendarModal = false"
      @date-selected="selectDate"
      :selected-date="selectedDate"
    />

    <div class="footer-calculate">
      <div class="input-container">
        <input
          v-model="cashflowName"
          type="text"
          class="input-cashflow-name"
          placeholder="상세정보를 입력하세요."
        />
        <div class="money">{{ formattedValue }}</div>
      </div>
      <div class="calculate-section">
        <div
          v-for="(content, idx) in calculateContent"
          :key="idx"
          class="calculate-section__buttton"
          :style="getGridSpan(idx)"
          @click="calculateButtonClick(content)"
        >
          <img
            :src="imageMap[contentImage[idx]]"
            :alt="contentImage[idx]"
            style="height: 100%; width: 100%"
            class="calculate-section__image"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-page-wrapper {
  background-color: white;
  min-height: 100vh; /* ⬅️ 뷰포트 전체 높이만큼 차지하게 하기 */
  font-family: 'MyFont';
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: white;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;

  background-color: white;
  border: none;
  padding: 0;
}

.back-button:hover {
  cursor: pointer;
}

.xmark-icon {
  font-size: 24px;
}

.tab-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 75px;

  background-color: white;
  z-index: 99;

  height: 48px;
  padding-bottom: 8px;
}

.tab {
  font-size: 16px;
  font-weight: 600;
  color: black;
  text-decoration: none;
  padding: 6px 12px;
}

.tab:hover {
  color: #61905a;
}

.tab.active {
  color: #61905a; /* 초록색 */
  border-bottom: 2.5px solid #497552;
}

.footer-calculate {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f0f0f0;
  z-index: 100;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 100%;
}
.input-container {
  position: relative;
  width: 296px; /* 컨테이너 너비 */
}

.input-cashflow-name {
  width: 100%;
  height: 30px;
  margin: 10px 0; /* 위 아래 margin만 설정 */
  border-radius: 10px;
  text-align: left;
  padding: 0 15px;
  font-size: 12px;
  border: 1.5px solid #61905a;
  letter-spacing: -0.05em;
}

.money {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  right: 15px; /* input 박스 오른쪽에 위치 */
  transform: translateY(-50%); /* 세로 중앙 정렬 */
  font-size: 16px;
  font-weight: bold;
  pointer-events: none; /* 클릭 방지 */
  z-index: 1000;
}

.calculate-section {
  display: grid;
  grid-template-columns: repeat(8, 30px);
  grid-template-rows: repeat(4, 37px);
  gap: 8px;
  padding: 0 20px 20px 20px;

  width: fit-content;
  margin: 0 auto; /* 가운데 정렬 */
}

.calculate-section__button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  border-radius: 4px;
}

.calculate-section__image:hover {
  cursor: pointer;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;

  padding-top: 80px;
  padding-bottom: 250px; /* footer 높이만큼 여유를 둠 */
}
</style>
