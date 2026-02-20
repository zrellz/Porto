import { useMutation, useQuery } from '@tanstack/react-query'
import { join } from 'path'
import { api } from '~/core/utils/service'
import { DefaultRes, FindReq, PaginationReq, PaginationRes, UpdateReq } from '~/types/axios'
import { MutationParams, QueryParams } from '~/types/query'
import { RoleData } from './role'

export const filename = 'user'

export type UserData = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  roleId: string
  photo: string
  role: RoleData
  emailVerifiedAt: string
  photoUrl: string
}

export type ListUserFilter = {
  name?: string
}
export type ListUserRes = PaginationRes<UserData>
export const useListUser = ({ params, ...rest }: QueryParams<PaginationReq<ListUserFilter>>) => {
  return useQuery({
    queryKey: [join(filename, 'list'), params],
    queryFn: async () => {
      const response = await api.get<ListUserRes>('/user', { params })
      return response.data
    },
    ...rest,
  })
}
export type FindUserRes = DefaultRes<UserData>
export const useFindUser = ({ params, ...rest }: QueryParams<FindReq>) => {
  return useQuery({
    queryKey: [join(filename, 'find'), params],
    queryFn: async () => {
      const response = await api.get<FindUserRes>(`/user/${params?.id}`)
      return response.data
    },
    ...rest,
  })
}
export const useDeleteUser = ({ onSuccess, onError }: MutationParams<FindUserRes>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<FindUserRes>(`/user/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })
}
export const useResendActivationUser = ({ onSuccess, onError }: MutationParams<FindUserRes>) => {
  return useMutation({
    mutationFn: async ({ id, callbackUrl }: { id: string; callbackUrl: string }) => {
      const response = await api.get<FindUserRes>(`/user/${id}/resend-activation`, { params: { callbackUrl } })
      return response.data
    },
    onSuccess,
    onError,
  })
}
export type CreateUserParams = {
  name: string
  email: string
  status?: string
  roleId: string
  callbackUrl: string
}
export const useCreateUser = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: CreateUserParams) => {
      const response = await api.post<DefaultRes>(
        `/user`,
        { ...params },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      return response.data
    },
    onSuccess,
    onError,
    onSettled: () => {},
  })
}
export type UpdateUserParams = CreateUserParams
export const useUpdateUser = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: UpdateReq<UpdateUserParams>) => {
      const response = await api.post<DefaultRes>(
        `/user/${params.id}`,
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
