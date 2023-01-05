import { render, screen } from '@testing-library/react'
import FunctionEditor from './FunctionEditor'
import '@testing-library/jest-dom'
import { ProjectManager } from './lib/ProjectManager'

describe('Header', () => {
  it('テキストが描画される', () => {
    const projectManager = new ProjectManager()
    projectManager.load()
    render(<FunctionEditor projectManager={projectManager} />)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})
