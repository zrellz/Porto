import { useMutation } from '@tanstack/react-query'
import { UserPermType, UserRoleType } from '~/core/contexts/types'

import { api, local } from '~/core/utils/service'
import { DefaultRes } from '~/types/axios'
import { MutationParams } from '~/types/query'

export type LoginData = {
  name: string
  email: string
  id: string
  token: string
  photo_url?: string
  roles: UserRoleType[]
  permissions: UserPermType[]
}
export type LoginParams = {
  email: string
  password: string
  captcha?: string
}
export type LoginRes = DefaultRes<LoginData>
export const useLogin = (props?: MutationParams<LoginRes>) => {
  return useMutation({
    mutationFn: async ({ ...params }: LoginParams) => {
      const response = await api.post<LoginRes>('/auth/login', params)
      return response.data
    },
    ...props,
  })
}
export const useAuthCheck = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get<DefaultRes>('/auth/check-token')
      return response.data
    },
    onSuccess,
    onError,
  })
}
export const useAssignRole = (props?: MutationParams<DefaultRes<UserRoleType>>) => {
  return useMutation({
    mutationFn: async (params: UserRoleType) => {
      const response = await local.post<DefaultRes<UserRoleType>>('/assign-role', params)
      return response.data
    },
    ...props,
  })
}
export const useLogout = (props?: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async () => {
      const response = await local.get<DefaultRes>('/logout')
      return response.data
    },
    ...props,
  })
}

export type ForgotSendReq = { email: string; callbackUrl?: string }
export const useForgotSend = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async ({ ...params }: ForgotSendReq) => {
      const response = await api.post<DefaultRes>('/auth/forgot_password/send', params)
      return response.data
    },
    onSuccess,
    onError,
  })
}
export const useForgotCheck = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async ({ tenant, ...params }: { email: string; token: string; tenant?: string }) => {
      const response = await api.post<DefaultRes>(`/auth/forgot_password/check_token`, params)
      return response.data
    },
    onSuccess,
    onError,
  })
}
export const useForgotSubmit = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async ({ ...params }: { email: string; token: string; password: string }) => {
      const response = await api.post<DefaultRes>('/auth/forgot_password/update_password', params)
      return response.data
    },
    onSuccess,
    onError,
  })
}

export const useActivateCheck = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async ({ ...params }: { email: string; token: string }) => {
      const response = await api.post<DefaultRes>(`/auth/activate/check_token`, params)
      return response.data
    },
    onSuccess,
    onError,
  })
}
export const useActivateAccount = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async ({ ...params }: { email: string; token: string; password: string }) => {
      const response = await api.post<DefaultRes>(`/auth/activate`, params)
      return response.data
    },
    onSuccess,
    onError,
  })
}

export const useActivateEmail = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async ({ ...params }: { email: string; token: string }) => {
      const response = await api.post<DefaultRes>(`/auth/activate/email`, params)
      return response.data
    },
    onSuccess,
    onError,
  })
}

export const useVerifyEmail = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async ({ ...params }: { email: string; token: string; uid: string }) => {
      const response = await api.post<DefaultRes>(`/auth/verify-email`, params)
      return response.data
    },
    onSuccess,
    onError,
  })
}
