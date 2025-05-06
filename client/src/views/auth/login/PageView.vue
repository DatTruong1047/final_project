<template>
  <div class="bg-gray-50">
    <div v-if="isLoading" class="flex justify-center-safe items-center h-[80vh]">
      <LoadingComponent />
    </div>

    <template v-else>
      <div v-if="isShowToast" class="flex justify-end">
        <ToastComponent :type="toastType" :message="toastMessage" />
      </div>
      <div class="flex lg:grid lg:grid-cols-2 max-lg:p-4 justify-center-safe items-center">
        <div class="side_image col-span max-lg:hidden">
          <img src="/images/Side_Image.png" class="w-[60rem]" />
        </div>
        <FormComponent :data="user" :handler="onLogin" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router'
import { login } from '@/api'
import { useAuthStore } from '@/stores'
import { ErrorCodes } from '@/configs/errorConfig'
import { ToastEnum } from '@/types/enum'
import type { AxiosResponse } from 'axios'
import type { LoginRequestType } from '@/types/authType'

import FormComponent from '@/components/auth/login/FormComponent.vue'
import ToastComponent from '@/components/molecules/_utils/ToastComponent.vue'
import LoadingComponent from '@/components/_utils/LoadingComponent.vue'

const authStore = useAuthStore()
const user = ref<LoginRequestType>({
  email: '',
  password: '',
})
const isShowToast = ref<boolean>(false)
const toastType = ref<ToastEnum>(ToastEnum.Info)
const toastMessage = ref<string>('')
const isLoading = ref<boolean>(false)

const showToast = (type: ToastEnum, message: string) => {
  toastType.value = type
  toastMessage.value = message
  isShowToast.value = true

  setTimeout(() => {
    isShowToast.value = false
  }, 3000)
}

const redirectToHome = () => {
  router.push('/')
}

const saveTokens = (res: AxiosResponse) => {
  authStore.setAccessToken(res.data.accessToken)
  authStore.setRefreshToken(res.data.refreshToken)
}

const onLogin = async () => {
  try {
    const res = await login(user.value)

    saveTokens(res)

    showToast(ToastEnum.Success, 'Login successfull')

    redirectToHome()
  } catch (e: unknown) {
    if (e === ErrorCodes.EMAIL_IS_NOT_VERIFIED) {
      showToast(ToastEnum.Error, 'Email is not verify')
    } else if (e === ErrorCodes.USER_NOT_FOUND || e === ErrorCodes.INCORRECT_PASSWORD) {
      showToast(ToastEnum.Error, 'Email or password was wrong')
    } else {
      showToast(ToastEnum.Error, 'Login fail')
    }
  } finally {
    isLoading.value = false
  }
}
</script>
