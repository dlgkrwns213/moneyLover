<template>
  <div class="container">
    <div class="sign-up-wrap">
      <img src="/src/assets/images/all/logo.png" alt="로고" />
      <form class="input-sign-up-group">
        <div class="input-row">
          <label for="input-id">이름</label>
          <input type="text" id="input-id" class="input" v-model="username" />
        </div>
        <div class="input-row id-check-row">
          <label for="input-id">아이디</label>
          <input type="text" id="input-id" class="input" v-model="user" />
          <button type="button" class="check-btn" @click="checkUserId">체크</button>
        </div>
        <div class="input-row">
          <label for="input-id">비밀번호</label>
          <input type="password" id="input-id" class="input" v-model="password" />
        </div>
        <div class="input-row">
          <label for="input-id">비밀번호 확인</label>
          <input type="password" id="input-id" class="input" v-model="checkPassword" />
        </div>
      </form>
      <div class="register">
        <button class="register-btn" @click="handleRegister">등록</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { hashPassword } from '@/utils/hash'
import Swal from 'sweetalert2'
const router = useRouter()

// 입력받은 정보
const username = ref('')
const user = ref('')
const password = ref('')
const checkPassword = ref('')

const isIdAvailable = ref(false)

const checkUserId = async () => {
  if (!user.value) {
    Swal.fire({
      icon: 'warning',
      title: '아이디를 입력해 주세요.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        confirmButton: 'swal-confirm',
      },
    })
    return
  }

  try {
    const res = await axios.get(`http://localhost:3000/users?user=${user.value}`)
    if (res.data.length > 0) {
      isIdAvailable.value = false
      Swal.fire({
        icon: 'warning',
        title: '이미 존재하는 아이디 입니다..',
        confirmButtonColor: '#429f50',
        customClass: {
          title: 'swal-title',
          popup: 'swal-popup',
          confirmButton: 'swal-confirm',
        },
      })
    } else {
      isIdAvailable.value = true
      Swal.fire({
        icon: 'success',
        title: '사용가능한 아이디 입니다..',
        confirmButtonColor: '#429f50',
        customClass: {
          title: 'swal-title',
          confirmButton: 'swal-confirm',
        },
      })
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '오류가 발생했습니다.',
      text: '잠시후 다시 시도해 주세요.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      },
    })
  }
}

const handleRegister = async () => {
  if (!username.value || !user.value || !password.value || !checkPassword.value) {
    Swal.fire({
      icon: 'warning',
      title: '정보를 입력해 주세요.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      },
    })
    return
  }

  if (!isIdAvailable.value) {
    Swal.fire({
      icon: 'warning',
      title: '아이디 중복 확인을 먼저 진행해 주세요.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      },
    })
    return
  }

  if (password.value !== checkPassword.value) {
    Swal.fire({
      icon: 'warning',
      title: '비밀번호가 일치하지 않습니다.',
      text: '비밀번호를 다시 입력해 주세요.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      },
    })
    return
  }

  // 비밀번호 해시값 설정
  const hashedPassword = hashPassword(password.value)

  const newUser = {
    username: username.value,
    user: user.value,
    password: hashedPassword,
    setAmount: 0,
  }

  try {
    await axios.post('http://localhost:3000/users', newUser)
    Swal.fire({
      icon: 'success',
      title: '회원가입이 완료되었습니다.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/signin')
      }
    })
  } catch (error) {
    console.error('회원가입 오류:', error)
    Swal.fire({
      icon: 'error',
      title: '회원가입 중 오류가 발생했습니다.',
      text: '잠시 후 다시 시도해 주세요.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      },
    })
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
  position: relative;
  z-index: 1001;
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
  caret-color: #61905a;
}
.register {
  display: flex;
  justify-content: center;
  margin-top: 35px;
}
.register-btn {
  width: 56px;
  height: 33px;
  border: 1px solid #61905a;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'MyFont';
  background-color: white;
}
</style>
