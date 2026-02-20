export type Success<T> = (data: T) => void
export type Error = (error: any) => void

export type MutationParams<T> = {
  onSuccess?: Success<T>
  onError?: Error
}
export type QueryParams<T = any> = {
  params?: T
  enabled?: boolean
  refetchInterval?: number
  refetchOnWindowFocus?: boolean
}
