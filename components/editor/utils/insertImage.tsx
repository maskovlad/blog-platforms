import { Editor, Node, Transforms } from "slate"
import isUrl from 'is-url'
import { ParagraphElement } from "@/types/editor"
import imageExtensions from 'image-extensions'
import { toast } from "react-hot-toast"

export const insertImage = (editor, url) => {
  const text = { text: '' }
  const paragraph: ParagraphElement = { type: 'paragraph', children: [text] }
  const img: HTMLImageElement = new Image()
  // console.log({ url })

  img.onerror = () => {return}

  img.onload = () => {
    const image = {
      type: 'image',
      url,
      width: img.naturalWidth,
      height: img.naturalHeight,
      ratio: img.naturalWidth / img.naturalHeight,
      children: [text]
    }

    const isEnd = !Editor.next(editor)
    // @ts-ignore
    if (isEnd) { Transforms.insertNodes(editor, [image, paragraph]) } else { Transforms.insertNodes(editor, image) }
  }

  img.src = url
}

// перевіряє лише розширення файлу, тому поки не використовую
export const isImageUrl = (url: string | URL) => {
  // console.log({url})
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop() as string

  if (imageExtensions.includes(ext)) return true
}

export function imageExists(url, callback) {
  var img = new Image();
  img.onload = function lo() { return true };
  img.onerror = function er() { return false };
  img.src = url;
}

