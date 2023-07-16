import { Button } from '@/components/editor/ui/ui'
import { useSlate } from 'slate-react'
import { toggleMark, isMarkActive } from '../../utils/toggleMark'
import Icon from "../../ui/Icon"


const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export const MarkButton = ({ format, hint  }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event:any) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      <Icon icon={format} />
    </Button>
  )
}
