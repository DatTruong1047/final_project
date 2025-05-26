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
      accessToken: localStorage.getItem('accessToken') || '',
      refreshToken: localStorage.getItem('refreshToken') || '',
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      isAuthenticated: localStorage.getItem('accessToken') !== null,
    }
  },

  actions: {
    setAccessToken(newToken: string) {
      localStorage.setItem('accessToken', newToken)
      this.accessToken = newToken
    },

    setRefreshToken(newToken: string) {
      localStorage.setItem('refreshToken', newToken)
      this.refreshToken = newToken
    },

    setUser(newUser: User) {
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(newUser))
      this.user = newUser
    },

    logout() {
      this.accessToken = ''
      this.refreshToken = ''
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },
  },
})
