import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { api } from '~/core/utils/service'
import { DefaultRes, PaginationReq, PaginationRes } from '~/types/axios'
import { MutationParams, QueryParams } from '~/types/query'

// [ Device Tracker ]

/*
 *
 * GET List Tracker
 */
export interface DeviceTrackerData {
  id: string
  serial: string
  name: string
  createdAt: string
  info: any
}

export type ListDeviceTrackerFilter = { name?: string; serial?: string }

export type ListDeviceTrackerRes = PaginationRes<DeviceTrackerData>

export const useListDeviceTracker = ({ params, ...rest }: QueryParams<PaginationReq<ListDeviceTrackerFilter>>) => {
  return useQuery({
    queryKey: ['list-tracker', params],
    queryFn: async () => {
      const response = await api.get<ListDeviceTrackerRes>('/tracker', {
        params: { ...params, ...params?.filter },
      })

      return response.data
    },
    ...rest,
  })
}

export const useInfTracker = ({ params, ...rest }: QueryParams<PaginationReq<ListDeviceTrackerFilter>>) => {
  return useInfiniteQuery({
    queryKey: ['list-tracker', 'inf', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ListDeviceTrackerRes>('/tracker', {
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

/*
 *
 * ADD Tracker
 */
export type CreateDeviceTrackerParams = {
  serial: string
  name: string
}

export const useCreateDeviceTracker = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: CreateDeviceTrackerParams) => {
      const response = await api.post<DefaultRes>(`/tracker`, params)

      return response.data
    },
    onSuccess,
    onError,
    onSettled: () => {},
  })
}

/*
 *
 * UPDATE Tracker
 */
export type UpdateDeviceTrackerParams = {
  id: string
  serial: string
  name: string
}

export const useUpdateDeviceTracker = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: UpdateDeviceTrackerParams) => {
      const response = await api.post<DefaultRes>(`/tracker/${params.id}`, params)

      return response.data
    },
    onSuccess,
    onError,
    onSettled: () => {},
  })
}

export const useCreateManyTracker = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (params: CreateDeviceTrackerParams[]) => {
      const response = await api.post<DefaultRes>(`/tracker/create-many`, { trackers: params })

      return response.data
    },
    onSuccess,
    onError,
    onSettled: () => {},
  })
}
/*
 *
 * DELETE Tracker
 */
export const useDeleteDeviceTracker = ({ onSuccess, onError }: MutationParams<DefaultRes>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<DefaultRes>(`/tracker/${id}`)

      return response.data
    },
    onSuccess,
    onError,
  })
}
