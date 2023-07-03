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
    type: PARAGRAPH_TYPE,
    children: toChildren(
      "Here's one containing a single paragraph block with some text in it:"
    ),
  },
  {
    type: CODE_BLOCK_TYPE,
    language: 'jsx',
    url: "",
    children: toCodeLines(`// Add the initial value.
      const initialValue = [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }]
        }
      ]

      const App = () => {
        const [editor] = useState(() => withReact(createEditor()))

        return (
          <Slate editor={editor} initialValue={initialValue}>
            <Editable />
          </Slate>
        )
      }`),
  },
  {
    type: PARAGRAPH_TYPE,
    children: toChildren(
      'If you are using TypeScript, you will also need to extend the Editor with ReactEditor and add annotations as per the documentation on TypeScript. The example below also includes the custom types required for the rest of this example.'
    ),
  },
  {
    type: CODE_BLOCK_TYPE,
    language: 'typescript',
    url: "",
    children: toCodeLines(`// TypeScript users only add this code
      import { BaseEditor, Descendant } from 'slate'
      import { ReactEditor } from 'slate-react'

      type CustomElement = { type: 'paragraph'; children: CustomText[] }
      type CustomText = { text: string }

      declare module 'slate' {
        interface CustomTypes {
          Editor: BaseEditor & ReactEditor
          Element: CustomElement
          Text: CustomText
        }
      }`),
  },
  {
    type: PARAGRAPH_TYPE,
    children: toChildren('There you have it!'),
  },
]

