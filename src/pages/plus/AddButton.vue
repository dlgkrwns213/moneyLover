<script setup>
import { ref } from 'vue'

const props = defineProps({
  cardText: String,
})

const isSelected = ref(false)

const handleClick = () => {
  isSelected.value = !isSelected.value
}
</script>

<template>
  <div class="card-button" @click="handleClick">
    <div
      class="card-picture"
      :class="{ selected: isSelected }"
    >
      <img :src="`/icons/${props.cardText}.png`" :alt="props.cardText">
    </div>
    <div class="card-text">
      {{ props.cardText }}
    </div>
  </div>
</template>

<style scoped>
.card-button {
  cursor: pointer;
}

.card-picture {
  background-color: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  transition: border 0.3s;
}

.card-picture.selected {
  border: 3px solid #4caf50;
}
</style>
