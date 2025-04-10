<script setup>
import { ref } from 'vue'

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true,
  },
})

const emit = defineEmits(['close', 'date-selected'])
const innerSelectedDate = ref(props.selectedDate)

function emitSelectedDateAndClose() {
  emit('date-selected', innerSelectedDate.value)
  emit('close')
}

function emitClose() {
  emit('date-selected', props.selectedDate)
  emit('close')
}

const today = new Date()
const minDate = new Date(2020, 0, 1)
const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
const fromPage = { month: today.getMonth() + 1, year: today.getFullYear() }

function formatDateLocal(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDateWithWeekday(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' })
  return `${y}-${m}-${d} ${weekday}`
}

function onDayClick(day) {
  innerSelectedDate.value = day.date
}
</script>

<template>
  <div class="modal-backdrop" @click.self="emit('close')">
    <div class="modal-content">
      <h2>
        <img src="@/assets/images/income/salary.png" alt="달력 아이콘" class="calendar-icon" />
        입력할 날짜를 선택하세요.
      </h2>
      <div class="container">
        <v-calendar v-model="innerSelectedDate" :max-date="maxDate">
          <template #day-content="{ day }">
            <div
              class="day-content"
              :class="{
                selected:
                  innerSelectedDate &&
                  formatDateLocal(innerSelectedDate) === formatDateLocal(day.date),
                disabled: day.date > maxDate,
              }"
              @click="onDayClick(day)"
            >
              <span>{{ day.day }}</span>
            </div>
          </template>
        </v-calendar>

        <div class="event-panel">
          <h5>
            선택 날짜:
            <span class="selected-date"> {{ formatDateWithWeekday(innerSelectedDate) }}요일 </span>
          </h5>
        </div>
      </div>

      <div class="button-group">
        <button class="close-btn" @click="emitClose">닫기</button>
        <button class="confirm-btn" @click="emitSelectedDateAndClose">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f4f6f9;
  border-radius: 12px;
}
.modal-content h2 {
  font-size: 16px;
  font-family: 'MyfontBold';
}
.calendar-icon {
  width: 22px;
  height: 22px;
  vertical-align: middle;
  margin-left: 10px;
  margin-right: 3px;
}
.event-panel h5 {
  margin-top: 10px;
  font-size: 16px;
}

:deep(.vc-day) {
  position: relative;
  min-height: 45px;
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  gap: 2px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  width: 45px;
  height: 45px;
  transition: all 0.3s;
}

.day-content.selected {
  border: 2px solid #61905a !important;
  font-weight: bold;
}

.day-content.disabled {
  pointer-events: none;
  opacity: 0.3;
}

.button-group {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1.5rem;
}

.button-group button {
  width: 28%;
  padding: 0.75rem 1rem;
  margin: 0 2%;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

/* 확인 버튼 */
.confirm-btn {
  border: 1px solid #61905a !important; /* 초록색 border */
  color: #61905a;
}
.confirm-btn:hover {
  background-color: #e8f5e9;
  color: #497552;
}

/* 닫기 버튼 */
.close-btn {
  border: 1px solid #e71313 !important; /* 빨간색 border */
  color: #e01010;
}
.close-btn:hover {
  background-color: #ffebee;
  color: #c62828;
}
</style>
