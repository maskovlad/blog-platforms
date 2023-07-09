import isUrl from 'is-url'
import { Transforms, Path, Node, Editor } from 'slate'
import { insertImage, insertYoutube, isImageUrl, isYoutubeUrl } from '../utils/toggleMark'


export const withMedia = editor => {
  const { insertData, isVoid, insertBreak } = editor

  // повідомляє slate, що певні вузли не мають текстового вмісту (вони _void_)
  // дуже зручно для таких речей, як зображення та діаграми
  editor.isVoid = element => {
    return (element.type === ('image' || 'youtube')) ? true : isVoid(element)
  }

  //*  викликається, коли користувачі вставляють або перетягують речі в редактор
  editor.insertData = (data) => {
    const text = data.getData('text/plain')
    const { files } = data
    //
    // image або youtube
    if (isUrl(text)) {
      if (isImageUrl(text)) {
        insertImage(editor, text)
      }
      else if (isYoutubeUrl(text)) {
        insertYoutube(editor, isYoutubeUrl(text))
      }
    //
    // FILE
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

