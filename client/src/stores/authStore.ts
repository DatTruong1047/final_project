import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')
  const refreshToken = ref('')

  const setAccessToken = (token: string) => {
    accessToken.value = token
  }

  const setRefreshToken = (token: string) => {
    refreshToken.value = token
  }

  return { accessToken, refreshToken, setAccessToken, setRefreshToken }
})
