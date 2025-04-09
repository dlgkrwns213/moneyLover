<template>
  <div class="container">
    <div class="sign-in-wrap">
      <img src="/src/assets/images/all/logo.png" alt="로고" />
      <form class="input-sign-in-group">
        <div class="input-row">
          <label for="input-id">아이디:</label>
          <input type="text" id="input-id" class="input" v-model="id" />
        </div>
        <div class="input-row">
          <label for="input-pw">비밀번호:</label>
          <input
            type="password"
            id="input-pw"
            class="input"
            v-model="pw"
            @keydown.enter="tryLogin"
          />
        </div>
      </form>
      <div class="sign-up-link">
        <RouterLink to="/signup">회원가입</RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { hashPassword } from '@/utils/hash'

const id = ref('')
const pw = ref('')
const router = useRouter()
const userStore = useUserStore()

const tryLogin = async () => {
  if (!id.value || !pw.value) {
    alert('아이디와 비밀번호를 입력하세요.')
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/users?user=${id.value}`)
    const user = res.data[0]
    const hashedInput = hashPassword(pw.value)

    if (!user) {
      alert('존재하지 않는 아이디입니다.')
      return
    }

    if (hashedInput !== user.password) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    const fakeToken = 'fake-access-token-1234'
    userStore.login(fakeToken, user.id)
    alert('로그인 성공!')
    router.push('/chart')
  } catch (error) {
    console.error('로그인 에러:', error)
    alert('로그인 중 오류가 발생했습니다.')
  }
}
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
img {
  width: 277px;
  height: 55px;
  margin-bottom: 25px;
}
.sign-in-wrap {
  padding: 0px;
}
.input-sign-in-group {
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
  font-family: 'MyFontBold';
}
label {
  width: 80px;
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
  font-size: 12px;
  font-family: 'MyFont';
  cursor: pointer;
}
</style>
