<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()


const goToSignIN = () => {
  router.push('/signin')
}

</script>

<template>
    <div class="container-fluid bg-light-green min-vh-100 d-flex flex-column">
      <!-- Header -->
      <header class="text-center py-3">
        <h4 class="custom-bold text-dark fw-bold m-0">설정</h4>
      </header>
  
      <!-- 로그인페이지로 이동 -->
      <div class="text-center my-3">
        <button class="btn" @click="goToSignIN">
          <img src="@/assets/images/settings/Login_button.png" alt="새로운 저축 등록하기" class="img-fluid" />
        </button>
      </div>
      <Navigator />

    </div>
</template>

<style scoped>
.bg-light-green {
  background-color: #F6F6F6;
}
.text-green {
  color: #61905A;
}
.border-green {
  border-color: #61905A !important;
}
.bg-green {
  background-color: #61905A !important;
}
.custom-bold{
font-family: "MYfontBold";
}
.custom-light{
  font-family: "Myfont"
}

* {
  letter-spacing: -0.05em;
}
</style>
