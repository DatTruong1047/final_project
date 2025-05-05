<template>
  <div>
    <div class="flex lg:grid lg:grid-cols-2 max-lg:p-4 justify-center-safe items-center bg-gray-50">
      <div class="side_image col-span max-lg:hidden">
        <img src="/images/Side_Image.png" class="w-[60rem]" />
      </div>
      <FormComponent :data="newUser" :handler="onRegister" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type RegisterUserRequestType } from '@/types/authType'
import FormComponent from '@/components/auth/register/FormComponent.vue'
import { register } from '@/api'

import { ref } from 'vue'
import router from '@/router'

const newUser = ref<RegisterUserRequestType>({
  email: '',
  password: '',
  confirmPassword: '',
})

const redirectToHome = () => {
  router.replace('/')
}

const onRegister = async () => {
  try {
    if (newUser.value) {
      const res = await register(newUser.value)
      if (res.status == 201) {
        alert('Register successfull. Please check your email')
        redirectToHome()
      }
    }
  } catch {
    alert(`Register failed.`)
  }
}
</script>
