import { CustomEditor } from '@/types/editor'
import { Editor } from 'slate'

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const isMarkActive = (editor: CustomEditor, format: string) => {
  // if (format==="color"||format==="bgColor") console.log({format})
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const addMarkData = (editor, data) => {
  console.log({data})
  Editor.addMark(editor, data.format, data.value);
};


export const activeMark = (editor, format) => {
  const defaultMarkData = {
    color: "black",
    bgColor: "black",
    fontSize: "normal",
    fontFamily: "sans",
  };
  const marks = Editor.marks(editor);
  const defaultValue = defaultMarkData[format];
  return marks?.[format] ?? defaultValue;
};




