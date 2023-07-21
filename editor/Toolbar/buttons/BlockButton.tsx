// import { Button } from '@/components/editor/ui/ui'
import Button from './Button'
import { useSlate } from 'slate-react'
import { toggleBlock, isBlockActive } from '../../utils/toggleBlock'
import Icon from "../../ui/Icon"

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export const BlockButton = ({ format, hint }) => {
  const editor = useSlate()

  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
      hint={hint}
    >
      <Icon icon={format} />
    </Button>
  )
}

