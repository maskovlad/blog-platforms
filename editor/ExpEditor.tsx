"use client"

import { createEditor, Descendant } from 'slate'
import { withReact, Slate, } from 'slate-react'
import { withHistory } from 'slate-history'
import { CustomEditor } from "@/types/editor";
import { ToolBar } from './Toolbar/ToolBar'
import { useMemo, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import { withMedia } from './plugins/withMedia'
import { initialValue } from './initialValue'
import { SetNodeToDecorations } from './Editable/codeDecorate/CodeDecorate'
import { MarkButton } from './Toolbar/buttons/MarkButton'
import { BlockButton } from "./Toolbar/buttons/BlockButton"
import { MediaButton } from "./Toolbar/buttons/MediaButton"
import TableSelector from './Elements/Table/TableSelector';
import withLinks from "./plugins/withLinks"
import withTable from "./plugins/withTable"
import LinkButton from './Toolbar/buttons/LinkButton'
import ColorPicker from "./Elements/ColorPicker/ColorPicker"
// import "material-icons/iconfont/material-icons.css"
import { withHtml } from './plugins/withHtml';
import EditableWithDecorate from './Editable/EditableWithDecorate';
import { Dropdown } from './Toolbar/buttons/Dropdown';
import AlignSelect from './Toolbar/buttons/AlignSelect';
import HeadingSelect from './Toolbar/buttons/HeadingSelect';
import { css } from '@emotion/css';

const fontSizeOptions = [{ text: 'Small', value: 'small' }, { text: 'Normal', value: 'normal' }, { text: 'Medium', value: 'medium' }, { text: 'Huge', value: 'huge' }]

const fontFamilyOptions = [{ text: 'Sans Serif', value: 'sans' }, { text: 'Serif', value: 'serif' }, { text: 'MonoSpace', value: 'monospace' }, { text: 'Скинути', value: 'inherit' }]

// @refresh reset
export default function ExpEditor() {

  const editor: CustomEditor = useMemo(() =>
    withHtml(
      withTable(
        withLinks(
          withMedia(
            withHistory(
              withReact(
                createEditor())))))), [])
  const [value, setValue] = useState<Descendant[]>(initialValue);

  console.log(value)
  return (
    <>
      <Tooltip id='format-tooltip' delayShow={1000} />
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(content) => setValue(content)}
      >
        <ToolBar>
          <Dropdown format="fontFamily" hint="Шрифт" options={fontFamilyOptions} />
          <Dropdown format="fontSize" hint="Кегль шрифту" options={fontSizeOptions} />
          <span className={groupBlocks}>
            <MarkButton format="bold" hint="Жирний" />
            <MarkButton format="italic" hint="Нахилений" />
            <MarkButton format="underline" hint="Підкреслений" />
            <MarkButton format="code" hint="Код" />
            <MarkButton format="strikethrough" hint="Перекреслений" />
            <MarkButton format="superscript" hint="Верхній індекс" />
            <MarkButton format="subscript" hint="Нижній індекс" />
          </span>
          <span className={groupBlocks}>
            <ColorPicker format="color" hint="Колір тексту" />
            <ColorPicker format="bgColor" hint="Колір тла" />
          </span>
          <span className={groupBlocks}>
            <BlockButton format="paragraph" hint="Параграф" />
            <HeadingSelect />
            <BlockButton format="block-quote" hint="Цитата" />
            <BlockButton format="numbered-list" hint="Нумерований" />
            <BlockButton format="bulleted-list" hint="Список" />
            <AlignSelect />
            <BlockButton format="code-block" hint="Блок коду" />
            <TableSelector hint="Таблиця" />
          </span>
          <span className={groupBlocks}>
            <LinkButton hint="Виділіть текст у пості і натисніть цю кнопку, щоб додати посилання" />
            <MediaButton format="image" hint="Вставити зображення" />
            <MediaButton format="youtube" hint="Вставити відео Youtube" />
          </span>
        </ToolBar>

        <SetNodeToDecorations />

        <EditableWithDecorate />
      </Slate>
    </>
  )
}

const groupBlocks = css`
              height: 100%;
              border: 1px solid var(--c-lightgrey);
              border-radius: 2px;
              display: flex;
              flex-direction: row;
              gap: 12px;
              padding: 4px;
            `
