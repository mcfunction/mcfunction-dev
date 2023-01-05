import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Command from './Command'

export default {
  title: 'Command',
  component: Command,
  parameters: {},
} as ComponentMeta<typeof Command>

const Template: ComponentStory<typeof Command> = (args) => <Command {...args} />

export const Default = Template.bind({})
Default.args = {}
