import isUrl from 'is-url'
import { toast } from 'react-hot-toast'
import { Transforms, Path, Node, Editor } from 'slate'
import { insertImage, isImageUrl } from "../utils/insertImage"
import { insertYoutube, isYoutubeUrl } from "../utils/insertYoutube"
import { insertLink } from '../utils/link'

export const withMedia = editor => {
  const { insertData, isVoid, insertBreak } = editor
  const paragraph = { type: 'paragraph', children: [{ text: "" }] }

  // повідомляє slate, що певні вузли не мають текстового вмісту (вони _void_)
  // дуже зручно для таких речей, як зображення та діаграми
  editor.isVoid = element => {
    return (element.type === ('image' || 'youtube')) ? true : isVoid(element)
  }

  /**
   * спрацьовує при вставці (Ctrl+v або drag-n-drop) у редактор
   * @param data DataTransfer
   */
  editor.insertData = async data => {
    const text = data.getData('text/plain')
    const { files } = data

    // якщо це файл, то цікавить тільки якщо це зображення
    if (files && files.length > 0) {
      for (const file of files) {
        const [mime] = file.type.split('/')
        
        if (mime === 'image') {
          const reader = new FileReader()
          reader.addEventListener('load', () => {
            // якщо у файла є url, то вставлятимемо блок "image" з урлом у першу чергу,
            // щоб економити розмір бази даних. 
            // Тільки якщо це локальний файл то вставлятимемо як base64
            const url = text ? text : reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    // якщо це посилання, перевірятимемо по черзі всі підтримувані 
    // редактором типи посилань і вставляємо
    } else if (isUrl(text)) {
      if (isYoutubeUrl(text)) {
        console.log("Pasting youtube")
        insertYoutube(editor, text)
      }
      else if (await isImageUrl(text)) {
        console.log("Pasting image")
        insertImage(editor, text)}
      else {
        console.log("Pasting link")
        insertLink(editor, { url: text, showInNewTab: false })}
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

