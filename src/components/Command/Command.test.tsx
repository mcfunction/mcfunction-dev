import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import CommandTag from './Command'
import { Command } from './lib/Command'

describe('Command', () => {
  it('テキストが描画される', () => {
    const command = new Command()
    render(<CommandTag command={command} />)
    expect(screen.getByText('Command')).toBeInTheDocument()
  })
})
