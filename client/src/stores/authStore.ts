import { defineStore } from 'pinia'

interface State {
  accessToken: string
  refreshToken: string
}

export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      accessToken: '',
      refreshToken: '',
    }
  },

  actions: {
    setAccessToken(newToken: string) {
      this.accessToken = newToken
    },

    setRefreshToken(newToken: string) {
      this.refreshToken = newToken
    },
  },
})
