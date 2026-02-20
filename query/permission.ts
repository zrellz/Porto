import { useQuery } from '@tanstack/react-query'
import { join } from 'path'
import { api } from '~/core/utils/service'
import { DefaultRes, PaginationReq, PaginationRes } from '~/types/axios'
import { QueryParams } from '~/types/query'

export const filename = 'permission'

export type PermissionData = {
  id: string
  action: string
  subject: string
}

export type ListPermissionFilter = {
  action: string
  subject: string
}
export type ListPermissionRes = PaginationRes<PermissionData>
export const useListPermission = (params?: QueryParams<PaginationReq<ListPermissionFilter>>) => {
  return useQuery({
    queryKey: [join(filename, 'list'), params],
    queryFn: async () => {
      const response = await api.get<ListPermissionRes>('/permission', { params })
      return response.data
    },
  })
}

export type GroupPermissionData = {
  subject: string
  name: string
  actions: { id: string; action: string }[]
}
export type GroupPermissionRes = DefaultRes<GroupPermissionData[]>
export const useGroupPermission = (props?: QueryParams<PaginationReq>) => {
  return useQuery({
    queryKey: [join(filename, 'group'), props?.params],
    queryFn: async () => {
      const response = await api.get<GroupPermissionRes>('/permission/group', { params: props?.params })
      return response.data
    },
  })
}
