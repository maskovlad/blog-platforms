import { useCallback, useEffect, useState } from "react"
import { Editor, Text } from "slate"
import { Element as SlateElement, Range } from "slate"
import { Editable, useSlate } from "slate-react"
import useOnKeydown from "../customHooks/useOnKeyDown"
import { RenderElement, RenderLeaf } from "../Elements/elements"
import { CodeBlockElement } from "@/types/editor";

const CODE_LINE_TYPE = 'code-line'
const CODE_BLOCK_TYPE = 'code-block'

const EditableWithDecorate = () => {
  const editor = useSlate()
  const renderElement = useCallback(props => <RenderElement {...props} />, [])
  const renderLeaf = useCallback(props => <RenderLeaf {...props} />, [])
  const onKeyDown = useOnKeydown(editor)

  const [lastActiveSelection, setLastActiveSelection] = useState<Range>()

  useEffect(() => {
    if (editor.selection != null) setLastActiveSelection(editor.selection)
  }, [editor.selection])

  const decorate = useCallback(
    ([node, path]) => {
      if (
        Text.isText(node) &&
        // editor.selection == null &&
        !Editor.isEditor(node) &&
        lastActiveSelection != null
      ) {
        const intersection = Range.intersection(lastActiveSelection, Editor.range(editor, path))

        if (intersection == null) {
          return []
        }

        const range = {
          highlighted: true,
          ...intersection
        };

        return [range]
      }

      if (SlateElement.isElement(node) && node.type === CODE_LINE_TYPE) {
        const ranges = editor.nodeToDecorations?.get(node) || []
        return ranges
      }

      return [];
    },
    [editor.nodeToDecorations, lastActiveSelection]
  );

  return (
    <Editable
      decorate={decorate}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      placeholder="Enter some rich text…"
      spellCheck
      autoFocus
      onKeyDown={onKeyDown}
      style={{ padding: "0 3rem" }}
    />


  )
}

export default EditableWithDecorate