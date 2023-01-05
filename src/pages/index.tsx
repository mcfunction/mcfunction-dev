import DefaultLayout from '../layouts/DefaultLayout/DefaultLayout'
import styles from './index.module.scss'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import FunctionEditor from '../components/FunctionEditor/FunctionEditor'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ProjectManager } from '../components/FunctionEditor/lib/ProjectManager'
import { ICodeList } from '../components/FunctionEditor/lib/Project'
import Meta from '../components/Meta/Meta'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

if (Object.keys(i18next.options).length === 0) {
  i18next.use(initReactI18next).init({
    fallbackLng: 'en',
  })
}

i18next.addResources('ja', 'translation', {
  Commands: 'コマンド一覧',
})

interface ICommand {
  id: string
  description: string
}

interface Props {
  commands: ICommand[]
}

const focusElem = (elem: Element | null, scroll = false) => {
  if (elem) {
    if (scroll) {
      window.scrollTo(0, 0)
    }
    const target = elem as HTMLElement
    const blink = (): Promise<boolean> =>
      new Promise((resolve) => {
        target.style.boxShadow = '0 0 0 4px #ff0 inset'
        setTimeout(() => {
          target.style.boxShadow = 'none'
          setTimeout(() => resolve(true), 200)
        }, 200)
      })
    blink()
      .then(() => blink())
      .then(() => blink())
  }
}

function HomePage({ commands }: Props): JSX.Element {
  const router = useRouter()
  const { t } = useTranslation()
  const [projectManager, setProjectManager] = useState<ProjectManager>()

  useEffect(() => {
    const namespace = typeof router.query['ns'] === 'string' ? router.query['ns'] : 'mc'
    const name = typeof router.query['n'] === 'string' ? router.query['n'] : 'mc'
    const description = typeof router.query['d'] === 'string' ? router.query['d'] : 'mc'
    // const videoId = searchParams.get('v') || undefined
    const codeList: ICodeList = {}
    Object.keys(router.query).forEach((key) => {
      const value = router.query[key]
      if (typeof value === 'string' && key !== 'ns' && key !== 'n' && key !== 'd' && key !== 'v') {
        codeList[key] = value || ''
      }
    })
    const projectManager = new ProjectManager()
    projectManager.load()
    const project = projectManager.currentProject
    if (Object.keys(codeList).length) {
      project.reset({ namespace, name, description, codeList })
      history.replaceState('', '', router.pathname)
    }
    setProjectManager(projectManager)
  }, [router.query, router.pathname])

  return (
    <DefaultLayout className={styles.HomePage}>
      <Meta></Meta>
      <div>{projectManager && <FunctionEditor projectManager={projectManager} autosave />}</div>
      <div className={styles.HomePage__Description}>
        <div className={styles.HomePage__Description__Top}>
          <div>
            <Image className="HomePage__Description__Icon" alt="Icon" width={30} height={30} src="/img/icon.png" />
          </div>
          <h1 className={styles.HomePage__Description__Logo}>mcfunction</h1>
          <p>Best .mcfunction Editor Ever.</p>
        </div>
        <div className={styles.HomePage__Description__Usage}>
          <h2>Usage</h2>
          <div className={styles.HomePage__Description__Usage__List}>
            <div>
              <div>1. New Tab</div>
              <div>
                <button onClick={() => focusElem(document.querySelector('*[data-usage="1"]'))}>+</button>
              </div>
            </div>
            <div>
              <div>2. New Command</div>
              <div>
                <button onClick={() => focusElem(document.querySelector('*[data-usage="2"]'), true)}>+ Add</button>
              </div>
            </div>
            <div>
              <div>3. Change Command</div>
              <div>
                <button onClick={() => focusElem(document.querySelector('*[data-usage="3"]'), true)}>▶️ execute</button>
              </div>
            </div>
            <div>
              <div>4. Change Info</div>
              <div>
                <button onClick={() => focusElem(document.querySelector('*[data-usage="4"]'))}>default:</button>
              </div>
            </div>
            <div>
              <div>5. Download</div>
              <div>
                <button onClick={() => focusElem(document.querySelector('*[data-usage="5"]'), true)}>DL</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}

export async function getServerSideProps() {
  const commands: ICommand[] = [
    {
      id: '1',
      description: 'command1!',
    },
  ]
  const props: Props = {
    commands,
  }
  return { props }
}

export default HomePage
