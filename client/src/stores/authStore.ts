import { defineStore } from 'pinia'

export interface User {
  email: string
  fullName: string | null
  phoneNumber: string | null
  address: string | null
  media: {
    url: string
  }
}

interface State {
  accessToken: string
  refreshToken: string
  user: User | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): State => {
    return {
      accessToken: '',
      refreshToken: '',
      user: null,
      isAuthenticated: false,
    }
  },

  actions: {
    setAccessToken(newToken: string) {
      this.accessToken = newToken
    },

    setRefreshToken(newToken: string) {
      this.refreshToken = newToken
    },

    setUser(newUser: User) {
      this.user = newUser
      this.isAuthenticated = true
    },

    logout() {
      this.accessToken = ''
      this.refreshToken = ''
      this.user = null
      this.isAuthenticated = false
    },
  },
})
