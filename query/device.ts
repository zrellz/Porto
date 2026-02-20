import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/core/utils/service'
import { DefaultRes, FindReq, PaginationReq, PaginationRes, UpdateReq } from '~/types/axios'
import { MutationParams, QueryParams } from '~/types/query'

export const filename = 'device'

export type DeviceData = {
  id: string
  serial: string
  name: string
  location: string
  status: 'online' | 'offline'
  createdAt: string
}

export interface DeviceRegisterData {
  id: string
  serial: string
  status: 'online' | 'offline'
  updatedAt: string
}

export type ListDeviceFilter = { name?: string; serial?: string; status?: string }

export type ListUnDeviceRes = PaginationRes<DeviceRegisterData>
export const useListUnDevice = ({ params, ...rest }: QueryParams<PaginationReq<ListDeviceFilter>>) => {
  return useQuery({
    queryKey: [filename, 'list-unregister', params],
    queryFn: async () => {
      const response = await api.get<ListUnDeviceRes>('/device-unregistered', {
        params: { ...params, ...params?.filter },
      })
      return response.data
    },
    ...rest,
  })
}

export type DeviceSummariesRes = DefaultRes<{
  totalDevices: number
  totalOnline: number
  totalOffline: number
  totalUnregister: number
}>

export const useDeviceSummaries = ({ params, ...rest }: QueryParams) => {
  return useQuery({
    queryKey: [filename, 'summaries', params],
    queryFn: async () => {
      const response = await api.get<DeviceSummariesRes>(`/device-summaries`)
      return response.data
    },
    ...rest,
  })
}

export const useDeleteUnDevice = ({ onSuccess, onError }: MutationParams<FindDeviceRes>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<FindDeviceRes>(`/device-unregistered/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })
}

export type ListDeviceRes = PaginationRes<DeviceData>
export const useListDevice = ({ params, ...rest }: QueryParams<PaginationReq<ListDeviceFilter>>) => {
  return useQuery({
    queryKey: [filename, 'list', params],
    queryFn: async () => {
      const response = await api.get<ListDeviceRes>('/device', { params: { ...params, ...params?.filter } })
      return response.data
    },
    ...rest,
  })
}

export const useInfDevice = ({
  params,
  ...rest
}: QueryParams<PaginationReq<ListDeviceFilter> & { layoutId?: string }>) => {
  return useInfiniteQuery({
    queryKey: [filename, 'inf', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ListDeviceRes>('/device', {
        params: { ...params, page: pageParam, ...params?.filter },
      })
      return response.data
    },
    getNextPageParam: (res) =>
      res.paginate.currentPage < res.paginate.lastPage ? res.paginate.currentPage : undefined,
    initialPageParam: 0,
    ...rest,
  })
}

export const useInfAvailDevice = ({
  params,
  ...rest
}: QueryParams<PaginationReq<ListDeviceFilter> & { layoutId?: string }>) => {
  return useInfiniteQuery({
    queryKey: [filename, 'avail-inf', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ListDeviceRes>('/device-available', {
        params: { ...params, page: pageParam, ...params?.filter },
      })
      return response.data
    },
    getNextPageParam: (res) =>
      res.paginate.currentPage < res.paginate.lastPage ? res.paginate.currentPage : undefined,
    initialPageParam: 0,
    ...rest,
  })
}
export type FindDeviceRes = DefaultRes<DeviceData>
export const useFindDevice = ({ params, ...rest }: QueryParams<FindReq>) => {
  return useQuery({
    queryKey: [filename, 'find', params],
    queryFn: async () => {
      const response = await api.get<FindDeviceRes>(`/device/${params?.id}`)
      return response.data
    },
    ...rest,
  })
}
export const useDeleteDevice = ({ onSuccess, onError }: MutationParams<FindDeviceRes>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<FindDeviceRes>(`/device/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })
}
export type CreateDeviceParams = {
  serial: string
  name: string
  location: string
}

export const useCreateDevice = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: CreateDeviceParams) => {
      const response = await api.post<DefaultRes>(
        `/device`,
        { ...params },
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return response.data
    },
    onSuccess,
    onError,
    onSettled: () => {},
  })
}
export type UpdateDeviceParams = Omit<CreateDeviceParams, 'serial'>
export const useUpdateDevice = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: UpdateReq<UpdateDeviceParams>) => {
      const response = await api.post<DefaultRes>(
        `/device/${params.id}`,
        { ...params.body },
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return response.data
    },
    onSuccess,
    onError,
  })
}
