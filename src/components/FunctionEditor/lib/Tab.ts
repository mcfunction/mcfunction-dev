import { Command } from '../../Command/lib/Command'

export const TIME_TAB_REGEX = /^([1-9]\d*)?(t|tick|s|sec|second|m|min|minute)s?$/
export const SPECIAL_TAB_REGEX = /^(start|stop)$/

interface ATab {
  name: string
  code?: string
  onUpdate?: (reason: string) => void
}

export class Tab {
  public name: string
  public isSpecialTabName: boolean
  public commands: Command[]
  public onUpdate: (reason: string) => void

  constructor({ name, code = '', onUpdate = () => {} }: ATab) {
    this.name = name
    this.isSpecialTabName = this.updateIsSpecialTabName()
    this.commands = []
    this.onUpdate = onUpdate
    code
      .replace(/;/g, '\n')
      .split('\n')
      .forEach((lineStr) => {
        const command = new Command({ onUpdate: this.onUpdate })
        command.setFromCode(lineStr)
        this.commands.push(command)
      })
  }

  // Set
  setName(name: string) {
    this.name = name
    this.isSpecialTabName = this.updateIsSpecialTabName()
    this.onUpdate('Tab.setName()')
  }

  // Set
  setCommands(commands: Command[]) {
    this.commands = commands
    this.onUpdate('Tab.setCommands()')
  }

  // Set
  updateIsSpecialTabName() {
    const { name } = this
    const isSpecialTabName = Boolean(name.match(TIME_TAB_REGEX) || name.match(SPECIAL_TAB_REGEX))
    this.isSpecialTabName = isSpecialTabName
    return isSpecialTabName
  }

  // Command
  addCommand(index: number, command = new Command({ onUpdate: this.onUpdate })) {
    this.commands.splice(index, 0, command)
    this.onUpdate('Tab.addCommand()')
    return command
  }

  // Command
  removeCommand(command: Command) {
    const { commands } = this
    let lastCommand: Command | undefined
    const popIndex = commands.findIndex((c) => {
      const ok = c.id === command.id
      if (ok) {
        return ok
      } else {
        lastCommand = c
      }
    })
    if (popIndex !== -1) {
      this.commands.splice(popIndex, 1)
    }
    if (!lastCommand) {
      lastCommand = this.commands[0]
    }
    this.onUpdate('Tab.removeCommand()')
    return lastCommand
  }

  // Code
  toUrlQuery() {
    return this.toCode().replace(/#/g, 'comment').replace(/ +/g, '+').replace(/\n/g, ';')
  }

  // Code
  toCode(be = false) {
    const { commands } = this
    const code = commands.map((command) => command.toCode(be)).join('\n')
    return code
  }
}
