<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <div class="user-id">
        <span>유저 아이디: {{ userId }}</span>
      </div>
      <div class="input-wrap">
        <div class="input-row">
          <span>현재 비밀번호:</span>
          <input type="password" v-model="currentPassword" />
        </div>
        <div class="input-row">
          <span>새 비밀번호:</span>
          <input type="password" v-model="newPassword" />
        </div>
        <div class="input-row">
          <span>새 비밀번호 확인:</span>
          <input type="password" v-model="checkPassword" />
        </div>
      </div>
      <div class="btn-wrap">
        <button class="btn" @click="changePassword">확인</button>
        <button class="btn" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { hashPassword } from '@/utils/hash'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const userStore = useUserStore()

const userId = ref('')
const url = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const checkPassword = ref('')

onMounted(async () => {
  url.value = `http://localhost:3000/users?id=${userStore.userId}`
  const res = await axios.get(url.value)
  const user = res.data[0]
  userId.value = user.user
})

const changePassword = async () => {
  if (!currentPassword.value || !newPassword.value || !checkPassword.value) {
    Swal.fire({
      icon: 'warning',
      title: '모든 항목을 입력해 주세요.',
      timer: 1000,
      showConfirmButton: false,
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        confirmButton: 'swal-confirm',
      },
    })
    return
  }

  const res = await axios.get(url.value)
  const user = res.data[0]

  const curPw = hashPassword(currentPassword.value)
  const newPw = hashPassword(newPassword.value)
  const chkPw = hashPassword(checkPassword.value)

  if (user.password !== curPw) {
    Swal.fire({
      icon: 'warning',
      title: '현재 비밀번호가 일치하지 않습니다.',
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

  if (newPw !== chkPw) {
    Swal.fire({
      icon: 'warning',
      title: '새 비밀번호가 일치하지 않습니다.',
      text: '비밀번호를 확인해 주세요.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        popup: 'swal-popup',
        confirmButton: 'swal-confirm',
      },
    })
    return
  }

  try {
    await axios.put(`http://localhost:3000/users/${user.id}`, {
      ...user,
      password: newPw,
    })
    Swal.fire({
      icon: 'success',
      title: '비밀번호가 성공적으로 변경되었습니다.',
      confirmButtonColor: '#429f50',
      customClass: {
        title: 'swal-title',
        confirmButton: 'swal-confirm',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/signin')
      }
    })
    router.push('/')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '비밀번호 변경에 실패했습니다.',
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
</script>

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
  border-radius: 12px;
  padding: 20px;
  width: 320px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.input-wrap {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-row {
  display: flex;
  flex-direction: column;
  font-family: 'MyFont';
}

.input-row span {
  margin-bottom: 4px;
  font-weight: bold;
}

input {
  padding: 6px;
  border: none;
  border-bottom: 2px solid #61905a;
  background-color: transparent;
  outline: none;
  caret-color: #61905a;
}

.btn-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 6px 16px;
  border: 1px solid #61905a;
  border-radius: 8px;
  background: white;
  font-family: 'MyFont';
  cursor: pointer;
}

.btn:hover {
  background-color: #f0f5f0;
}
</style>
