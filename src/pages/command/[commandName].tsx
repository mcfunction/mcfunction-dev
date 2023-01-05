import styles from './[commandName].module.scss'

import classnames from 'classnames'
import { CSSProperties, useEffect, useState } from 'react'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import FunctionEditor from '../../components/FunctionEditor/FunctionEditor'
import { MCCommandHead } from '../../components/Command/lib/commands'
import { ProjectManager } from '../../components/FunctionEditor/lib/ProjectManager'
import { Tab } from '../../components/FunctionEditor/lib/Tab'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Meta from '../../components/Meta/Meta'

type Props = {
  className?: string
  style?: CSSProperties
  children?: React.ReactNode
}

const ArticlePage = ({ className, style }: Props) => {
  const router = useRouter()
  const { commandName } = router.query
  const [projectManager, setProjectManager] = useState<ProjectManager>()

  useEffect(() => {
    if (!commandName) {
      return
    }
    if (Array.isArray(commandName) || Object.keys(MCCommandHead).indexOf(commandName) === -1) {
      router.replace('/404')
      return
    }
    const projectManager = new ProjectManager({ defaultNamespace: 'demo' })
    projectManager.currentProject.addTab(
      new Tab({
        name: 'code',
        code: `say "${commandName}!"`,
        onUpdate: projectManager.onUpdate,
      }),
    )
    projectManager.currentProject.tabs[0].commands[0].select(commandName)
    setProjectManager(projectManager)
  }, [router, commandName])

  return (
    <DefaultLayout className={classnames(styles.CommandPage, className)} style={style}>
      {commandName && <Meta title={`Commands/${commandName} - Minecraft | mcfunction`} description={`Minecraft ${commandName} command`} type="article"></Meta>}
      <div>{projectManager && <FunctionEditor projectManager={projectManager} />}</div>
      <div className={styles.CommandPage__Main}>
        <Link href="/">＜ Home</Link>
        <h1 className={styles.CommandPage__Heading}>Minecraft &quot;{commandName}&quot; command</h1>
      </div>
    </DefaultLayout>
  )
}

export default ArticlePage
