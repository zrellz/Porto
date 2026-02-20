import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/core/utils/service'
import { DefaultRes, FindReq, UpdateReq } from '~/types/axios'
import { MutationParams, QueryParams } from '~/types/query'
import { RoleData } from './role'
import { CreateUserParams, UserData } from './user'

export type ProfileData = {
  id: string
  name: string
  email: string
  status: string
  roleId: string
  photo: string
  role: RoleData
  emailVerifiedAt: string
  photoUrl: string
  notificationDevice: boolean
  notificationCampaign: boolean
}

export type FindProfileRes = DefaultRes<ProfileData>
export const useFindProfile = (params?: QueryParams<FindReq>) => {
  return useQuery({
    queryKey: ['FindProfile'],
    queryFn: async () => {
      const response = await api.get<FindProfileRes>(`/profile`)
      return response.data
    },
    ...params,
  })
}

export type UpdateAccountParams = Partial<CreateUserParams>

export const useUpdateProfile = ({ onSuccess, onError }: MutationParams<DefaultRes<UserData>>) => {
  return useMutation({
    mutationFn: async (params: UpdateReq<UpdateAccountParams>) => {
      const response = await api.post<DefaultRes<UserData>>(
        `/profile/update-profile`,
        {
          ...params.body,
        },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      return response.data
    },
    onSuccess,
    onError,
  })
}

export type UpdatePasswordParams = {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}
export const useUpdatePassword = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: UpdateReq<UpdatePasswordParams>) => {
      const response = await api.post<DefaultRes>(`/profile/update-password`, {
        ...params.body,
      })
      return response.data
    },
    onSuccess,
    onError,
  })
}

export type NotificationDeviceParams = {
  notificationDevice: number
}
export const useUpdateNotificationDevice = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: UpdateReq<NotificationDeviceParams>) => {
      const response = await api.post<DefaultRes>(`/profile/update-notification-device`, {
        ...params.body,
      })
      return response.data
    },
    onSuccess,
    onError,
  })
}
