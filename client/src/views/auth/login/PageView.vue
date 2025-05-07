<template>
  <div class="bg-gray-50">
    <div v-if="isLoading" class="flex justify-center-safe items-center h-[80vh]">
      <LoadingComponent />
    </div>

    <template v-else>
      <div class="flex lg:grid lg:grid-cols-2 max-lg:p-4 justify-center-safe items-center">
        <div class="side_image col-span max-lg:hidden">
          <img src="/images/side-image.png" class="w-[60rem]" />
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
import { useToast } from '@/hooks/useToast'
import { useI18n } from 'vue-i18n'

import { ErrorCodes } from '@/configs/errorConfig'
import { ToastEnum } from '@/types/enum'
import type { AxiosResponse } from 'axios'
import type { LoginRequestType } from '@/types/authType'

import FormComponent from '@/components/auth/login/FormComponent.vue'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'

const authStore = useAuthStore()
const { showToast } = useToast()

const user = ref<LoginRequestType>({
  email: '',
  password: '',
})
const isLoading = ref<boolean>(false)

const { t } = useI18n()
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

    showToast(ToastEnum.Success, t('message.success.login'))

    redirectToHome()
  } catch (e: unknown) {
    if (e === ErrorCodes.EMAIL_IS_NOT_VERIFIED) {
      showToast(ToastEnum.Error, t('message.error.emailIsNotVerified'))
    } else if (e === ErrorCodes.USER_NOT_FOUND || e === ErrorCodes.INCORRECT_PASSWORD) {
      showToast(ToastEnum.Info, t('message.error.loginFail'))
    } else {
      showToast(ToastEnum.Error, t('message.error.serverError'))
    }
  } finally {
    isLoading.value = false
  }
}
</script>
