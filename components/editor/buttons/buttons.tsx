import { Button } from '@/components/editor/ui/ui'
import { toast, Toaster } from 'react-hot-toast'
import { useSlateStatic } from 'slate-react'
import isUrl from 'is-url'
import { toggleMark, isMarkActive } from '../utils/toggleMark'
import { toggleBlock, isBlockActive  } from '../utils/toggleBlock'

import {insertImage, isImageUrl} from "../utils/insertImage"
import {insertYoutube, isYoutubeUrl} from "../utils/insertYoutube"
import Icon from "../ui/Icon"
import { Transforms } from 'slate'
import { Editor } from 'slate'

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



export const MediaButton = ({ format, hint, ...props }) => {
  const editor = useSlateStatic()
  
  
  return (
    <Button
      onMouseDown={event => {
        event.preventDefault()
        const url = window.prompt(`Вставте посилання на ${format === "image" ? "зображення" : "Youtube"} сюди, або в потрібне місце в дописі`)
        if (!url || url==="") return

        if (url && !isUrl(url)) {
          toast.error('Посилання не дійсне')
          return
        }

        if (url && isImageUrl(url as string)) {
          insertImage(editor, url)
        } else if (url && isYoutubeUrl(url as string)) {
          insertYoutube(editor, isYoutubeUrl(url as string))
        } else {
          toast.error(`Посилання не є ${format === "image" ? "зображення" : "Youtube"}`)
          return
        }

        if (!Editor.next(editor)) {
          Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] })
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
