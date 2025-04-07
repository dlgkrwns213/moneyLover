<script setup>
import { ref } from 'vue';
import { computed } from 'vue';
import AddTabIncome from './AddTabIncome.vue';
import AddTabOutcome from './AddTabOutcome.vue';
import button_1 from '@/assets/images/keyboard/button_1.png';
import button_2 from '@/assets/images/keyboard/button_2.png';
import button_3 from '@/assets/images/keyboard/button_3.png';
import button_back from '@/assets/images/keyboard/button_back.png';
import button_4 from '@/assets/images/keyboard/button_4.png';
import button_5 from '@/assets/images/keyboard/button_5.png';
import button_6 from '@/assets/images/keyboard/button_6.png';
import button_pl from '@/assets/images/keyboard/button_pl.png';
import button_mu from '@/assets/images/keyboard/button_mu.png';
import button_7 from '@/assets/images/keyboard/button_7.png';
import button_8 from '@/assets/images/keyboard/button_8.png';
import button_9 from '@/assets/images/keyboard/button_9.png';
import button_mi from '@/assets/images/keyboard/button_mi.png';
import button_di from '@/assets/images/keyboard/button_di.png';
import button_dot from '@/assets/images/keyboard/button_dot.png';
import button_0 from '@/assets/images/keyboard/button_0.png';
import button_cdr from '@/assets/images/keyboard/button_cdr.png';
import button_check from '@/assets/images/keyboard/button_check.png';
import { useRouter } from 'vue-router';
import { getEntryFromPath } from '@/utils/navigation';

const router = useRouter();

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
};

const tabIdx = ref(0);
const calculateContent = [1, 2, 3, "<", 4, 5, 6, "+", "x", 7, 8, 9, "-", "%", ".", 0, "cdr", "="]
const contentImage = [1, 2, 3, "back", 4, 5, 6, "pl", "mu", 7, 8, 9, "mi", "di", "dot", 0, "cdr", "check"]
const inputValue = ref('0');  // 계산기 버튼 입력값
const memo = ref('');

const formattedValue = computed(() => {
  let num = inputValue.value.replace(/,/g, ''); // 기존의 , 제거
  if (num === '') return ''; // 빈 값인 경우 빈 문자열 반환

  // 숫자만 있을 경우
  if (!/[+\-x%]/.test(num)) {
    return parseInt(num).toLocaleString(); // 숫자만 있는 경우 , 추가
  }

  // 연산자와 숫자가 있는 경우
  let result = '';
  let parts = num.split(/([+\-x%])/); // 연산자를 기준으로 숫자와 연산자 분리

  parts.forEach((part, index) => {
    if (index === 1) {
      // 연산자는 그대로
      result += part;
    } else if (index === 0 || part !== "") {
      
      // 숫자 부분일 때는 포맷 적용
      result += parseInt(part).toLocaleString();
    } 
  });

  return result;
});


function goBack() {
  const previous = getEntryFromPath();
  if (previous) {
    router.replace(previous); // 히스토리 덮어쓰기 → 뒤로가기 시 +경로 안 남음
  } else {
    router.replace('/'); // fallback
  }
}

function getGridSpan(index) {
  const oneColumnIndexes = [7, 8, 12, 13];
  const span = oneColumnIndexes.includes(index) ? 1 : 2;
  return {
    gridColumn: `span ${span}`
  };
}

function calculateButtonClick(content) {
  function calculate(expression) {
    const formatResult = (num) => {
      const fixed = num.toFixed(2); // 소수 둘째자리까지 고정
      return fixed.endsWith('.00') ? String(parseInt(fixed)) : String(parseFloat(fixed));
    };
    const sign = expression.match(/[+\-x%]/);
    if (sign === null)  // 부호가 없으면 그대로
      return expression;

    const numbers = expression.split(sign);
    const a = Number(numbers[0]);
    const b = Number(numbers[1]);

    switch (sign[0]) {
      case '+':
        return formatResult(a + b);
      case '-':
        return formatResult(a - b);
      case 'x':
        return formatResult(a * b);
      case '%':
        return b !== 0 ? formatResult(a / b) : '0';
      default:
        return '지원하지 않는 연산자입니다.';
    }
  }

  const signs = ["+", "-", "x", "%"];
  if (signs.includes(content)) {  // 사칙연산이면
    if (signs.includes(inputValue.value[inputValue.value.length-1])) {  // 사칙연산 교체
      inputValue.value = inputValue.value.slice(0, -1) + content;
    } else {
      inputValue.value = calculate(inputValue.value);
      inputValue.value += content;
    }
  } else if (content == "=") {   // 최종
    if (signs.includes(inputValue.value[inputValue.value.length-1])) 
      inputValue.value = inputValue.value.slice(0, -1);
    else
      inputValue.value = calculate(inputValue.value);
  } else if (content == "<") {  // 한개 삭제
    inputValue.value = inputValue.value !== '0' ? inputValue.value.slice(0, -1) : '0';
  } else if (content == 'cdr') {
    
  } else {
    if (inputValue.value === '0')  // 0만 있는 경우
      inputValue.value = ''
    else if (inputValue.value.length >= 2 && 
      inputValue.value[inputValue.value.length-1] === '0' && 
      signs.includes(inputValue.value[inputValue.value.length-2]))  // 부호 뒤에 0이 나온 경우
      inputValue.value = inputValue.value.slice(0, -1);
    inputValue.value += content;
  }
}

</script>

<template>
  <div class="header">
    <button class="back-button" @click="goBack">
      <font-awesome-icon :icon="['fas', 'xmark']" class="xmark-icon" />
    </button>

    <div class="tab-wrapper">
      <router-link
        to="/add/outcome"
        class="tab"
        :class="{ active: $route.path === '/add/outcome' }"
      >
        지출
      </router-link>
      <router-link
        to="/add/income"
        class="tab"
        :class="{ active: $route.path === '/add/income' }"
      >
        수입
      </router-link>
    </div>
  </div>

  <div class="scroll-area">
    <router-view />
  </div>

  <div class="footer-calculate">
    <div class="input-container">
      <input v-model="memo" type="text" class="input-memo" placeholder="memo">
      <div class="money">{{ formattedValue }}</div>
    </div>
    <div class="calculate-section">
      <div 
        class="calculate-section__buttton"
        v-for="(content, contentIdx) in calculateContent"
        :key="contentIdx"
        :style="getGridSpan(contentIdx)"
        @click="calculateButtonClick(content)"
      >
      <img 
        :src="imageMap[contentImage[contentIdx]]" 
        :alt="contentImage[contentIdx]" 
        style="height: 100%; width: 100%;"
        class="calculate-section__image"
      />

    </div>
    </div>
  </div>

</template>

<style scoped>
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
  color: #555;
  text-decoration: none;
  padding: 6px 12px;
}

.tab:hover {
  color: rgb(0, 204, 0);
}

.tab.active {
  color: #2e7d32; /* 초록색 */
  border-bottom: 3px solid #2e7d32;
}
.footer-calculate {
  position: fixed;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  background-color: gray;
  z-index: 100;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 100%;
}
.input-container {
  position: relative;
  width: 300px; /* 컨테이너 너비 */
}

.input-memo {
  width: 100%;
  height: 30px;
  margin: 10px 0 ; /* 위 아래 margin만 설정 */
  border-radius: 10px;
  text-align: left;
  padding: 0 15px;
}

.money {
  position: absolute;
  top: 50%;
  right: 15px; /* input 박스 오른쪽에 위치 */
  transform: translateY(-50%); /* 세로 중앙 정렬 */
  font-size: 16px;
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