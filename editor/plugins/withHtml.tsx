import { Transforms } from "slate"
import { deserialize } from "../utils/deserialize"

export const withHtml = editor => {
  const { insertData, isInline, isVoid } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data: DataTransfer) => {
    const html = data.getData('text/html') // увесь htlm в буфері

    if (html) {
      const parsed = new DOMParser().parseFromString(html, 'text/html')
      const fragment = deserialize(parsed.body)
      console.log({parsed,fragment})
      // fragment.forEach(element => {
      //   Transforms.insertNodes(editor, element)
      // });
      Transforms.insertFragment(editor,fragment)
      return
    }

    insertData(data)
  }

  return editor
}

