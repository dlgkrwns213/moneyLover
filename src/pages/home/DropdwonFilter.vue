<template>
  <div class="dropdown">
    <button
      class="btn btn-outline-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
    >
      {{ modelValue || label }}
    </button>

    <div class="dropdown-menu p-2 custom-dropdown-menu">
      <div class="category-grid">
        <a
          v-for="option in options"
          :key="option"
          class="dropdown-item text-center"
          href="#"
          @click.prevent="$emit('update:modelValue', option)"
        >
          {{ option }}
        </a>
      </div>
      <hr class="my-2" />
      <a
        class="dropdown-item text-warning text-center"
        href="#"
        @click.prevent="$emit('update:modelValue', '')"
      >
        초기화
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  options: Array,
  modelValue: String,
})
defineEmits(['update:modelValue'])
</script>
<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.custom-dropdown-menu {
  width: 90vw;
  left: 5vw;
  right: 5vw;

}


</style>
