// import { Button } from '@/components/editor/ui/ui'
import Button from './Button'
import { useSlate } from 'slate-react'
import { toggleMark, isMarkActive } from '../../utils/toggleMark'
import Icon from "../../ui/Icon"


export const MarkButton = ({ format, hint  }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event:any) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      hint={hint}
    >
      <Icon icon={format} />
    </Button>
  )
}
