import { Button } from '@/components/editor/ui'
import { toast, Toaster } from 'react-hot-toast'
import { useSlateStatic } from 'slate-react'
import isUrl from 'is-url'
import { insertImage, insertYoutube, isBlockActive, isImageUrl, isMarkActive, isYoutubeUrl, toggleBlock, toggleMark } from './utils'
import Icon from "./Icon"

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

export const BlockButton = ({ format, hint }) => {
  const editor = useSlateStatic()

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
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      <Icon icon={format} />
    </Button>
  )
}

export const MarkButton = ({ format, hint }) => {
  const editor = useSlateStatic()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      <Icon icon={format} />
    </Button>
  )
}



export const MediaButton = ({ format, hint }) => {
  const editor = useSlateStatic()
  return (
    <Button
      onMouseDown={event => {
        event.preventDefault()
        const посилання = window.prompt(`Вставте посилання на ${format === "image" ? "зображення" : "Youtube"} сюди, або в потрібне місце в дописі`)
        if (посилання && !isUrl(посилання)) {
          toast.error('Посилання не дійсне')
          return
        }
        if (посилання && isImageUrl(посилання as string)) insertImage(editor, посилання)
        else if (посилання && isYoutubeUrl(посилання as string)) insertYoutube(editor, isYoutubeUrl(посилання as string))
        else {
          toast.error(`Посилання не є ${format === "image" ? "зображення" : "Youtube"}`)
          return
        }
      }}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
      <Icon icon={format} />
    </Button>
  )
}
