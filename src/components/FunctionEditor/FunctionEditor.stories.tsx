import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import FunctionEditor from './FunctionEditor'

export default {
  title: 'FunctionEditor',
  component: FunctionEditor,
  parameters: {},
} as ComponentMeta<typeof FunctionEditor>

const Template: ComponentStory<typeof FunctionEditor> = (args) => <FunctionEditor {...args} />

export const Default = Template.bind({})
Default.args = {}
