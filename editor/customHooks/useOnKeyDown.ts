import isHotkey from "is-hotkey"
import { useCallback } from "react"
import { Editor, Range, Transforms } from "slate"
import { toggleMark } from "../utils/toggleMark"

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}


const useOnKeydown = (editor: Editor) => {
  const onKeyDown: React.KeyboardEventHandler = useCallback(
    event => {
      const { selection } = editor
//*************** */

      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event as any)) {
          event.preventDefault()
          const mark = HOTKEYS[hotkey]
          toggleMark(editor, mark)
        }
      }

      if (isHotkey('tab', event)) {
        // handle tab key, insert spaces
        event.preventDefault()

        Editor.insertText(editor, '  ')
      }

      if (selection && Range.isCollapsed(selection)) {
        const { nativeEvent } = event
        if (isHotkey('left', nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, { unit: 'offset', reverse: true })
          return
        }
        if (isHotkey('right', nativeEvent)) {
          event.preventDefault()
          Transforms.move(editor, { unit: 'offset' })
          return
        }
      }

/**************** */
    },
    [editor]
  )

  return onKeyDown
}

export default useOnKeydown
