import Button from "./Button";
import {Icon} from "../../ui/ui"
import { Transforms } from "slate";
import { css } from "@emotion/css";
import { Element as SlateElement, Editor } from "slate";
import { LinkElement } from "@/types/editor";
import { Range } from "slate";
import { useSlate } from "slate-react";

const LinkButton = (props) => {
  const editor = useSlate()

  const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, {
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
    return !!link
  }

  const insertLink = (editor, url) => {
    if (editor.selection) {
      wrapLink(editor, url)
    }
  }

  const wrapLink = (editor, url: string) => {
    if (isLinkActive(editor)) {
      unwrapLink(editor)
    }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link: LinkElement = {
      type: 'link',
      url,
      children: isCollapsed ? [{ text: url }] : [],
    }

    if (isCollapsed) {
      Transforms.insertNodes(editor, link)
    } else {
      Transforms.wrapNodes(editor, link, { split: true })
      Transforms.collapse(editor, { edge: 'end' })
    }
  }

  const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
  }





  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={event => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the link:')
        if (!url) return
        insertLink(editor, url)
      }}
    >
      <Icon>link</Icon>
    </Button>
  );
};

export default LinkButton;
