import styles from './Command.module.scss'
import './Command.i18n'

import classnames from 'classnames'
import { CSSProperties, useMemo } from 'react'
import { Command, CommandBoolValue, CommandIntValue, CommandStringValue, CommandRawValue, CommandJsonValue, CommandFloatValue, CommandArrayValue, CommandKeywordValue } from './lib/Command'
import { MCArray, MCBool, MCFloat, MCInt, MCJson, MCKeyword, MCRaw, MCString } from './lib/Command'
import { useTranslation } from 'react-i18next'
import { commandEmojis } from './lib/commands'

type Props = {
  className?: string
  style?: CSSProperties
  children?: JSX.Element | JSX.Element[] | string
  //
  command: Command
}

const CommandTag = ({ className, style, children, command }: Props) => {
  const { t } = useTranslation()

  // Render
  const commandType = useMemo(() => (command.candidates._i ? command.candidates._i[0].name : undefined), [command.candidates._i])
  return (
    <div className={classnames(styles.Command, command.commentOut && styles['Command--CommentOut'], command.children.length > 0 && styles['Command--HasChildren'], className)} style={style}>
      {/* Head */}
      {typeof command.candidates === 'object' && (
        <select
          className={classnames(styles.Command__Input, styles[`Command__Input--${command.id}`], commandType && styles[`Command__Input--${commandType}`])}
          onChange={(e) => command.select((e.target as HTMLSelectElement).value)}
          value={command.value}
          style={{ width: `${3 + (command.value.length / 2) * 1.1 + 2}em` }}
          data-usage="3"
        >
          {Object.keys(command.candidates).map(
            (candidateKey) =>
              !candidateKey.startsWith('_') && (
                <option key={`candidate_${command.value}_${candidateKey}`} value={candidateKey}>
                  {commandEmojis[candidateKey] ? `${commandEmojis[candidateKey]} ${t(candidateKey)}` : t(candidateKey)}
                </option>
              ),
          )}
        </select>
      )}
      {/* Children */}
      {command.children.map((command) => {
        if (command instanceof CommandIntValue && command.candidate instanceof MCInt) {
          // Int Child
          const c = command.candidate
          return (
            <input
              className={classnames(styles.Command__Input, styles['Command__Input--Number'], c.smallInput && styles['Command__Input--Small'])}
              key={`children_${command.id}`}
              type="number"
              placeholder={`${c.optional ? `(${commandEmojis[c.name] ? `${commandEmojis[c.name]}${t(c.name)}` : t(c.name)})` : commandEmojis[c.name] ? `${commandEmojis[c.name]} ${t(c.name)}` : t(c.name)}`}
              onChange={(e) => command.setValue(e.target.value)}
              value={typeof command.value !== 'number' ? '' : command.value}
            />
          )
        } else if (command instanceof CommandFloatValue && command.candidate instanceof MCFloat) {
          // Float Child
          const c = command.candidate
          return (
            <input
              className={classnames(styles.Command__Input, styles['Command__Input--Number'], c.smallInput && styles['Command__Input--Small'])}
              key={`children_${command.id}`}
              type="number"
              placeholder={`${c.optional ? `(${commandEmojis[c.name] ? `${commandEmojis[c.name]}${t(c.name)}` : t(c.name)})` : commandEmojis[c.name] ? `${commandEmojis[c.name]} ${t(c.name)}` : t(c.name)}`}
              onChange={(e) => command.setValue(e.target.value)}
              value={typeof command.value !== 'number' ? '' : command.value}
            />
          )
        } else if (command instanceof CommandStringValue && command.candidate instanceof MCString) {
          // String Child
          const c = command.candidate
          return (
            <div className={classnames(styles.Command__InputWrap, styles['Command__InputWrap--String'])} key={`children_${command.id}`}>
              <input
                className={classnames(styles.Command__Input, styles['Command__Input--String'], c.smallInput && styles['Command__Input--Small'])}
                type="text"
                placeholder={`${c.optional ? `(${commandEmojis[c.name] ? `${commandEmojis[c.name]}${t(c.name)}` : t(c.name)})` : commandEmojis[c.name] ? `${commandEmojis[c.name]} ${t(c.name)}` : t(c.name)}`}
                onChange={(e) => command.setValue(e.target.value)}
                value={typeof command.value !== 'string' ? '' : command.value}
              />
            </div>
          )
        } else if (command instanceof CommandJsonValue && command.candidate instanceof MCJson) {
          // Json Child
          const c = command.candidate
          return (
            <div className={classnames(styles.Command__InputWrap, styles['Command__InputWrap--Json'])} key={`children_${command.id}`}>
              <input
                className={classnames(styles.Command__Input, styles['Command__Input--Json'], c.smallInput && styles['Command__Input--Small'])}
                type="text"
                placeholder={`${c.optional ? `(${commandEmojis[c.name] ? `${commandEmojis[c.name]}${t(c.name)}` : t(c.name)})` : commandEmojis[c.name] ? `${commandEmojis[c.name]} ${t(c.name)}` : t(c.name)}`}
                onChange={(e) => command.setValue(e.target.value)}
                value={typeof command.value !== 'string' ? '' : command.value}
              />
            </div>
          )
        } else if (command instanceof CommandArrayValue && command.candidate instanceof MCArray) {
          // Array Child
          const c = command.candidate
          return (
            <div className={classnames(styles.Command__InputWrap, styles['Command__InputWrap--Array'])} key={`children_${command.id}`}>
              <input
                className={classnames(styles.Command__Input, styles['Command__Input--Array'], c.smallInput && styles['Command__Input--Small'])}
                type="text"
                placeholder={`${c.optional ? `(${commandEmojis[c.name] ? `${commandEmojis[c.name]}${t(c.name)}` : t(c.name)})` : commandEmojis[c.name] ? `${commandEmojis[c.name]} ${t(c.name)}` : t(c.name)}`}
                onChange={(e) => command.setValue(e.target.value)}
                value={typeof command.value !== 'string' ? '' : command.value}
              />
            </div>
          )
        } else if (command instanceof CommandRawValue && command.candidate instanceof MCRaw) {
          // Raw Child
          const c = command.candidate
          return (
            <input
              className={classnames(styles.Command__Input, styles['Command__Input--Raw'], c.smallInput && styles['Command__Input--Small'])}
              key={`children_${command.id}`}
              type="text"
              placeholder={`${c.optional ? `(${commandEmojis[c.name] ? `${commandEmojis[c.name]}${t(c.name)}` : t(c.name)})` : commandEmojis[c.name] ? `${commandEmojis[c.name]} ${t(c.name)}` : t(c.name)}`}
              onChange={(e) => command.setValue(e.target.value)}
              value={typeof command.value !== 'string' ? '' : command.value}
            />
          )
        } else if (command instanceof CommandBoolValue && command.candidate instanceof MCBool) {
          // Bool Child
          const c = command.candidate
          return (
            <div className={styles.Command__InputWrap} key={`children_${command.id}`}>
              <span>{t(c.name)}:</span>
              <input className={classnames(styles.Command__Input, styles['Command__Input--Boolean'])} type="checkbox" onChange={(e) => command.setValue(e.target.checked)} checked={command.value || false} />
            </div>
          )
        } else if (command instanceof CommandKeywordValue && command.candidate instanceof MCKeyword) {
          // Keyword Child
          return (
            <span key={`children_${command.id}`} className={classnames(styles.Command__Text, command.candidate.wide && styles['Command__Text--Wide'])}>
              {t(command.value || '')}
            </span>
          )
        } else if (command instanceof Command) {
          // Command Child
          return <CommandTag key={`children_${command.id}`} command={command}></CommandTag>
        }
      })}
      {children}
    </div>
  )
}

export default CommandTag
