<template>
  <Form
    @submit="onSubmit"
    :validation-schema="LoginRequestSchema"
    v-slot="{ errors }"
    v-if="userData"
    class="flex-auto w-1/2 md:flex-none grid grid-cols lg:gap-4 mx-auto lg:col-span items-center space-y-4"
  >
    <p class="flex lg:text-5xl text-3xl font-normal antialiased pb-4">Login</p>
    <span class="flex text-gray-500 mb-6 lg:text-xl text-xl font-normal antialiased pb-4"
      >Please enter your email and password to login</span
    >
    <div class="relative z-0 w-full mb-5 md:mt-4 group text-2xl">
      <Field
        type="email"
        name="email"
        id="floating_email"
        class="block p-4 w-full lg:text-2xl text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
        :class="{ 'is-invalid': errors.email }"
        v-model="userData.email"
      />
      <label
        for="floating_email"
        class="peer-focus:font-medium absolute text-2xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-10 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-12"
        >Email</label
      >
      <div class="invalid-feedback text-lg text-red-700">{{ errors.email }}</div>
    </div>
    <div class="relative z-0 w-full mb-5 mt-4 group">
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
        class="peer-focus:font-medium absolute text-2xl text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-10 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-12"
        >Password</label
      >
      <div class="invalid-feedback text-lg text-red-700">{{ errors.password }}</div>
    </div>

    <div class="flex justify-between gap-4 items-center">
      <button
        type="submit"
        class="flex w-1/2 md:w-2/5 rounded text-white bg-red-500 lg:text-xl md:py-4 justify-center-safe hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
      >
        Login
      </button>
      <RouterLink class="flex text-red-500 lg:text-2xl" :to="authRoute.forgotPassword"
        >Forgot password</RouterLink
      >
    </div>
  </Form>
</template>

<script lang="ts" setup>
import { Form, Field } from 'vee-validate'
import { LoginRequestSchema } from '../../../validations/auth'
import { type LoginRequestType } from '../../../types/authType'
import { ref, onMounted } from 'vue'
import { authRoute } from '@/configs'

const userData = ref<LoginRequestType>()

const props = defineProps<{
  data: LoginRequestType
  handler: () => Promise<void>
}>()

const onSubmit = async () => {
  try {
    props.handler()
  } catch (error) {
    throw error
  }
}

onMounted(() => {
  if (props.data) {
    userData.value = props.data
  }
})
</script>
