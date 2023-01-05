import { NextPageContext } from 'next'
import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout'
import styles from './_error.module.scss'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Meta from '../components/Meta/Meta'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

if (Object.keys(i18next.options).length === 0) {
  i18next.use(initReactI18next).init({
    fallbackLng: 'en',
  })
}

i18next.addResources('ja', 'translation', {
  Home: 'ホーム',
})

interface Props {
  statusCode: number
}

function ErrorPage({ statusCode }: Props): JSX.Element {
  const { t } = useTranslation()
  return (
    <DefaultLayout className={styles.ErrorPage}>
      <Meta title={`${statusCode} Error | mcfunction`} description={`${statusCode} Error.`}></Meta>
      <h1 className={styles.ErrorPage__Title}>{statusCode}</h1>
      <div className={styles.ErrorPage__Text}>
        <Link href="/">{t('Home')}</Link>
      </div>
    </DefaultLayout>
  )
}

ErrorPage.getInitialProps = async ({ res, err }: NextPageContext): Promise<Props> => {
  const statusCode = res ? res.statusCode || 404 : err ? err.statusCode || 404 : 404
  return { statusCode }
}

export default ErrorPage
