import { Transforms, Node } from 'slate'
import isUrl from 'is-url'
import { toast } from 'react-hot-toast'

// export const insertYoutube1 = (editor, matches) => {
//   const text = { text: '' }
//   const [_, videoId] = matches
//   const youtube = { type: 'youtube', videoId, children: [text] }
//   Transforms.insertNodes(editor, youtube as Node)
// }

// export const isYoutubeUrl = (url: string | URL) => {
//   if (!isUrl(url)) return false
//   const youtubeRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/
//   const matches = (url as string).match(youtubeRegex)
//   return matches
// }

export const insertYoutube = (editor, url) => {
  if (!isUrl(url)) return false
  const youtubeRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/
  const youtubeRegex1 = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/
  const matches = (url).match(youtubeRegex1)
  
  if (!matches) {
    return false
  }
  
  const [_, videoId] = matches
  const youtube = { type: 'youtube', videoId, children: [{ text: '' }] }
  Transforms.insertNodes(editor, youtube as Node)
  return true
}