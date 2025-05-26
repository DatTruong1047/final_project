import Yup from 'yup'

export const ChatSchema = Yup.object().shape({
  query: Yup.string().required('Message is required'),
})

export const ChatResponseSchema = Yup.object().shape({
  query: Yup.string().required('Query is required'),
  response: Yup.string().required('Response is required'),
})

