import { CustomEditor } from '@/types/editor'
import {
  Editor,
  Element as SlateElement,
  Transforms,
} from 'slate'

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']
const CODE_BLOCK_TYPE = 'code-block'
const CODE_LINE_TYPE = 'code-line'
const PARAGRAPH_TYPE = 'paragraph'
const LIST_ITEM_TYPE = 'list-item'


export const toggleBlock = (editor, format) => {

  const isList = LIST_TYPES.includes(format)
  const isCode = CODE_BLOCK_TYPE === format
  const isAlign = TEXT_ALIGN_TYPES.includes(format)

  //* чи увімкнений format, що прийшов з кнопки зараз на цьому блоці
  const isActiveFormat = isBlockActive(
    editor,
    format,
    isAlign ? 'align' : 'type'
  )

  //* знімаємо у списка або у блока коду wrapper 
  Transforms.unwrapNodes(editor, {
    match: node => {
      return !Editor.isEditor(node) &&  // не є глобальним обьєктом Editor
        SlateElement.isElement(node) && // вузол є елементом
        (LIST_TYPES.includes(node.type) || CODE_BLOCK_TYPE === node.type) &&  // вузол є списком або кодом
        !isAlign  //? не є вирівнюванням
    },
    split: true,
  })

  let newProps: Partial<SlateElement>

  if (!isActiveFormat) {
    if (isAlign) {
      newProps = { align: format }
    } else if (isList) {
      newProps = { type: LIST_ITEM_TYPE }
    } else if (isCode) {
      newProps = { type: CODE_LINE_TYPE }
    } else {
      newProps = { type: format }
    }
  } else {
    if (isAlign) {
      newProps = { align: undefined }
    } else {
      newProps = { type: PARAGRAPH_TYPE }
    }
  }

  //* встановлюємо тип блоку або вирівнювання
  Transforms.setNodes<SlateElement>(editor, newProps)

  //* список обертаємо wrapper'ом
  if (!isActiveFormat && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block) // обертає виділення блоком
  }
  if (!isActiveFormat && isCode) {
    const block = { type: format, language: 'css', url: "", children: [] }
    Transforms.wrapNodes(editor, block) // обертає виділення блоком
  }
}

// чи має вибраний блок format
export const isBlockActive = (editor: CustomEditor, format: string, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

