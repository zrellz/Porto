import React from 'react'

interface MetaCampaigns {
  hasNextPage: boolean
  isLoading: boolean
  fetchNextPage: () => void
}

export const useInfiniteScroll = (inView: boolean, meta: MetaCampaigns) => {
  React.useEffect(() => {
    if (inView && meta.hasNextPage && !meta.isLoading) {
      console.log('Has next page, fetching more data...', meta.hasNextPage, meta.isLoading)
      meta.fetchNextPage()
    }
  }, [inView, meta.hasNextPage])
}
