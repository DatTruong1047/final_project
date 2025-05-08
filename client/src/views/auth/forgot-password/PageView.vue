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
        <FormComponent :user="userData" :handler="onForgotPassword" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { forgotPassword } from '@/api'

import { useToast } from '@/hooks/useToast'
import { useI18n } from 'vue-i18n'

import { ErrorCodes } from '@/configs/errorConfig'
import { ToastEnum } from '@/types/enum'
import { type ForgotPasswordRequestType } from '@/types/authType'

import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'
import FormComponent from '@/components/auth/forgot-password/FormComponent.vue'

const isLoading = ref(false)
const userData = ref<ForgotPasswordRequestType>({
  email: '',
})

const { t } = useI18n()
const { showToast } = useToast()
const onForgotPassword = async () => {
  try {
    isLoading.value = true
    await forgotPassword(userData.value)

    showToast(ToastEnum.Success, t('message.success.forgotPassword'))
  } catch (e: unknown) {
    if (e === ErrorCodes.USER_NOT_FOUND) {
      showToast(ToastEnum.Error, t('message.error.userNotFound'))
    } else if (e === ErrorCodes.SENT_EMAIL_FAIL) {
      showToast(ToastEnum.Error, t('message.error.sendEmailFail'))
    } else {
      showToast(ToastEnum.Error, t('message.error.serverError'))
    }
  } finally {
    isLoading.value = false
  }
}
</script>
