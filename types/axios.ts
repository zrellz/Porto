export type GenericObject<T = any> = {
  [key: string]: T
}
export type Pagination = {
  currentPage: number
  lastPage: number
  pageSize: number
  total: number
}
export type PaginationRes<T> = DefaultResponse & {
  result: T[]
  paginate: Pagination
}

type DefaultResponse = {
  status?: boolean
  message: string
}

export type DefaultRes<T = undefined> = DefaultResponse & {
  result: T
}

export type OrderReq = { orderBy?: string; orderDirection?: string }

export type PaginationReq<Filter = GenericObject<any>> = OrderReq & {
  page?: number
  pageSize?: number
  all?: number | boolean
  filter?: Filter
}
export type PageFilter<Filter = GenericObject<any>> = OrderReq & {
  page: number
  pageSize: number
  filter?: Filter
  orderBy?: string | null
  orderDirection?: 'asc' | 'desc' | undefined
}
export type FindReq<Body = undefined> = {
  id: string
  refId?: string
  body?: Body
}
export type UpdateReq<Body = undefined> = {
  id: string
  refId?: any
  body: Body
}
export type ChangeReq<Body = undefined> = {
  id: any
  refId?: any
  body: Body
}
