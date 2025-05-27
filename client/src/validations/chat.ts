import Yup from 'yup'

export const ChatQuerySchema = Yup.object().shape({
  content: Yup.string().required('Message is required'),
  sessionId: Yup.string().required('Session ID is required'),
})

export const ChatSessionResponseSchema = Yup.object().shape({
  id: Yup.string().required('Session ID is required'),
  userId: Yup.string().required('User ID is required'),
  isActive: Yup.boolean().required('Is Active is required'),
  createdAt: Yup.string().required('Created At is required'),
  endAt: Yup.string().required('End At is required'),
  anonymousId: Yup.string().required('Anonymous ID is required'),
})

export const CreateSessionSchema = Yup.object().shape({
  userId: Yup.string().nullable(),
})

export const MergeChatSessionSchema = Yup.object().shape({
  userId: Yup.string().required('User ID is required'),
  anonymousId: Yup.string().required('Anonymous ID is required'),
})

export const ChatMessageSchema = Yup.object().shape({
  id: Yup.string().required('Message ID is required'),
  content: Yup.string().required('Message is required'),
  sessionId: Yup.string().required('Session ID is required'),
  createdAt: Yup.string().required('Created At is required'),
  role: Yup.string().required('Role is required'),
})

export const ChatMessagesResponseSchema = Yup.object().shape({
  messages: Yup.array().of(ChatMessageSchema).required('Messages are required'),
})

