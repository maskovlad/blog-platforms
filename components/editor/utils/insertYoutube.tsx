import { Transforms, Node } from 'slate'
import isUrl from 'is-url'

export const insertYoutube = (editor, matches) => {
  const text = { text: '' }
  const [_, videoId] = matches
  const youtube = { type: 'youtube', videoId, children: [text] }
  Transforms.insertNodes(editor, youtube as Node)
}

export const isYoutubeUrl = (url: string | URL) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const youtubeRegex = /^(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:\S+)?$/
  const matches = (url as string).match(youtubeRegex)
  return matches
}

