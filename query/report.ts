import { useQuery } from '@tanstack/react-query'
import { api } from '~/core/utils/service'
import { PaginationReq, PaginationRes } from '~/types/axios'
import { QueryParams } from '~/types/query'

export const filename = 'report'

export type ReportData = {
  id: string
  deviceId: string
  deviceName: string
  trackingId: string
  trackingName: string
  layoutId: string
  layoutName: string
  duration: number
  inputDate: string
}

export type ListReportFilter = {
  deviceId: string
  trackingId: string
  layoutId: string
  startDate: string // yyyy-MM-dd
  endDate: string // yyyy-MM-dd
}

export type ListReportRes = PaginationRes<ReportData>
export const useListReport = ({ params, ...rest }: QueryParams<PaginationReq<ListReportFilter>>) => {
  return useQuery({
    queryKey: [filename, 'list', params],
    queryFn: async () => {
      const response = await api.get<ListReportRes>('/report', { params: { ...params, ...params?.filter } })
      return response.data
    },
    ...rest,
  })
}
