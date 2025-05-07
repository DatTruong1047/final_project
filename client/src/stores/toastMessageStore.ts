import { ToastEnum } from '@/types/enum'
import { defineStore } from 'pinia'

interface State {
  isShowToast: boolean
  toastType: ToastEnum
  toastMessage: string
}

export const useToastMessageStore = defineStore('toastMessage', {
  state: (): State => {
    return {
      isShowToast: false,
      toastType: ToastEnum.Success,
      toastMessage: 'Infomation',
    }
  },
})
