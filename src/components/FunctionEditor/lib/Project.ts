import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { Tab, TIME_TAB_REGEX } from './Tab'

interface AProject {
  namespace: string
  name?: string
  description?: string
  version?: number
  tabs?: Tab[]
  iconData?: string[][]
  onUpdate?: (reason: string) => void
}

interface AReset {
  name?: string
  description?: string
  namespace?: string
  iconData?: string[][]
  codeList?: ICodeList
}

const sysPrefix = 'v'
const sysPrefixLower = sysPrefix.toLowerCase()
const genUUID = () => {
  const t = (Math.random() + '' + Math.random()).replace(/\./g, '')
  return t.slice(0, 8) + '-' + t.slice(8, 12) + '-' + t.slice(12, 16) + '-' + t.slice(16, 20) + '-' + t.slice(20, 32)
}
const base64ToImage = (base64: string): Promise<HTMLImageElement> =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = function () {
      resolve(img)
    }
    img.src = base64
  })
const clone = (v: any) => JSON.parse(JSON.stringify(v))
const DEFAULT_ICON_DATA = [
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
]
const ICON_PIXEL_SIZE = 8

export interface ICodeList {
  [fileName: string]: string
}

export class Project {
  public namespace: string
  public name: string
  public description: string
  public iconData: string[][]
  public version: number
  public tabs: Tab[]
  public currentTab?: Tab
  public onUpdate: (reason: string) => void

  constructor({ namespace, name = '', description = '', version = 1, tabs = [], iconData = clone(DEFAULT_ICON_DATA), onUpdate = () => {} }: AProject) {
    this.namespace = namespace
    this.name = name
    this.description = description
    this.iconData = iconData
    this.tabs = tabs
    this.version = version
    this.currentTab = tabs[0]
    this.onUpdate = onUpdate
  }

  // Set
  reset({ name = '', description = '', namespace = this.namespace, codeList = {}, iconData = clone(DEFAULT_ICON_DATA) }: AReset = {}) {
    this.namespace = namespace
    this.name = name
    this.description = description
    this.iconData = iconData
    this.tabs = this.codeListToTabs(codeList)
    this.version = 1
    this.currentTab = this.tabs[0]
    this.onUpdate('Project.reset()')
  }

  // Set
  setName(name: string) {
    this.name = name
    this.onUpdate('Project.setName()')
  }

  // Set
  setDescription(description: string) {
    this.description = description
    this.onUpdate('Project.setDescription()')
  }

  // Set
  setCurrentTab(tab: Tab) {
    this.currentTab = tab
    this.onUpdate('Project.setCurrentTab()')
  }

  // Set
  setTabs(tabs: Tab[]) {
    this.tabs = tabs
    this.onUpdate('Project.setTabs()')
  }

  // Set
  setNamespace(namespace: string) {
    this.namespace = namespace
    this.onUpdate('Project.setNamespace()')
  }

  // Set
  setTabsByCodeList(codeList: ICodeList) {
    this.tabs = this.codeListToTabs(codeList)
    this.currentTab = this.tabs[0]
    this.onUpdate('Project.setTabsByCodeList()')
  }

  // Set
  paintIcon(x: number, y: number, color: string) {
    this.iconData[y][x] = color
    this.onUpdate('Project.paintColor()')
  }

  //
  codeListToTabs(codeList: ICodeList) {
    const { onUpdate } = this
    const tabs: Tab[] = Object.keys(codeList).map((fileName) => new Tab({ name: fileName, code: codeList[fileName], onUpdate }))
    return tabs
  }

  //
  tabsToCodeList(tabs = this.tabs) {
    const codeList: ICodeList = {}
    tabs.forEach((tab) => {
      codeList[tab.name] = tab.toCode()
    })
    return codeList
  }

  // Tab
  addTab(tab = new Tab({ name: 'new', onUpdate: this.onUpdate })) {
    const { tabs } = this
    while (tabs.find((t) => t.name === tab.name)) {
      tab.name += ' (new)'
    }
    this.tabs.push(tab)
    this.currentTab = tab
    this.onUpdate('Project.addTab()')
  }

  // Tab
  renameTab(tab: Tab, name: string) {
    const { tabs } = this
    if (name.trim().length === 0) {
      return
    }
    name = name.trim()
    while (tabs.find((t) => t.name === name)) {
      name += ' (new)'
    }
    tab.setName(name)
  }

  // Tab
  removeTab(tab: Tab) {
    const { currentTab, tabs } = this
    this.tabs = tabs.filter((t) => t !== tab)
    if (currentTab === tab) {
      this.currentTab = this.tabs[0]
    }
    this.onUpdate('Project.removeTab()')
  }

  // Load
  async loadZip(file: File) {
    const { name, namespace, description, iconData } = this
    const content = await JSZip.loadAsync(file)
    const filePaths = Object.keys(content.files)
    const codeList: ICodeList = {}
    let newNamespace = namespace
    let newName = name
    let newDescription = description
    const newIconData = clone(iconData)
    for (let i = 0; i < filePaths.length; i++) {
      const filePath = filePaths[i]
      const file = content.files[filePath]
      // Function
      let matches = filePath.match(/^data\/([^/]+)\/functions\/(.*?)\.mcfunction$/)
      if (matches) {
        const code = (await file.async('text')).replace(/# DON'T DELETE\n.+/g, '').trim()
        newNamespace = matches[1]
        codeList[matches[2]] = code
      }
      // Manifest
      matches = filePath.match(/^manifest\.json$/)
      if (matches) {
        const json = JSON.parse(await file.async('text'))
        newName = json.header.name
        newDescription = json.header.description
      }
      // Image
      matches = filePath.match(/^pack\.png$/)
      if (matches) {
        const b64 = 'data:image/png;base64,' + (await file.async('base64'))
        const img = await base64ToImage(b64)
        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const imgData = ctx.getImageData(0, 0, 64, 64).data
          for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {
              if (x % ICON_PIXEL_SIZE === 0 && y % ICON_PIXEL_SIZE === 0) {
                const pixel = {
                  r: imgData[4 * 64 * y + 4 * x + 0],
                  g: imgData[4 * 64 * y + 4 * x + 1],
                  b: imgData[4 * 64 * y + 4 * x + 2],
                  a: imgData[4 * 64 * y + 4 * x + 3] / 255,
                }
                newIconData[Math.floor(y / ICON_PIXEL_SIZE)][Math.floor(x / ICON_PIXEL_SIZE)] = `#${'00' + pixel.r.toString(16).slice(-2)}${('00' + pixel.g.toString(16)).slice(-2)}${('00' + pixel.b.toString(16)).slice(-2)}`
              }
            }
          }
        }
      }
    }
    this.reset({
      codeList,
      namespace: newNamespace,
      name: newName,
      description: newDescription,
      iconData: newIconData,
    })
    this.onUpdate('Project.loadZip()')
  }

  // DL
  async toZip(download = false) {
    const { namespace, name, description, version, iconData, tabs } = this
    const zip = new JSZip()
    const versionArr: number[] = [0, 0, Math.floor(version)]
    const versionStr = versionArr.join('.')
    zip.file(
      'manifest.json',
      JSON.stringify(
        {
          format_version: 2,
          header: {
            description,
            version: versionArr,
            uuid: genUUID(),
            name,
            min_engine_version: [1, 19, 0],
          },
          modules: [
            {
              description,
              version: versionArr,
              uuid: genUUID(),
              type: 'data',
            },
          ],
        },
        null,
        4,
      ),
    )
    zip.file(
      'pack.mcmeta',
      JSON.stringify(
        {
          pack: {
            pack_format: 10,
            description,
          },
        },
        null,
        4,
      ),
    )
    const dataFolder = zip.folder('data')
    if (!dataFolder) {
      return
    }
    const maxTick = 20 * 60 * 60 * 24
    const maxRandom = 100
    let tickCode = ''
    let loadCode = ''
    const userFunctionsFolderJE = dataFolder.folder(namespace)?.folder('functions')
    const userFunctionsFolderBE = zip.folder('functions')
    tabs.forEach((tab) => {
      if (tab.name === 'start') {
        userFunctionsFolderJE?.file(`${tab.name}.mcfunction`, `# DON'T DELETE\nfunction ${namespace}:${sysPrefixLower}_sys_load\n\n${tab.toCode()}\n\n# DON'T DELETE\nfunction ${namespace}:${sysPrefixLower}_sys_start`)
        userFunctionsFolderBE?.file(`${tab.name}.mcfunction`, `# DON'T DELETE\nfunction ${namespace}:${sysPrefixLower}_sys_load\n\n${tab.toCode(true)}\n\n# DON'T DELETE\nfunction ${namespace}:${sysPrefixLower}_sys_start`)
      } else if (tab.name === 'stop') {
        userFunctionsFolderJE?.file(`${tab.name}.mcfunction`, `# DON'T DELETE\nfunction ${namespace}:${sysPrefixLower}_sys_stop\n\n${tab.toCode()}`)
        userFunctionsFolderBE?.file(`${tab.name}.mcfunction`, `# DON'T DELETE\nfunction ${namespace}:${sysPrefixLower}_sys_stop\n\n${tab.toCode(true)}`)
      } else {
        userFunctionsFolderJE?.file(`${tab.name}.mcfunction`, tab.toCode() || '')
        userFunctionsFolderBE?.file(`${tab.name}.mcfunction`, tab.toCode(true) || '')
      }
      let matches
      if ((matches = tab.name.match(TIME_TAB_REGEX))) {
        if (typeof matches[1] === 'undefined') {
          matches[1] = '1'
        }
        const tickCount = matches[2].match(/^(m|min|minute)$/) ? parseInt(matches[1]) * 20 * 60 : matches[2].match(/^(s|sec|second)$/) ? parseInt(matches[1]) * 20 : parseInt(matches[1])
        loadCode += `scoreboard players set Tick${tab.name} ${sysPrefix} ${tickCount}\n`
        tickCode += `scoreboard players operation TickTmp ${sysPrefix} = Tick ${sysPrefix}\nscoreboard players operation TickTmp ${sysPrefix} %= Tick${tab.name} ${sysPrefix}\nexecute if score TickTmp ${sysPrefix} matches 0 run function ${namespace}:${tab.name}\n\n`
      }
    })
    userFunctionsFolderJE?.file(
      `${sysPrefixLower}_random.mcfunction`,
      `execute at @a run summon area_effect_cloud ~ ~ ~ {Tags:["rnd"]}\nexecute as @a at @s store result score Random ${sysPrefix} run data get entity @e[tag=rnd, sort=nearest, limit=1] UUID[0]\nscoreboard players operation Random ${sysPrefix} %= RandomMax ${sysPrefix}\nkill @e[tag=rnd]`,
    )
    userFunctionsFolderBE?.file(
      `${sysPrefixLower}_random.mcfunction`,
      `execute at @a run summon area_effect_cloud ~ ~ ~ {Tags:["rnd"]}\nexecute as @a at @s store result score Random ${sysPrefix} run data get entity @e[tag=rnd, sort=nearest, limit=1] UUID[0]\nscoreboard players operation Random ${sysPrefix} %= RandomMax ${sysPrefix}\nkill @e[tag=rnd]`,
    )
    userFunctionsFolderJE?.file(
      `${sysPrefixLower}_sys_load.mcfunction`,
      `scoreboard objectives remove ${sysPrefix}\nscoreboard objectives add ${sysPrefix} dummy\nscoreboard players set RandomMax ${sysPrefix} ${maxRandom}\nscoreboard players set TickMax ${sysPrefix} ${maxTick}\n${loadCode}`,
    )
    userFunctionsFolderBE?.file(
      `${sysPrefixLower}_sys_load.mcfunction`,
      `scoreboard objectives remove ${sysPrefix}\nscoreboard objectives add ${sysPrefix} dummy\nscoreboard players set RandomMax ${sysPrefix} ${maxRandom}\nscoreboard players set TickMax ${sysPrefix} ${maxTick}\n${loadCode}`,
    )
    userFunctionsFolderJE?.file(`${sysPrefixLower}_sys_start.mcfunction`, `scoreboard players set Tick ${sysPrefix} 0`)
    userFunctionsFolderBE?.file(`${sysPrefixLower}_sys_start.mcfunction`, `scoreboard players set Tick ${sysPrefix} 0`)
    userFunctionsFolderJE?.file(`${sysPrefixLower}_sys_tick.mcfunction`, `${tickCode}\nexecute if score Tick ${sysPrefix} matches 0.. run scoreboard players add Tick ${sysPrefix} 1\nscoreboard players operation Tick ${sysPrefix} %= TickMax ${sysPrefix}`)
    userFunctionsFolderBE?.file(`${sysPrefixLower}_sys_tick.mcfunction`, `${tickCode}\nexecute if score Tick ${sysPrefix} matches 0.. run scoreboard players add Tick ${sysPrefix} 1\nscoreboard players operation Tick ${sysPrefix} %= TickMax ${sysPrefix}`)
    userFunctionsFolderJE?.file(`${sysPrefixLower}_sys_stop.mcfunction`, `scoreboard players set Tick ${sysPrefix} -1\nscoreboard objectives remove ${sysPrefix}`)
    userFunctionsFolderBE?.file(`${sysPrefixLower}_sys_stop.mcfunction`, `scoreboard players set Tick ${sysPrefix} -1\nscoreboard objectives remove ${sysPrefix}`)
    const appFunctionsFolder = dataFolder.folder('minecraft')?.folder('tags')?.folder('functions')
    if (tickCode.trim().length) {
      appFunctionsFolder?.file(
        'tick.json',
        JSON.stringify(
          {
            values: [`${namespace}:${sysPrefixLower}_sys_tick`],
          },
          null,
          4,
        ),
      )
      userFunctionsFolderBE?.file(
        'tick.json',
        JSON.stringify(
          {
            values: [`${sysPrefixLower}_sys_tick`],
          },
          null,
          4,
        ),
      )
    }
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      iconData.forEach((line, y) => {
        iconData[y].forEach((color, x) => {
          ctx.fillStyle = color
          ctx.fillRect(x * ICON_PIXEL_SIZE, y * ICON_PIXEL_SIZE, ICON_PIXEL_SIZE, ICON_PIXEL_SIZE)
        })
      })
    }
    const imgData = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '')
    zip.file('pack.png', imgData, { base64: true })
    zip.file('pack_icon.png', imgData, { base64: true })
    if (download) {
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${namespace}_je_v${versionStr}.zip`)
      window.setTimeout(() => {
        saveAs(content, `${namespace}_be_v${versionStr}.mcpack`)
      }, 1000)
    }
    this.incVersion()
    return zip
  }

  //
  incVersion() {
    this.version++
    this.onUpdate('Project.incVersion()')
  }

  // DL
  getUrlQueries() {
    const { namespace, name, description, tabs } = this
    const text = `?ns=${namespace}&n=${name}&d=${description}&${tabs.map((tab) => `${tab.name}=${tab.toUrlQuery()}`).join('&')}`
    return text.replace(/\w+=(&|$)/g, '').replace(/&+$/g, '')
  }
}
