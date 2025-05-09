<template>
  <div class="bg-gray-50 dark:bg-gray-600">
    <div v-if="isLoading" class="flex justify-center-safe items-center h-[80vh]">
      <LoadingComponent />
    </div>

    <template v-else>
      <div class="flex lg:grid lg:grid-cols-2 max-lg:p-4 justify-center-safe items-center">
        <div class="side_image col-span max-lg:hidden">
          <img src="/images/side-image.png" class="w-[60rem]" />
        </div>
        <FormComponent v-model:resetData="resetData" :handler="onResetPassword" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router'
import { resetPassword } from '@/api'
import { ErrorCodes } from '@/configs/errorConfig'
import { ToastEnum } from '@/types/enum'
import { type ResetPasswordRequestType } from '@/types/authType'

import { useToast } from '@/hooks/useToast'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import FormComponent from '@/components/auth/reset-password/FormComponent.vue'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import { authRoute } from '@/configs'

const { showToast } = useToast()
const route = useRoute()
const resetToken = route.params.token as string

const resetData = ref<ResetPasswordRequestType>({
  resetToken: resetToken,
  password: '',
  confirmPassword: '',
})

const isLoading = ref<boolean>(false)

const { t } = useI18n()
const redirectToLogin = () => {
  router.push({ name: authRoute.login })
}

const onResetPassword = async () => {
  try {
    isLoading.value = true
    await resetPassword(resetData.value)

    showToast(ToastEnum.Success, t('message.success.resetPassword'))

    redirectToLogin()
  } catch (e) {
    if (e === ErrorCodes.USER_NOT_FOUND) {
      showToast(ToastEnum.Error, t('message.error.userNotFound'))
    } else {
      showToast(ToastEnum.Error, t('message.error.resetPassword'))
    }
  } finally {
    isLoading.value = false
  }
}
</script>
