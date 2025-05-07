import { ToastEnum } from '@/types/enum'
import { useToastMessageStore } from '@/stores/toastMessageStore'

export const useToast = () => {
  const toastMessageStore = useToastMessageStore()

  const showToast = (type: ToastEnum, message: string) => {
    toastMessageStore.toastType = type
    toastMessageStore.toastMessage = message
    toastMessageStore.isShowToast = true
    setTimeout(() => {
      toastMessageStore.isShowToast = false
    }, 3000)
  }

  return { showToast }
}
