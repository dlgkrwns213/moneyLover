<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <h3 class="title">아이콘 변경</h3>
      <div class="icon-options">
        <!-- 예시 아이콘 목록 -->
        <img src="/src/assets/images/user/user_icon_1.png" alt="icon1" />
        <img src="/src/assets/images/user/user_icon_2.png" alt="icon2" />
        <img src="/src/assets/images/all/etc_income.png" alt="사용자 추가" />
      </div>
      <button class="btn" @click="$emit('close')">닫기</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-box {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 300px;
  text-align: center;
}
.icon-options img {
  width: 60px;
  margin: 10px;
  cursor: pointer;
  border: 1px solid #16906a;
  border-radius: 100px;
}
</style>
