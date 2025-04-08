<template>
  <div class="container">
    <div class="sign-in-wrap">
      <!-- <img src="" alt="" /> -->
      <form class="input-sign-in-group">
        <div class="input-row">
          <label for="input-id">아이디:</label>
          <input type="text" id="input-id" class="input" />
        </div>
        <div class="input-row">
          <label for="input-pw">비밀번호:</label>
          <input type="password" id="input-pw" class="input" />
        </div>
      </form>
      <div class="sign-up-link">
        <RouterLink to="/signup">회원가입</RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>
<style scoped>
.container {
  width: 360px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
.sign-in-wrap {
  padding: 0px;
}
.input-sign-in-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 10px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  font-size: 16px;
  font-family: 'MyFontBold';
}

label {
  width: 90px;
  font-weight: bold;
  text-align: left;
}

.input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: none;
  border-bottom: 2px solid #61905a;
  outline: none;
  background-color: transparent;
}
.sign-up-link {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}
.sign-up-link a {
  color: #999;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-size: 14px;
  font-family: 'MyFont';
  cursor: pointer;
}
</style>
