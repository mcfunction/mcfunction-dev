import styles from './FunctionEditor.module.scss'
import './FunctionEditor.i18n'

import classnames from 'classnames'
import { Canvas, useThree } from '@react-three/fiber'
import { ChangeEvent, CSSProperties, useCallback, useEffect, useState } from 'react'
import CommandTag from '../Command/Command'
import { Command, CommandIntValue, CommandStringValue } from '../Command/lib/Command'
import { Tab } from './lib/Tab'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { toast } from 'react-toastify'
import { ProjectManager } from './lib/ProjectManager'
import { useTranslation } from 'react-i18next'
import { useLocalStorageState } from '../../common/hooks/useLocalStorageState'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { sha256 } from 'js-sha256'

interface IMyFile extends File {
  path: string
}

interface ABlock {
  x?: number
  y?: number
  z?: number
  sx?: number
  sy?: number
  sz?: number
  color?: string
}
class Block {
  public id: string
  public x: number
  public y: number
  public z: number
  public sx: number
  public sy: number
  public sz: number
  public color: string
  constructor({ x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1, color = '#ffffff' }: ABlock) {
    this.id = (Date.now() + Math.random()).toString()
    this.x = x
    this.y = y
    this.z = z
    this.sx = sx
    this.sy = sy
    this.sz = sz
    this.color = color
  }
}

class Log {
  public id: string
  public text: string
  constructor(text: string) {
    this.id = (Date.now() + Math.random()).toString()
    this.text = text
  }
}

interface ICommandRuns {
  [commandName: string]: (command: Command) => { log?: Log; block?: Block } | undefined
}
const commandRuns: ICommandRuns = {
  setblock: (command: Command) => {
    return {
      block: new Block({
        x: command.children[1] instanceof CommandIntValue ? command.children[1].value : 0,
        y: command.children[3] instanceof CommandIntValue ? command.children[3].value : 0,
        z: command.children[5] instanceof CommandIntValue ? command.children[5].value : 0,
        color: `#${sha256(command.children[6] instanceof Command ? command.children[6].value : '?').slice(0, 6)}`,
      }),
    }
  },
  say: (command: Command) => {
    if (command.children[0] instanceof CommandStringValue && typeof command.children[0].value === 'string') {
      return { log: new Log(command.children[0].value) }
    }
  },
}

let updateTimer: NodeJS.Timer | null = null

type Props = {
  className?: string
  style?: CSSProperties
  children?: JSX.Element | JSX.Element[] | string
  //
  projectManager: ProjectManager
  autosave?: boolean
}

const FunctionEditor = ({ className, style, projectManager, autosave }: Props) => {
  const [_forceUpdateCount, setForceUpdateCount] = useState<number>(0)
  const forceUpdate = () => setForceUpdateCount(Date.now() + Math.random())

  const { t, i18n } = useTranslation()
  const [videoId, setVideoId] = useState<string>()
  const [language, setLanguage] = useLocalStorageState(navigator.language ? navigator.language.split('-')[0] : 'en', 'MCFN_LANG')
  const [isVisibleDropModal, setIsVisibleDropModal] = useState<boolean>(false)
  const [isVisibleConfig, setIsVisibleConfig] = useState<boolean>(false)
  const [penColor, setPenColor] = useState<string>('#000000')
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [isEnablePicker, setIsEnablePicker] = useState<boolean>(false)
  const [logs, setLogs] = useState<Log[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const project = projectManager.currentProject

  // Mounted
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [i18n, language])
  useEffect(() => {
    projectManager.setOnUpdate(() => {
      if (updateTimer !== null) {
        clearTimeout(updateTimer)
      }
      updateTimer = setTimeout(() => {
        if (autosave) {
          projectManager.save()
        }
        forceUpdate()
        updateTimer = null
      }, 10)
    })
  }, [projectManager, autosave])
  useEffect(() => {
    if (videoId) {
      setVideoId(videoId)
    }
  }, [videoId])

  // Event
  const copyText = useCallback((text: string) => {
    const elem = document.createElement('textarea')
    elem.value = text
    elem.select()
    elem.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(elem.value)
    toast.success(`Copied! (${text.slice(0, 12)}...)`)
  }, [])
  const copyUrl = useCallback(() => {
    copyText(location.origin + location.pathname + project.getUrlQueries())
  }, [copyText, project])

  // Event
  const addCommand = useCallback((tab: Tab, index: number) => {
    const command = tab.addCommand(index)
    if (command) {
      window.setTimeout(() => {
        const elem = document.querySelector(styles[`Command__Input--${command.id}`]) as HTMLInputElement
        if (elem) {
          elem.focus()
        }
      }, 100)
    }
  }, [])

  // Event
  const removeCommand = useCallback((tab: Tab, command: Command) => {
    const headCommand = tab.removeCommand(command)
    if (headCommand) {
      window.setTimeout(() => {
        const elem = document.querySelector(styles[`Command__Input--${headCommand.id}`]) as HTMLInputElement
        if (elem) {
          elem.focus()
        }
      }, 100)
    }
  }, [])

  // Event
  const onTabDragEnd = useCallback(
    (result: DropResult) => {
      const tabs = Array.from(project.tabs)
      const [reorderedItem] = tabs.splice(result.source.index, 1)
      tabs.splice(result.destination?.index || 0, 0, reorderedItem)
      project.setTabs(tabs)
    },
    [project],
  )

  // Event
  const onCommandDragEnd = useCallback((tab: Tab, result: DropResult) => {
    const commands = Array.from(tab.commands)
    const [reorderedItem] = commands.splice(result.source.index, 1)
    commands.splice(result.destination?.index || 0, 0, reorderedItem)
    tab.setCommands(commands)
  }, [])

  // Event
  const onChangeDropFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || !event.target.files[0]) {
        return
      }
      const file = event.target.files[0] as IMyFile
      if (file.type === 'application/zip' || (file.type.length === 0 && file.name.match(/\.mcpack$/))) {
        project.loadZip(file)
      }
      setIsVisibleDropModal(false)
    },
    [project],
  )

  // Event
  interface ACommandOption {
    tab: Tab
    command: Command
    option: string
    lineIndex: number
  }
  const commandOption = useCallback(
    ({ option, command, tab, lineIndex }: ACommandOption) => {
      if (option === 'delete') {
        if (confirm(`${t('Delete')}?\n\n${command.toCode()}`)) {
          removeCommand(tab, command)
        }
      } else if (option === 'addbelow') {
        addCommand(tab, lineIndex + 1)
      } else if (option === 'comment') {
        command.setCommentOut(!command.commentOut)
      } else if (option === 'refresh') {
        command.refresh()
      } else if (option === 'copy') {
        copyText(command.toCode())
      }
    },
    [copyText, t, addCommand, removeCommand],
  )

  // Event
  const tabEvent = useCallback(
    (tab: Tab, event: ChangeEvent) => {
      const target = event.target as HTMLSelectElement
      if (target.value === 'delete') {
        if (confirm(`${t('Delete')}?\n\n${tab.name}`)) {
          project.removeTab(tab)
        }
      } else if (target.value === 'rename') {
        const name = window.prompt(`${t('Rename to...')}`, tab.name)
        if (name && name.trim().length) {
          project.renameTab(tab, name)
        }
      }
      target.value = 'none'
      target.blur()
    },
    [project, t],
  )

  // Event
  const changeLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language)
      setLanguage(language)
    },
    [i18n, setLanguage],
  )

  // Event
  const addNewTab = useCallback(() => {
    const name = prompt(`${t('Name')}?`)
    if (name && name.trim().length) {
      project.addTab(new Tab({ name, onUpdate: project.onUpdate }))
    }
  }, [project, t])

  // Event
  const run = useCallback((commands: Command[]) => {
    const blocks = []
    const logs = []
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      if (commandRuns[command.value]) {
        const res = commandRuns[command.value](command)
        if (res?.block) {
          blocks.push(res.block)
        }
        if (res?.log) {
          logs.push(res.log)
        }
      } else {
        logs.push(new Log(`Run: ${command.toCode()}`))
      }
    }
    setBlocks(blocks)
    setLogs(logs)
  }, [])

  // Render
  const CameraController = () => {
    const { camera, gl } = useThree()
    useEffect(() => {
      camera.position.x = 2
      camera.position.y = 4
      camera.position.z = 8
    }, [camera])
    useEffect(() => {
      const controls = new OrbitControls(camera, gl.domElement)
      controls.minDistance = 2
      controls.maxDistance = 64
      return () => {
        controls.dispose()
      }
    }, [camera, gl])
    return null
  }
  return (
    <div className={classnames(styles.FunctionEditor, className)} style={style} onDragEnter={() => setIsVisibleDropModal(true)}>
      <div className={styles.FunctionEditor__Header}>
        <div className={styles.FunctionEditor__Tabs}>
          <button
            className={classnames(styles.FunctionEditor__Tabs__Button, styles['FunctionEditor__Tabs__Button--Project'], isVisibleConfig && styles['FunctionEditor__Tabs__Button--Active'])}
            onClick={() => setIsVisibleConfig(!isVisibleConfig)}
            data-usage="4"
          >
            {project.namespace}:
          </button>
          <DragDropContext onDragEnd={(result: DropResult) => onTabDragEnd(result)}>
            <Droppable droppableId="tabs" direction="horizontal">
              {(provided) => (
                <div className={styles.FunctionEditor__Tabs__List} {...provided.droppableProps} ref={provided.innerRef}>
                  {project.tabs.map((tab, tabIndex) => (
                    <Draggable key={`tab_${tab.name}`} draggableId={tab.name} index={tabIndex}>
                      {(provided) => (
                        <div
                          className={classnames(styles.FunctionEditor__Tabs__Button, styles['FunctionEditor__Tabs__Button--File'], project.currentTab === tab && styles['FunctionEditor__Tabs__Button--Active'])}
                          key={`tab_${tab.name}`}
                          onClick={() => project.setCurrentTab(tab)}
                          style={{
                            color: tab.isSpecialTabName ? '#ff9' : '#fff',
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{tab.name}</span>
                          <select className={styles.FunctionEditor__Tabs__Button__Select} onChange={(event) => tabEvent(tab, event)}>
                            <option value="none"></option>
                            <option value="rename">🏷 {t('Rename')}</option>
                            <option value="delete">× {t('Delete')}</option>
                          </select>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button className={classnames(styles.FunctionEditor__Tabs__Button, styles['FunctionEditor__Tabs__Button--New'])} onClick={addNewTab} data-usage="1">
            +
          </button>
        </div>
      </div>
      <div className={styles.FunctionEditor__Body}>
        <div className={styles.FunctionEditor__Main}>
          {project.tabs.map(
            (tab, i) =>
              tab &&
              project.currentTab === tab && (
                <div className={styles.FunctionEditor__Code} key={`code_${i}`}>
                  <DragDropContext onDragEnd={(result: DropResult) => onCommandDragEnd(tab, result)}>
                    <Droppable droppableId="commands">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {tab.commands.map((command, lineIndex) => (
                            <Draggable key={`command-line_${command.id}`} draggableId={command.id} index={lineIndex}>
                              {(provided) => (
                                <div className={styles.FunctionEditor__Code__Line} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                  <select
                                    className={styles.FunctionEditor__Code__LineNumOptions}
                                    onChange={(e) => {
                                      commandOption({
                                        tab,
                                        command,
                                        option: e.target.value,
                                        lineIndex,
                                      })
                                      e.target.value = 'none'
                                    }}
                                    defaultValue="none"
                                  >
                                    <option value="none">{lineIndex + 1}</option>
                                    {command.value === '…' && <option value="refresh">♻️ {t('Refresh')}</option>}
                                    <option value="delete">× {t('Delete')}</option>
                                    <option value="comment"># {t('Comment')}</option>
                                    <option value="copy">📑 {t('Copy')}</option>
                                    <option value="addbelow">↓+ {t('Add Below')}</option>
                                  </select>
                                  <CommandTag className={styles.FunctionEditor__Code__LineCommand} command={command}></CommandTag>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <div className={styles.FunctionEditor__Code__Bottom}>
                    <button className={classnames(styles.FunctionEditor__Code__Button, styles['FunctionEditor__Code__Button--Add'])} onClick={() => addCommand(tab, tab.commands.length)} data-usage="2">
                      + {t('Add')}
                    </button>
                    <button className={classnames(styles.FunctionEditor__Code__Button, styles['FunctionEditor__Code__Button--Copy'])} onClick={() => copyText(tab.toCode())}>
                      📑 {t('Copy')}
                    </button>
                    <button className={classnames(styles.FunctionEditor__Code__Button, styles['FunctionEditor__Code__Button--DL'])} onClick={() => project.toZip(true)} data-usage="5">
                      DL
                    </button>
                    <button className={classnames(styles.FunctionEditor__Code__Button, styles['FunctionEditor__Code__Button--Run'])} onClick={() => run(tab.commands)}>
                      {t('Run')}
                    </button>
                  </div>
                </div>
              ),
          )}
        </div>
        <div className={styles.FunctionEditor__Playground}>
          <Canvas>
            <CameraController />
            <ambientLight />
            <spotLight intensity={0.3} position={[0, 50, 0]} />
            <primitive object={new THREE.AxesHelper(100)} />
            {blocks.map((block) => (
              <mesh key={`block_${block.id}`} position={[block.x, block.y, block.z]}>
                <boxGeometry attach="geometry" args={[block.sx, block.sy, block.sz]} />
                <meshPhongMaterial attach="material" color={block.color} />
              </mesh>
            ))}
          </Canvas>
          <div className={styles.FunctionEditor__Playground__Logs}>
            {logs.map((log) => (
              <div key={`log_${log.id}`} className={styles.FunctionEditor__Playground__Log}>
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
      {videoId && <iframe className={styles.FunctionEditor__Video} src={`https://youtube.com/embed/${videoId}`}></iframe>}
      {isVisibleConfig && (
        <div className={styles.FunctionEditor__Config} onClick={(e) => (e.target as HTMLDivElement).classList.contains(styles.FunctionEditor__Config) && setIsVisibleConfig(false)}>
          <div className={styles.FunctionEditor__Config__Inner}>
            <div className={styles.FunctionEditor__Config__Projects}>
              <select value={projectManager.currentProject.namespace} onChange={(e) => projectManager.selectProjectByName(e.target.value)}>
                {Object.keys(projectManager.projects).map((projectName) => (
                  <option key={`project_${projectName}`} value={projectName}>
                    {projectName}
                  </option>
                ))}
              </select>
              <button onClick={() => projectManager.addProject()}>+</button>
            </div>
            <h2>{t('Information')}</h2>
            <dl>
              <dt>{t('Namespace')}</dt>
              <dd>
                <input type="text" placeholder={`${t('Namespace')}`} value={project.namespace} onChange={(e) => projectManager.renameProject(project, e.target.value)} />
              </dd>
              <dt>{t('Name')}</dt>
              <dd>
                <input type="text" placeholder={`${t('Name')}`} value={project.name} onChange={(e) => project.setName(e.target.value)} />
              </dd>
              <dt>{t('Description')}</dt>
              <dd>
                <input type="text" placeholder={`${t('Description')}`} value={project.description} onChange={(e) => project.setDescription(e.target.value)} />
              </dd>
            </dl>
            <div>
              <button onClick={() => copyUrl()}>{t('Copy URL')}</button>
            </div>
            <h2>{t('Icon')}</h2>
            <div>
              <div>
                <span>🖋: </span>
                <input type="color" value={penColor} onChange={(e) => setPenColor(e.target.value)} />
                <button className={classnames(styles.FunctionEditor__config__picker, isEnablePicker && styles['FunctionEditor__Config__Picker--Active'])} onClick={() => setIsEnablePicker(!isEnablePicker)}>
                  💉
                </button>
              </div>
              <div className={styles.FunctionEditor__Icon} onMouseLeave={() => setIsDrawing(false)}>
                {project.iconData.map((iconDataLine, y) => (
                  <div className={styles.FunctionEditor__Icon__Line} key={`iconline_${y}`}>
                    {iconDataLine.map((backgroundColor, x) => (
                      <div
                        className={styles.FunctionEditor__Icon__Pixel}
                        key={`pixel_${x}x${y}_${backgroundColor}`}
                        onMouseDown={() => {
                          if (isEnablePicker) {
                            setPenColor(backgroundColor)
                            setIsEnablePicker(false)
                          } else {
                            setIsDrawing(true)
                            project.paintIcon(x, y, penColor)
                          }
                        }}
                        onMouseEnter={() => {
                          if (isDrawing) {
                            project.paintIcon(x, y, penColor)
                          }
                        }}
                        onMouseUp={() => {
                          setIsDrawing(false)
                        }}
                        style={{ backgroundColor }}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div>
              <h2>{t('Language')}</h2>
              <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="ja">Japanese 日本語</option>
              </select>
            </div>
            <hr />
            <div>
              <button onClick={() => confirm(t('Reset') + ': OK?') && project.reset()}>{t('Reset')}</button>
            </div>
          </div>
        </div>
      )}
      {isVisibleDropModal && (
        <div className={styles.FunctionEditor__DropModal} onDragLeave={() => setIsVisibleDropModal(false)}>
          <div className={styles.FunctionEditor__DropModal__Text}>{t('Drop your ZIP')}</div>
          <input className={styles.FunctionEditor__DropModal__File} type="file" onChange={(event) => onChangeDropFile(event)} />
        </div>
      )}
    </div>
  )
}

export default FunctionEditor
