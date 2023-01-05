import { ReactNode } from 'react'
import Head from 'next/head'

interface Props {
  children?: ReactNode
  description?: string
  url?: string
  type?: string
  title?: string
  siteName?: string
  image?: string
}

function Meta({ children, description, url, type, title, siteName, image }: Props): JSX.Element {
  return (
    <Head>
      <title>{title ?? 'mcfunction'}</title>
      <meta name="description" content={description ?? 'Best .mcfunction Editor Ever.'} />
      <meta property="og:url" content={url ?? 'https://mcfunction.com'} />
      <meta property="og:type" content={type ?? 'website'} />
      <meta property="og:title" content={title ?? 'mcfunction.com'} />
      <meta property="og:description" content={description ?? 'Best .mcfunction Editor Ever.'} />
      <meta property="og:site_name" content={siteName ?? 'mcfunction.com'} />
      <meta property="og:image" content={image ?? 'https://mcfunction.com/img/ogp.png'} />
      {children}
    </Head>
  )
}

export default Meta
