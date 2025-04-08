<template>
  <div class="container">
    <div class="sign-up-wrap">
      <img src="/src/assets/images/all/logo.png" alt="로고" />
      <form class="input-sign-up-group">
        <div class="input-row">
          <label for="input-id">이름</label>
          <input type="text" id="input-id" class="input" />
        </div>
        <div class="input-row id-check-row">
          <label for="input-id">아이디</label>
          <input type="text" id="input-id" class="input" />
          <button type="button" class="check-btn">체크</button>
        </div>
        <div class="input-row">
          <label for="input-id">비밀번호</label>
          <input type="password" id="input-id" class="input" />
        </div>
        <div class="input-row">
          <label for="input-id">비밀번호 확인</label>
          <input type="password" id="input-id" class="input" />
        </div>
      </form>
      <div class="register">
        <button class="register-btn">등록</button>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.container {
  width: 360px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
img {
  width: 277px;
  height: 55px;
  margin-bottom: 25px;
}
.input-sign-up-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 10px;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  font-size: 16px;
  font-family: 'MyFont';
}
.id-check-row {
  position: relative;
}

.check-btn {
  position: absolute;
  width: 43px;
  height: 27px;
  top: 5px;
  right: 0;
  font-size: 12px;
  border: 1px solid #61905a;
  border-radius: 12px;
  background-color: white;
  font-family: 'MyFont';
  cursor: pointer;
}

.check-btn:hover {
  background-color: #f0f5f0;
}
label {
  width: 80px;
  text-align: left;
}

.input {
  flex: 1;
  padding: 6px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #61905a;
  outline: none;
  background-color: transparent;
}
.register {
  display: flex;
  justify-content: center;
  margin-top: 35px;
}
.register-btn {
  width: 56px;
  height: 35px;
  border: 1px solid #61905a;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'MyFont';
  background-color: white;
}
</style>
