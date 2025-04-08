<template>
  <div class="dropdown">
    <button
      class="btn btn-outline-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
    >
      {{ modelValueLabel || label }}
    </button>

    <div class="dropdown-menu p-3" style="min-width: 300px">
      <div class="d-flex justify-content-between mb-2">
        <input
          type="number"
          class="form-control text-center"
          placeholder="최저"
          v-model.number="minInput"
        />
        <span class="px-2">-</span>
        <input
          type="number"
          class="form-control text-center"
          placeholder="최고"
          v-model.number="maxInput"
        />
      </div>

      <div class="row g-2 mb-3">
        <div class="col-6" v-for="(option, index) in predefinedRanges" :key="index">
          <button
            class="btn btn-light w-100"
            :class="{ 'btn-warning': isSelected(option) }"
            @click="selectRange(option)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-outline-dark w-45" @click="clearFilter">초기화</button>
        <button class="btn btn-warning w-45" @click="applyRange">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [String, Object],
})
const emit = defineEmits(['update:modelValue'])

const predefinedRanges = ref([
  { label: '0-39,999', min: 0, max: 39999 },
  { label: '40,000-99,999', min: 40000, max: 99999 },
  { label: '100,000-199,999', min: 100000, max: 199999 },
  { label: '200,000-299,999', min: 200000, max: 299999 },
  { label: '300,000-599,999', min: 300000, max: 599999 },
  { label: '600,000-1,999,999', min: 600000, max: 1999999 },
])

const minInput = ref(null)
const maxInput = ref(null)

const modelValueLabel = computed(() => {
  if (props.modelValue && typeof props.modelValue === 'object') {
    const { min, max } = props.modelValue
    if (min && max) return `${min.toLocaleString()} ~ ${max.toLocaleString()}`
    if (min) return `≥ ${min.toLocaleString()}`
    if (max) return `≤ ${max.toLocaleString()}`
    return props.label
  }
  return props.modelValue || ''
})

const isSelected = (option) => {
  return (
    props.modelValue &&
    typeof props.modelValue === 'object' &&
    props.modelValue.min === option.min &&
    props.modelValue.max === option.max
  )
}

const selectRange = (option) => {
  minInput.value = option.min
  maxInput.value = option.max
  emit('update:modelValue', { type: 'range', min: option.min, max: option.max })
}

const applyRange = () => {
  emit('update:modelValue', {
    type: 'range',
    min: minInput.value,
    max: maxInput.value,
  })
}

const clearFilter = () => {
  minInput.value = null
  maxInput.value = null
  emit('update:modelValue', '')
}
</script>

<style scoped>
.w-45 {
  width: 45%;
}
</style>
