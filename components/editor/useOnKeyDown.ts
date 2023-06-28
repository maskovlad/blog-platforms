import isHotkey from "is-hotkey"
import { useCallback } from "react"
import { Editor } from "slate"
import { toggleMark } from "./utils"

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}


const useOnKeydown = (editor: Editor) => {
  const onKeyDown: React.KeyboardEventHandler = useCallback(
    event => {
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
    },
    [editor]
  )

  return onKeyDown
}

export default useOnKeydown
