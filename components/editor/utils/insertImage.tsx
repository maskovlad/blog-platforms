import { Editor, Node, Transforms } from "slate"
import isUrl from 'is-url'
import { ParagraphElement } from "@/types/editor"
import imageExtensions from 'image-extensions'

export const insertImage = async (editor, url) => {
  const text = { text: '' }
  const paragraph: ParagraphElement = { type: 'paragraph', children: [text] }
  const img: HTMLImageElement = new Image()
  console.log({ url })

  img.onload = () => {
    const image = {
      type: 'image',
      url,
      width: img.naturalWidth,
      height: img.naturalHeight,
      ratio: img.naturalWidth / img.naturalHeight,
      children: [text]
    }
    Transforms.insertNodes(editor, image as Node)
    // якщо в кінці документа додамо за медіа параграф
    if (!Editor.next(editor)) {
      Transforms.insertNodes(editor, paragraph)
    }
  }

  img.src = url
}

export const isImageUrl = (url: string | URL) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop() as string
  return imageExtensions.includes(ext)
}

