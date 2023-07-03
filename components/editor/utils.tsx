import { CustomEditor, CustomElement, ImageElement, NumberedListElement, YoutubeElement } from '@/types/editor'
import {
  Editor,
  Element as SlateElement,
  Transforms,
  Node
} from 'slate'
import isUrl from 'is-url'
import imageExtensions from 'image-extensions'
import { useSlateStatic } from 'slate-react'
import { Button, Icon } from './components'
import { css } from '@emotion/react'
import toast, { Toaster } from "react-hot-toast";


const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
const CODE_BLOCK_TYPE = 'code-block'
const CODE_LINE_TYPE = 'code-line'
const PARAGRAPH_TYPE = 'paragraph'
const LIST_ITEM_TYPE = 'list-item'


export const toggleBlock = (editor, format) => {

  const isList = LIST_TYPES.includes(format)
  const isCode = CODE_BLOCK_TYPE === format
  const isAlign = TEXT_ALIGN_TYPES.includes(format)

  //* чи увімкнений format, що прийшов з кнопки зараз на цьому блоці
  const isActiveFormat = isBlockActive(
    editor,
    format,
    isAlign ? 'align' : 'type'
  )

  //* знімаємо у списка або у блока коду wrapper 
  Transforms.unwrapNodes(editor, {
    match: node => {
      return !Editor.isEditor(node) &&  // не є глобальним обьєктом Editor
        SlateElement.isElement(node) && // вузол є елементом
        (LIST_TYPES.includes(node.type) || CODE_BLOCK_TYPE === node.type) &&  // вузол є списком або кодом
        !isAlign  //? не є вирівнюванням
    },
    split: true,
  })

  let newProps: Partial<SlateElement>

  if (!isActiveFormat) {
    if (isAlign) {
      newProps = { align: format }
    } else if (isList) {
      newProps = { type: LIST_ITEM_TYPE }
    } else if (isCode) {
      newProps = { type: CODE_LINE_TYPE }
    } else {
      newProps = { type: format }
    }
  } else {
    if (isAlign) {
      newProps = { align: undefined }
    } else {
      newProps = { type: PARAGRAPH_TYPE }
    }
  }

  //* встановлюємо тип блоку або вирівнювання
  Transforms.setNodes<SlateElement>(editor, newProps)

  //* список обертаємо wrapper'ом
  if (!isActiveFormat && isList) {
    const block= { type: format, children: [] }
    Transforms.wrapNodes(editor, block) // обертає виділення блоком
  }
  if (!isActiveFormat && isCode) {
    const block = { type: format, language: 'css', url:"", children: [] }
    Transforms.wrapNodes(editor, block) // обертає виділення блоком
  }
}

export const isBlockActive = (editor: CustomEditor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const withMedia = editor => {
  const { insertData, isVoid } = editor

  // повідомляє slate, що певні вузли не мають текстового вмісту (вони _void_)
  // дуже зручно для таких речей, як зображення та діаграми
  editor.isVoid = element => {
    return (element.type === ('image' || 'youtube')) ? true : isVoid(element)
  }

  //  викликається, коли користувачі вставляють або перетягують речі в редактор
  editor.insertData = data => {
    const text = data.getData('text/plain')
    const { files } = data
    console.log( text )

    if (isUrl(text)) {
      if (isImageUrl(text)) insertImage(editor, text)
      else if (isYoutubeUrl(text)) insertYoutube(editor, isYoutubeUrl(text))
    
    } else if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertImage = (editor, url) => {
  const text = { text: '' }
  const image: ImageElement = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
}

const insertYoutube = (editor, matches) => {
  const text = { text: '' }
  const [_, videoId] = matches
  const youtube = {type: 'youtube', videoId, children: [text]}
  Transforms.insertNodes(editor, youtube as Node)
}

const isImageUrl = (url: string | URL) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop() as string
  return imageExtensions.includes(ext)
}

const isYoutubeUrl = (url: string | URL) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const youtubeRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/
  const matches = (url as string).match(youtubeRegex)
  return matches
}

export const InsertMediaButton = ({format, icon, hint}) => {
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
      <Icon>{icon}</Icon>
    </Button>
  )
}




