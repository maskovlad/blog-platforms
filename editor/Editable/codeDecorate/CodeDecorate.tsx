import { normalizeTokens } from "./normalize-tokens"
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import {
  Node,
  Editor,
  Range,
  Element as SlateElement,
  NodeEntry,
  Text,
} from 'slate'
import { CodeBlockElement } from "@/types/editor";
import { useSlate } from "slate-react";

const CODE_LINE_TYPE = 'code-line'
const CODE_BLOCK_TYPE = 'code-block'

// const useDecorate = (editor: Editor) => {

//   const [lastActiveSelection, setLastActiveSelection] = useState<Range>()

//   useEffect(() => {
//     if (editor.selection != null) setLastActiveSelection(editor.selection)
//   }, [editor.selection])

//   const decorate = useCallback(
//     ([node, path]) => {


//       if (SlateElement.isElement(node) && node.type === CODE_LINE_TYPE) {
//         const ranges = editor.nodeToDecorations?.get(node) || []
//         return ranges
//       }

//       if (
//         Text.isText(node) &&
//         // editor.selection == null &&
//         lastActiveSelection != null
//       ) {
//         const intersection = Range.intersection(lastActiveSelection, Editor.range(editor, path))

//         if (intersection == null) {
//           return []
//         }

//         const range = {
//           highlighted: true,
//           ...intersection
//         };

//         return [range]
//       }


//       return []
//     },
//     [editor.nodeToDecorations, lastActiveSelection]
//   )
//   return decorate
// }

// export default useDecorate

// precalculate editor.nodeToDecorations map to use it inside decorate function then
export const SetNodeToDecorations = () => {
  const editor = useSlate()

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: 'highest',
      match: n => SlateElement.isElement(n) && n.type === CODE_BLOCK_TYPE,
    })
  )

  const nodeToDecorations = mergeMaps(
    ...blockEntries.map(getChildNodeToDecorations)
  )

  editor.nodeToDecorations = nodeToDecorations

  return null
}

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<CodeBlockElement>) => {
  const nodeToDecorations = new Map<SlateElement, Range[]>()

  const text = block.children.map(line => Node.string(line)).join('\n')
  const language = block.language
  const tokens = Prism.tokenize(text, Prism.languages[language])
  const normalizedTokens = normalizeTokens(tokens) // make tokens flat and grouped by line
  const blockChildren = block.children as SlateElement[]

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index]
    const element = blockChildren[index]

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, [])
    }

    let start = 0
    for (const token of tokens) {
      const length = token.content.length
      if (!length) {
        continue
      }

      const end = start + length

      const path = [...blockPath, index, 0]
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map(type => [type, true])),
      }

      nodeToDecorations.get(element)!.push(range)

      start = end
    }
  }

  return nodeToDecorations
}

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>()

  for (const m of maps) {
    for (const item of m) {
      map.set(...item)
    }
  }

  return map
}


