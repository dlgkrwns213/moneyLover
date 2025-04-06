<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <h2>Post ID: {{ postId }}</h2>
      <p>게시글 내용을 여기에 표시하세요.</p>
      <button @click="close">닫기</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const postId = route.params.id

const close = () => {
  router.push('/') // 모달 닫으면 홈으로
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
}
</style>
