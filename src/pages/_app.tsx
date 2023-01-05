import Head from 'next/head'
import '../common/styles/globals.scss'
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <link rel="shortcut icon" href="/img/favicon.ico" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" type="image/png" href="/img/icon.png" />
        <link rel="apple-touch-icon" href="/img/icon.png" sizes="64x64" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default App
