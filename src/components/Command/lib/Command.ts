import { BE_INVALID_COMMANDS, MCCommandHead, MCTarget, MCTeleportOptions } from './commands'

export const genId = () => `${Date.now()}${Math.random()}`.replace(/\./g, '_')

export const tokenRegExp = /('[^']*'|"[^"]*"|\[[^\]]*\]|{[^}]*}|[~^]?(\d+)(\.\d+)?|@?[-\w:.]+|[-+/*%=><]+|[^ ]+)/

export type CandidateValue = IMCCandidates | MCInt | MCFloat | MCString | MCRaw | MCJson | MCBool | MCKeyword

export interface IMCCandidates {
  [key: string]: CandidateValue[]
}

export interface ICommandEmojis {
  [commandName: string]: string
}

export interface ICommandJa {
  [commandName: string]: string
}

export class MCInt {
  public name: string
  public optional: boolean
  public smallInput: boolean
  constructor(name: string, optional = false, smallInput = false) {
    this.name = name
    this.optional = optional
    this.smallInput = smallInput
  }
}

export class MCFloat {
  public name: string
  public optional: boolean
  public smallInput: boolean
  constructor(name: string, optional = false, smallInput = false) {
    this.name = name
    this.optional = optional
    this.smallInput = smallInput
  }
}

export class MCRaw {
  public name: string
  public optional: boolean
  public smallInput: boolean
  constructor(name: string, optional = false, smallInput = false) {
    this.name = name
    this.optional = optional
    this.smallInput = smallInput
  }
}

export class MCString {
  public name: string
  public optional: boolean
  public smallInput: boolean
  constructor(name: string, optional = false, smallInput = false) {
    this.name = name
    this.optional = optional
    this.smallInput = smallInput
  }
}

export class MCJson {
  public name: string
  public optional: boolean
  public smallInput: boolean
  constructor(name: string, optional = false, smallInput = false) {
    this.name = name
    this.optional = optional
    this.smallInput = smallInput
  }
}

export class MCArray {
  public name: string
  public optional: boolean
  public smallInput: boolean
  constructor(name: string, optional = false, smallInput = false) {
    this.name = name
    this.optional = optional
    this.smallInput = smallInput
  }
}

export class MCBool {
  public name: string
  public optional: boolean
  constructor(name: string, optional = false) {
    this.name = name
    this.optional = optional
  }
}

export class MCKeyword {
  public name: string
  public wide: boolean
  constructor(name: string, wide = false) {
    this.name = name
    this.wide = wide
  }
}

// Int
interface ACommandIntValue {
  candidateValue: CandidateValue
  value?: number
  onUpdate?: (reason: string) => void
}
export class CommandIntValue {
  public id: string
  public candidate: CandidateValue
  public value?: number
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandIntValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: string) {
    this.value = value.trim().length ? parseInt(value) : undefined
    this.onUpdate('CommandIntValue.setValue()')
  }
}

// Float
interface ACommandFloatValue {
  candidateValue: CandidateValue
  value?: number
  onUpdate?: (reason: string) => void
}
export class CommandFloatValue {
  public id: string
  public candidate: CandidateValue
  public value?: number
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandFloatValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: string) {
    this.value = value.trim().length ? parseFloat(value) : undefined
    this.onUpdate('CommandFloatValue.setValue()')
  }
}

// Json
interface ACommandJsonValue {
  candidateValue: CandidateValue
  value?: string
  onUpdate?: (reason: string) => void
}
export class CommandJsonValue {
  public id: string
  public candidate: CandidateValue
  public value?: string
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandJsonValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: string) {
    this.value = value
    this.onUpdate('CommandJsonValue.setValue()')
  }
}

// Array
interface ACommandArrayValue {
  candidateValue: CandidateValue
  value?: string
  onUpdate?: (reason: string) => void
}
export class CommandArrayValue {
  public id: string
  public candidate: CandidateValue
  public value?: string
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandArrayValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: string) {
    this.value = value
    this.onUpdate('CommandArrayValue.setValue()')
  }
}

// String
interface ACommandStringValue {
  candidateValue: CandidateValue
  value?: string
  onUpdate?: (reason: string) => void
}
export class CommandStringValue {
  public id: string
  public candidate: CandidateValue
  public value?: string
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandStringValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: string) {
    this.value = value
    this.onUpdate('CommandStringValue.setValue()')
  }
}

// Raw
interface ACommandRawValue {
  candidateValue: CandidateValue
  value?: string
  onUpdate?: (reason: string) => void
}
export class CommandRawValue {
  public id: string
  public candidate: CandidateValue
  public value?: string
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandRawValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: string) {
    this.value = value
    this.onUpdate('CommandRawValue.setValue()')
  }
}

// Bool
interface ACommandBoolValue {
  candidateValue: CandidateValue
  value?: boolean
  onUpdate?: (reason: string) => void
}
export class CommandBoolValue {
  public id: string
  public candidate: CandidateValue
  public value?: boolean
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandBoolValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: boolean) {
    this.value = value
    this.onUpdate('CommandBoolValue.setValue()')
  }
}

// Keyword
interface ACommandKeywordValue {
  candidateValue: CandidateValue
  value?: string
  onUpdate?: (reason: string) => void
}
export class CommandKeywordValue {
  public id: string
  public candidate: CandidateValue
  public value?: string
  private onUpdate: (reason: string) => void
  constructor({ candidateValue, value, onUpdate = () => {} }: ACommandKeywordValue) {
    this.id = genId()
    this.candidate = candidateValue
    this.value = value
    this.onUpdate = onUpdate
  }
  setValue(value: string) {
    this.value = value
    this.onUpdate('CommandKeywordValue.setValue()')
  }
}

// Command
interface ACommand {
  candidate?: IMCCandidates
  onUpdate?: (reason: string) => void
}
export class Command {
  public id: string
  public candidates: IMCCandidates
  public children: (Command | CommandIntValue | CommandFloatValue | CommandStringValue | CommandRawValue | CommandJsonValue | CommandArrayValue | CommandBoolValue | CommandKeywordValue | string | undefined)[]
  public value: string
  public commentOut: boolean
  public onUpdate: (reason: string) => void

  constructor({ candidate = MCCommandHead, onUpdate = () => {} }: ACommand = {}) {
    this.id = genId()
    this.candidates = candidate
    this.children = []
    this.value = '?'
    this.commentOut = false
    this.onUpdate = onUpdate
    this.select(Object.keys(candidate)[0])
  }

  // Set
  setValue(value: string) {
    this.value = value
    this.onUpdate('Command.setValue()')
  }

  // Set
  setCommentOut(value = true) {
    this.commentOut = value
    this.onUpdate('Command.setCommentOut()')
  }

  setFromCode(code: string) {
    const tokens = code.trim().match(new RegExp(tokenRegExp, 'g')) || []
    if (tokens.length === 0) {
      this.select('…')
      return
    }
    this.setFromTokens(tokens)
  }

  setFromTokens(tokens: string[]) {
    const { candidates } = this
    if (tokens.length === 0) {
      return
    }
    tokens[0] = tokens[0].replace(/#/g, 'comment')
    let matches
    if ((matches = tokens[0].match(/([~^])(\d+)/))) {
      tokens[0] = matches[2]
      tokens.unshift(matches[1])
    }
    if (tokens[0] === 'comment') {
      this.commentOut = true
      tokens.shift()
    }
    if (candidates === MCTeleportOptions) {
      this.select(tokens[0].match(/^[~^\d]/) ? 'position' : 'target')
      this.setChildrenValuesByTokens(tokens)
    } else if (typeof candidates[tokens[0]] === 'undefined' && candidates['…']) {
      this.select('…')
      this.setChildrenValuesByTokens(tokens)
    } else if (candidates[tokens[0]]) {
      this.select(tokens[0])
      tokens.shift()
      this.setChildrenValuesByTokens(tokens)
    } else if (candidates['']) {
      // emptyable, no match, skip
    } else {
      // console.log(candidates, tokens[0])
      this.select('…')
      tokens[0] = tokens.join(' ')
      this.setChildrenValuesByTokens(tokens)
    }
  }

  private setChildrenValuesByTokens(tokens: string[]) {
    const { candidates } = this
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]
      if (tokens.length === 0) {
        break
      } else if (child instanceof Command) {
        child.setFromTokens(tokens)
      } else if (child instanceof CommandIntValue && tokens[0].match(/^\d+$/)) {
        child.setValue(tokens.shift() || '')
      } else if (child instanceof CommandFloatValue && tokens[0].match(/^(\d+)(\.\d+)?$/)) {
        child.setValue(tokens.shift() || '')
      } else if (child instanceof CommandStringValue && tokens[0].match(/^"(.*)"$/)) {
        child.setValue((tokens.shift() || '""').slice(1, -1))
      } else if (child instanceof CommandJsonValue && tokens[0].match(/^{(.*)}$/)) {
        child.setValue((tokens.shift() || '{}').slice(1, -1))
      } else if (child instanceof CommandArrayValue && candidates === MCTarget) {
        if (tokens[0].match(/^\[(.*)\]$/)) {
          child.setValue((tokens.shift() || '[]').slice(1, -1))
        } else {
          child.setValue('')
        }
      } else if (child instanceof CommandArrayValue && tokens[0].match(/^\[(.*)\]$/)) {
        child.setValue((tokens.shift() || '[]').slice(1, -1))
      } else if (child instanceof CommandRawValue) {
        child.setValue(tokens.shift() || '')
      } else if (child instanceof CommandBoolValue) {
        child.setValue(tokens.shift() === 'true')
      } else if (child instanceof CommandKeywordValue && tokens[0] === child.candidate.name) {
        child.setValue(tokens.shift() || '')
      } else {
        // console.log('???', tokens, child)
      }
    }
    this.onUpdate('Command.setChildrenValuesByTokens()')
  }

  refresh() {
    const code = this.toCode()
    this.setFromCode(code)
    this.onUpdate('Command.refresh()')
  }

  toCode(be = false) {
    const { value, children, commentOut, candidates } = this
    const childrenStr: string = children
      .map((child) => {
        if (child instanceof CommandIntValue) {
          return child.value?.toString() || ''
        } else if (child instanceof CommandFloatValue) {
          return child.value?.toString() || ''
        } else if (child instanceof CommandStringValue) {
          return `"${child.value || ''}"`
        } else if (child instanceof CommandJsonValue) {
          return `{${child.value || ''}}`
        } else if (child instanceof CommandArrayValue && candidates === MCTarget) {
          return child.value ? `[${child.value || ''}]` : ''
        } else if (child instanceof CommandArrayValue) {
          return `[${child.value || ''}]`
        } else if (child instanceof CommandRawValue) {
          return child.value || ''
        } else if (child instanceof CommandBoolValue) {
          return child.value ? 'true' : 'false'
        } else if (child instanceof CommandKeywordValue) {
          return child.value
        } else if (child instanceof Command) {
          return child.toCode()
        } else {
          throw new Error('Invalid Child' + child)
        }
      })
      .join(' ')
    const commandStr = value === '…' ? '' : value
    const code = `${commentOut || (be && BE_INVALID_COMMANDS.indexOf(value) >= 0) ? '# ' : ''}${commandStr} ${childrenStr}`
      .replace(/ +/g, ' ')
      .replace(/([~^]) *(\d+)/g, '$1$2')
      .replace(/(position|target|…)/g, '')
      .replace(/comment/g, '#')
      .trim()
    return code
  }

  select(candidateKey: string) {
    const { candidates, onUpdate } = this
    this.setValue(candidateKey)
    let selectedCandidateValues = candidates[candidateKey]
    if (!selectedCandidateValues) {
      return
    }
    if (!Array.isArray(selectedCandidateValues)) {
      selectedCandidateValues = [selectedCandidateValues]
    }
    this.children = selectedCandidateValues.map((candidateValue) => {
      if (candidateKey.startsWith('_')) {
        return undefined
      } else if (candidateValue instanceof MCInt) {
        return new CommandIntValue({ candidateValue, onUpdate })
      } else if (candidateValue instanceof MCFloat) {
        return new CommandFloatValue({ candidateValue, onUpdate })
      } else if (candidateValue instanceof MCString) {
        return new CommandStringValue({ candidateValue, onUpdate })
      } else if (candidateValue instanceof MCJson) {
        return new CommandJsonValue({ candidateValue, onUpdate })
      } else if (candidateValue instanceof MCArray) {
        return new CommandArrayValue({ candidateValue, onUpdate })
      } else if (candidateValue instanceof MCRaw) {
        return new CommandRawValue({ candidateValue, onUpdate })
      } else if (candidateValue instanceof MCBool) {
        return new CommandBoolValue({ candidateValue, onUpdate })
      } else if (candidateValue instanceof MCKeyword) {
        return new CommandKeywordValue({
          candidateValue,
          value: candidateValue.name,
          onUpdate,
        })
      } else if (typeof candidateValue === 'object') {
        return new Command({ candidate: candidateValue, onUpdate })
      } else if (typeof candidateValue === 'string') {
        return candidateValue
      } else {
        throw new Error('Invalid Child ' + candidateValue)
      }
    })
    this.onUpdate('Command.select()')
  }
}
