<template>
  <div>
    <div class="flex lg:grid lg:grid-cols-2 max-lg:p-4 justify-center-safe items-center bg-gray-50">
      <div class="side_image col-span max-lg:hidden">
        <img src="/images/Side_Image.png" class="w-[60rem]" />
      </div>
      <FormComponent :data="user" :handler="onLogin" class="w-[100%]" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type LoginRequestType } from '@/types/authType'
import FormComponent from '@/components/auth/login/FormComponent.vue'
import { login } from '@/api'

import { ref } from 'vue'
import router from '@/router'
import { useAuthStore } from '@/stores'
import type { AxiosResponse } from 'axios'

const authStore = useAuthStore()

const user = ref<LoginRequestType>({
  email: '',
  password: '',
})

const redirectToHome = () => {
  router.replace('/')
}

const saveTokens = (res: AxiosResponse) => {
  authStore.setAccessToken(res.data.data.accessToken)
  authStore.setRefreshToken(res.data.data.refreshToken)
}

const onLogin = async () => {
  try {
    if (user.value) {
      const res = await login(user.value)

      if (res.status == 200) {
        saveTokens(res)

        alert('Login successfull.')

        redirectToHome()
      }
    }
  } catch (e) {
    console.log(e)

    alert(`Login failed.`)
  }
}
</script>
