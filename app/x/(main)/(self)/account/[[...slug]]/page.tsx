import { redirect, RedirectType } from 'next/navigation'
import Main from '../_components/main'

const pages = ['general', 'security']

export default async function Page({ params: rawParams }: { params: Promise<{ slug?: string[] }> }) {
  let slug = 'general'
  const params = await rawParams
  if (params.slug && params.slug.length > 0) slug = params.slug.join('/')
  if (!pages.includes(slug)) {
    redirect('/x/account', RedirectType.push)
  }
  return <Main slug={slug} />
}
