import { ICodeList, Project } from './Project'

const LS_KEY = 'MCFN_PM'

export interface IProjects {
  [projectName: string]: Project
}

interface ILocalStorageProjectManager {
  current?: string
  projects?: {
    [projectName: string]: {
      current?: string
      codes: ICodeList
      name: string
      description: string
      iconData: string[][]
      version: number
    }
  }
}

interface AProjectManager {
  projects?: IProjects
  defaultNamespace?: string
}
export class ProjectManager {
  public projects: IProjects
  public currentProject: Project
  public onUpdate: (reason: string) => void
  public onUpdates: ((reason: string) => void)[]

  constructor({ projects = {}, defaultNamespace = 'default' }: AProjectManager = {}) {
    this.onUpdates = []
    const onUpdate = (reason: string) => {
      const { onUpdates } = this
      onUpdates.forEach((ou) => ou(reason))
    }
    if (Object.keys(projects).length === 0) {
      projects.default = new Project({ namespace: defaultNamespace, onUpdate })
    }
    this.projects = projects
    this.currentProject = projects[Object.keys(projects)[0]]
    this.onUpdate = onUpdate
  }

  setOnUpdate(onUpdate: (reason: string) => void) {
    this.onUpdates = [onUpdate]
  }

  // Project
  selectProjectByName(name: string) {
    const { projects } = this
    this.currentProject = projects[name]
    this.onUpdate('ProjectManager.selectProjectByName()')
  }

  // Project
  renameProject(project: Project, name: string) {
    delete this.projects[project.namespace]
    this.projects[name] = project
    project.setNamespace(name)
    this.onUpdate('ProjectManager.renameProject()')
  }

  // Project
  addProject(project = new Project({ namespace: 'new', onUpdate: this.onUpdate })) {
    while (this.projects[project.namespace]) {
      project.namespace += ' (new)'
    }
    this.projects[project.namespace] = project
    this.currentProject = project
    this.onUpdate('ProjectManager.addProject()')
  }

  // LS
  save() {
    const { projects, currentProject } = this
    const lsProjectManager: ILocalStorageProjectManager = {
      current: currentProject.namespace || 'default',
      projects: {},
    }
    Object.keys(projects).forEach((projectName) => {
      const project = projects[projectName]
      if (lsProjectManager.projects) {
        lsProjectManager.projects[projectName] = {
          current: project.currentTab?.name || 'default',
          codes: project.tabsToCodeList(),
          name: project.name,
          description: project.description,
          iconData: project.iconData,
          version: project.version,
        }
      }
    })
    localStorage.setItem(LS_KEY, JSON.stringify(lsProjectManager))
  }

  // LS
  load() {
    const { onUpdate } = this
    const lsProjectManager = JSON.parse(localStorage.getItem(LS_KEY) || '{}') as ILocalStorageProjectManager
    const lsProjects = lsProjectManager.projects || {}
    Object.keys(lsProjects).forEach((projectName) => {
      const lsProject = lsProjects[projectName]
      const project = new Project({
        namespace: projectName,
        name: lsProject.name,
        description: lsProject.description,
        iconData: lsProject.iconData,
        version: lsProject.version,
        onUpdate,
      })
      project.setTabsByCodeList(lsProject.codes)
      const currentTab = project.tabs.find((tab) => tab.name === lsProject.current)
      if (currentTab) {
        project.setCurrentTab(currentTab)
      }
      this.projects[projectName] = project
    })
    const lsCurrent = lsProjectManager.current || 'default'
    if (this.projects[lsCurrent]) {
      this.currentProject = this.projects[lsCurrent]
    }
    this.onUpdate('ProjectManager.load()')
  }
}
