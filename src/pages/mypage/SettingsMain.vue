<template>
  <div class="container">
    <header class="setting-header">
      <h4 class="custom-bold">설정</h4>
    </header>
    <div class="setting-wrap">
      <div class="detail-wrap">
        <!-- 아이콘 클릭시 input file 실행 -->
        <div class="icon" @click="triggerUpload">
          <img :src="icon" alt="user_img" />
          <input
            type="file"
            ref="fileInput"
            accept=".png, .jpg, .jpeg, .gif"
            @change="handleFileChange"
            style="display: none"
          />
        </div>
        <div class="username-wrap">
          <span>이름</span>
          <span>{{ username }}</span>
        </div>
      </div>
      <div class="settings-list">
        <ul class="list-row">
          <li><span class="settings-text" @click="showPwModal = true">비밀번호 변경</span></li>
          <li><span class="settings-text" @click="handleLogout">로그아웃</span></li>
        </ul>
      </div>
    </div>

    <!-- 비밀번호 변경 모달 -->
    <ChangePassword v-if="showPwModal" @close="showPwModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'
import ChangePassword from '../login/ChangePassword.vue'

const router = useRouter()
const userStore = useUserStore()

const showPwModal = ref(false)
const username = ref('')
const icon = ref('/src/assets/images/user/user_icon_1.png')
const fileInput = ref(null)

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (event) => {
    const base64 = event.target.result

    try {
      const res = await axios.get(`http://localhost:3000/users?id=${userStore.userId}`)
      const user = res.data[0]

      await axios.put(`http://localhost:3000/users/${user.id}`, {
        ...user,
        icon: base64,
      })

      icon.value = base64
    } catch (err) {
      console.error('아이콘 저장 실패:', err)
    }
  }

  reader.readAsDataURL(file)
}

const handleLogout = () => {
  userStore.logout()
  router.push('/signin')
}

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/users?id=${userStore.userId}`)
    const user = res.data[0]
    username.value = user.username
    icon.value = user.icon || icon.value
  } catch (error) {
    console.error('유저 정보 조회 실패:', error)
  }
})
</script>

<style scoped>
.container {
  width: 360px;
  height: 100vh;
  display: flex;
  margin: auto;
}
.setting-header {
  display: flex;
  justify-content: center;
  position: fixed;
  top: 15px;
  left: 0;
  width: 100%;
  z-index: 1000;
}
.custom-bold {
  font-size: 20px;
  font-weight: bold;
  font-family: 'MyFontBold';
}
.detail-wrap {
  width: 320px;
  height: 187px;
  margin-top: 60px;
  border: 1px solid white;
  border-radius: 12px;
  background-color: white;
}

img {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  cursor: pointer;
}
.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 28px;
  margin-bottom: 14px;
}
.username-wrap {
  display: flex;
  justify-content: space-between;
  padding: 0 54px;
  font-family: 'MyFontBold';
  font-size: 14px;
  color: black;
}
.settings-list {
  margin-top: 30px;
}
.settings-text {
  color: #909090;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-family: 'MyFont';
  font-size: 14px;
  cursor: pointer;
}
.list-row {
  display: flex;
  justify-content: right;
  padding: 0;
  gap: 12px;
  list-style: none;
}
</style>
