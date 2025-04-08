<template>
  <div class="position-relative d-inline-block" ref="menuRef">
    <button class="btn btn-outline-secondary" @click="toggleMenu">
      {{ labelText }}
    </button>

    <div
      v-if="menuVisible"
      class="border rounded shadow p-3 bg-white position-absolute"
      style="z-index: 1000; width: 260px; top: 100%; left: 0; margin-top: 5px"
    >
      <div class="mb-2">
        <label class="form-label">시작 날짜</label>
        <input type="date" class="form-control" v-model="startDate" />
      </div>
      <div class="mb-3">
        <label class="form-label">종료 날짜</label>
        <input type="date" class="form-control" v-model="endDate" />
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-outline-dark w-45" @click="reset">초기화</button>
        <button class="btn btn-warning w-45" @click="apply">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  label: String,
  modelValue: Object, 
})
const emit = defineEmits(['update:modelValue'])

const menuVisible = ref(false)
const menuRef = ref(null)
const startDate = ref(props.modelValue?.start || '')
const endDate = ref(props.modelValue?.end || '')

function toggleMenu() {
  menuVisible.value = !menuVisible.value
}

function apply() {
  emit('update:modelValue', {
    start: startDate.value,
    end: endDate.value,
  })
  menuVisible.value = false
}

function reset() {
  startDate.value = ''
  endDate.value = ''
  emit('update:modelValue', null)
  menuVisible.value = false
}

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuVisible.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

const labelText = computed(() => {
  if (startDate.value && endDate.value) return `${startDate.value} ~ ${endDate.value}`
  if (startDate.value) return `${startDate.value} 이후`
  if (endDate.value) return `${endDate.value} 이전`
  return props.label
})
</script>
