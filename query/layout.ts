import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/core/utils/service'
import { DefaultRes, FindReq, PaginationReq, PaginationRes, UpdateReq } from '~/types/axios'
import { MutationParams, QueryParams } from '~/types/query'
import { DeviceData } from './device'
import { DeviceTrackerData } from './tracker'

export const filename = 'layout'

export interface Coordinate {
  x: number
  y: number
}
export type LayoutData = {
  id: string
  name: string
  description: string
  metadata: any
  fileUrl: string
  thumbnailUrl: string
  createdAt: string
}

export type ListLayoutFilter = {
  name?: string
  description?: string
}
export type ListLayoutRes = PaginationRes<LayoutData>
export const useListLayout = ({ params, ...rest }: QueryParams<PaginationReq<ListLayoutFilter>>) => {
  return useQuery({
    queryKey: [filename, 'layout', params],
    queryFn: async () => {
      const response = await api.get<ListLayoutRes>('/layout', { params })
      return response.data
    },
    ...rest,
  })
}

export const useInfLayout = ({ params, ...rest }: QueryParams<PaginationReq<ListLayoutFilter>>) => {
  return useInfiniteQuery({
    queryKey: [filename, 'inf', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ListLayoutRes>('/layout', {
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

export type LayoutFindData = LayoutData & {
  metadata: any
  updatedAt: string
  devices: LayoutDevice[]
}

export interface LayoutDevice {
  coordinate: Coordinate
  metadata: any
  name: string
  device: DeviceData
  trackers: {
    id: string
    metadata?: any
    tracker: DeviceTrackerData
  }[]
}

export type FindLayoutRes = DefaultRes<LayoutFindData>
export const useFindLayout = ({ params, ...rest }: QueryParams<FindReq>) => {
  return useQuery({
    queryKey: [filename, 'find', params],
    queryFn: async () => {
      const response = await api.get<FindLayoutRes>(`/layout/${params?.id}`)
      return response.data
    },
    ...rest,
  })
}
export const useDeleteLayout = ({ onSuccess, onError }: MutationParams<FindLayoutRes>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<FindLayoutRes>(`/layout/${id}`)
      return response.data
    },
    onSuccess,
    onError,
  })
}

export type CreateLayoutParams = {
  name: string
  description: string
  file: File
}
export const useCreateLayout = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: CreateLayoutParams) => {
      const response = await api.post<DefaultRes>(`/layout`, params, {
        timeout: 0,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess,
    onError,
    onSettled: () => {},
  })
}

export type UpdateLayoutDevice = {
  id: string
  name: string
  metadata?: any
  coordinate: Coordinate
  trackers: { id: string }[]
}

export type UpdateLayoutParams = Partial<CreateLayoutParams> & {
  thumbnail?: File
  metadata?: any
  devices: UpdateLayoutDevice[]
}

export const useUpdateLayout = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: UpdateReq<UpdateLayoutParams>) => {
      const response = await api.post<DefaultRes>(`/layout/${params.id}`, params.body, {
        timeout: 0,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess,
    onError,
  })
}
