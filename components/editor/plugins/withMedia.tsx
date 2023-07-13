import isUrl from 'is-url'
import { toast } from 'react-hot-toast'
import { Transforms, Path, Node, Editor } from 'slate'
import { insertImage, isImageUrl, imageExists } from "../utils/insertImage"
import { insertYoutube } from "../utils/insertYoutube"

export const withMedia = editor => {
  const { insertData, isVoid, insertBreak } = editor
  const paragraph = { type: 'paragraph', children: [{ text: "" }] }

  // повідомляє slate, що певні вузли не мають текстового вмісту (вони _void_)
  // дуже зручно для таких речей, як зображення та діаграми
  editor.isVoid = element => {
    return (element.type === ('image' || 'youtube')) ? true : isVoid(element)
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')
    const { files } = data

    console.log({ text, files })

    if (files && files.length > 0) {
      for (const file of files) {
        const [mime] = file.type.split('/')
        console.log({ type: file.type })
        if (mime === 'image') {
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            const url = text ? text : reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isUrl(text)) {
      if (!insertYoutube(editor, text)) insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}


//*  викликається, коли користувачі вставляють або перетягують речі в редактор
// editor.insertData = async (data: DataTransfer) => {
//   const text = data.getData('text/plain')
//   const File = data.getData('File')
//   const { files } = data

//   console.log({ text, files, data, filesItem:files.item(0)?.name })
//   //
//   // image або youtube
//   if (isUrl(text)) {
//     if (isImageUrl(text) || isImageUrl(files.item(0)?.name as string)) {
//       insertImage(editor,text)
//     }
//     // if (!insertYoutube(editor, text)) {
//     //   await insertImage(editor, text)
//     // }
//     //
//     // FILE
//   } else if (files && files.length > 0) {
//     for (const file of files) {
//       const reader = new FileReader()
//       const [mime] = file.type.split('/')

//       if (mime === 'image') {
//         reader.addEventListener('load', () => {
//           const url = reader.result
//           insertImage(editor, url)
//           // Transforms.insertNodes(editor, paragraph as Node)
//         })

//         reader.readAsDataURL(file)
//       }
//     }

//   } else {
//     insertData(data)
//   }
// }

