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
        <FormComponent :data="newUser" :handler="onRegister" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '@/router'
import { register } from '@/api'
import { ErrorCodes } from '@/configs/errorConfig'
import { ToastEnum } from '@/types/enum'
import { type RegisterUserRequestType } from '@/types/authType'

import { useToast } from '@/hooks/useToast'
import { useI18n } from 'vue-i18n'

import FormComponent from '@/components/auth/register/FormComponent.vue'
import LoadingComponent from '@/components/atoms/_utils/LoadingComponent.vue'

const { showToast } = useToast()

const newUser = ref<RegisterUserRequestType>({
  email: '',
  password: '',
  confirmPassword: '',
})

const isLoading = ref<boolean>(false)

const { t } = useI18n()
const redirectToHome = () => {
  router.push('/')
}

const onRegister = async () => {
  try {
    isLoading.value = true
    await register(newUser.value)

    showToast(ToastEnum.Success, t('message.success.register'))

    redirectToHome()
  } catch (e) {
    if (e === ErrorCodes.EMAIL_ALREADY_EXISTS) {
      showToast(ToastEnum.Error, t('message.error.emailAlreadyExists'))
    } else {
      showToast(ToastEnum.Error, t('message.error.register'))
    }
  } finally {
    isLoading.value = false
  }
}
</script>
