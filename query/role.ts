import { useMutation, useQuery } from '@tanstack/react-query'
import { join } from 'path'
import { api } from '~/core/utils/service'
import { DefaultRes, FindReq, PaginationReq, PaginationRes, UpdateReq } from '~/types/axios'
import { MutationParams, QueryParams } from '~/types/query'
import { PermissionData } from './permission'

export const filename = 'role'

export type RoleData = {
  id: string
  name: string
  description: string
  totalUsers: number
  totalPermissions: number
  createdAt: Date
  updatedAt: Date
  permissions: PermissionData[]
}

export type ListRoleFilter = {
  name?: string
}
export type ListRoleRes = PaginationRes<RoleData>
export const useListRole = ({ params, ...rest }: QueryParams<PaginationReq<ListRoleFilter>>) => {
  return useQuery({
    queryKey: [join(filename, 'role'), params],
    queryFn: async () => {
      const response = await api.get<ListRoleRes>('/role', { params })
      return response.data
    },
    ...rest,
  })
}
export type FindRoleRes = DefaultRes<RoleData>
export const useFindRole = ({ params, ...rest }: QueryParams<FindReq>) => {
  return useQuery({
    queryKey: [join(filename, 'find'), params],
    queryFn: async () => {
      const response = await api.get<FindRoleRes>(`/role/${params?.id}`)
      return response.data
    },
    ...rest,
  })
}
export const useDeleteRole = ({ onSuccess, onError }: MutationParams<FindRoleRes>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<FindRoleRes>(`/role/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })
}

export type CreateRoleParams = {
  name: string
  description: string
  permissionIds: string[]
}
export const useCreateRole = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: CreateRoleParams) => {
      const response = await api.post<DefaultRes>(`/role`, { ...params, permissionIds: params.permissionIds })
      return response.data
    },
    onSuccess,
    onError,
    onSettled: () => {},
  })
}
export type UpdateRoleParams = CreateRoleParams
export const useUpdateRole = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: UpdateReq<UpdateRoleParams>) => {
      const response = await api.post<DefaultRes>(`/role/${params.id}`, {
        ...params.body,
        permissionIds: params.body.permissionIds,
      })
      return response.data
    },
    onSuccess,
    onError,
  })
}
