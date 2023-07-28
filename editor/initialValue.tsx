// @ts-nocheck

import { Descendant, Element as SlateElement } from 'slate'


const CODE_LINE_TYPE = "code-line"
const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
const CODE_BLOCK_TYPE = 'code-block'
const PARAGRAPH_TYPE = 'paragraph'
const LIST_ITEM_TYPE = 'list-item'

const toChildren = (content: string) => [{ text: content }]

const toCodeLines = (content: string): SlateElement[] =>
  content
    .split('\n')
    .map(line => ({ type: CODE_LINE_TYPE, children: toChildren(line) }))


export const initialValue: Descendant[] = [
  {
    "type": "paragraph",
    "children": [
      {
        "text": "Почніть "
      },
      {
        "text": "створювати",
        "bold": true
      },
      {
        "text": " свій, "
      },
      {
        "text": "найкращий",
        "italic": true
      },
      {
        "text": " пост!"
      }
    ]
  },
  {
    "type": "image",
    "url": "https://news.bigmir.net/i/72/88/57/7/7288577/image_main/9b4f131b5c6ba33a102d48c1fb433b80-quality_75Xresize_crop_1Xallow_enlarge_0Xw_740Xh_400.jpg",
    "width": 740,
    "height": 400,
    "ratio": 1.85,
    "children": [
      {
        "text": ""
      }
    ]
  }
]