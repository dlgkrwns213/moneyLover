<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  cardKey: String,
  cardText: String,
  isSelected: Boolean,
})

const emit = defineEmits(['select'])

const imageSrc = ref('')

// 카드 사이즈 지정 (변경 시 여기만 수정)
const cardSize = 50

const handleClick = () => {
  emit('select', props.cardKey)
}

onMounted(async () => {
  try {
    const image = await import(`@/assets/images/all/${props.cardKey}.png`)
    imageSrc.value = image.default
  } catch (err) {
    console.error('이미지를 불러오는 데 실패했습니다:', err)
  }
})
</script>

<template>
  <div class="card-button" @click="handleClick">
    <div
      class="card-picture"
      :class="{ selected: props.isSelected }"
      :style="{ width: cardSize + 'px', height: cardSize + 'px' }"
    >
      <img v-if="imageSrc" :src="imageSrc" :alt="props.cardText" width="30px" height="30px" />
    </div>
    <div class="card-text">
      {{ props.cardText }}
    </div>
  </div>
</template>

<style scoped>
.card-button {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-picture {
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.card-picture.selected {
  border: 2px solid #61905a;
}

.card-text {
  text-align: center;
  margin-top: 8px;
  font-size: 10px;
}
</style>
