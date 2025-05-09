<template>
  <Form
    @submit="onSubmit"
    :validation-schema="ResetPasswordRequestSchema"
    v-slot="{ errors }"
    v-if="userData"
    class="flex-auto flex w-1/2 md:flex-none grid grid-cols lg:gap-4 mx-auto lg:col-span items-center space-y-4"
  >
    <p class="flex lg:text-5xl text-3xl font-normal antialiased pb-4">Reset your password</p>
    <span class="flex text-gray-500 mb-6 lg:text-xl text-xl font-normal antialiased pb-4"
      >Please enter your new password</span
    >
    <div class="relative z-0 w-full py-2 mb-5 group">
      <Field
        type="password"
        name="password"
        id="password"
        class="block p-4 w-full text-lg lg:text-2xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
        :class="{ 'is-invalid': errors.password }"
        v-model="userData.password"
      />
      <label
        for="password"
        class="peer-focus:font-medium absolute text-2xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-9"
        >Password</label
      >
      <div class="invalid-feedback text-lg text-red-700">{{ errors.password }}</div>
    </div>
    <div class="relative z-0 w-full mb-5 group">
      <Field
        type="password"
        name="confirmPassword"
        id="floating_repeat_password"
        class="block p-4 w-full text-lg lg:text-2xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
        :class="{ 'is-invalid': errors.confirmPassword }"
        v-model="userData.confirmPassword"
      />
      <label
        for="floating_repeat_password"
        class="peer-focus:font-medium absolute text-2xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-10 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-11"
        >Confirm password</label
      >
      <div class="invalid-feedback text-lg text-red-700">{{ errors.confirmPassword }}</div>
    </div>

    <button
      type="submit"
      class="flex text-white bg-red-500 lg:text-xl justify-center-safe hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm sm:w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
    >
      Save
    </button>
    <span class="lg:text-xl">
      Already have account? <RouterLink :to="{ name: authRoute.login }">Log in</RouterLink>
    </span>
  </Form>
</template>

<script lang="ts" setup>
import { Form, Field } from 'vee-validate'
import { ResetPasswordRequestSchema } from '../../../validations/auth'
import { type ResetPasswordRequestType } from '../../../types/authType'
import { ref, onMounted, watch } from 'vue'
import { authRoute } from '@/configs'

const props = defineProps<{
  resetData: ResetPasswordRequestType
  handler: () => Promise<void>
}>()

const emit = defineEmits<{
  (e: 'update:resetData', value: ResetPasswordRequestType): void
}>()

const userData = ref<ResetPasswordRequestType>({
  password: '',
  confirmPassword: '',
  resetToken: props.resetData.resetToken,
})

watch(
  userData,
  (newValue) => {
    emit('update:resetData', newValue)
  },
  { deep: true },
)

const onSubmit = async () => {
  try {
    await props.handler()
  } catch (error) {
    throw error
  }
}

onMounted(() => {
  if (props.resetData) {
    userData.value = {
      ...props.resetData,
      resetToken: props.resetData.resetToken,
    }
  }
})
</script>
