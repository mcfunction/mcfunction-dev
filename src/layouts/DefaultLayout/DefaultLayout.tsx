import { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import styles from './DefaultLayout.module.scss'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { MCCommandHead } from '../../components/Command/lib/commands'

interface Props {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

function DefaultLayout({ children, className, style }: Props): JSX.Element {
  const { t } = useTranslation()
  return (
    <div className={classnames(styles.DefaultLayout, className)} style={style}>
      <main className={styles.DefaultLayout__Contents}>{children}</main>
      <div className={styles.DefaultLayout__PageLinks}>
        <div className={styles.DefaultLayout__Wrap}>
          <h2>{t('Commands')}</h2>
          <div>
            {Object.keys(MCCommandHead).map(
              (commandName) =>
                !commandName.startsWith('_') &&
                commandName !== '…' && (
                  <Link key={`default-layout-links_${commandName}`} href={`/command/${commandName}`}>
                    {commandName}
                  </Link>
                ),
            )}
          </div>
        </div>
      </div>
      <footer className={styles.DefaultLayout__Footer}>
        <div className={styles.DefaultLayout__Footer__Copyright}>Copyright ©️ 2022 mcfunction</div>
      </footer>
    </div>
  )
}

export default DefaultLayout
