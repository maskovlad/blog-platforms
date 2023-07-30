import { Editor, Transforms, Path, Range, Element } from "slate";

export const createLinkNode = (url, showInNewTab, text) => ({
  type: "link",
  url,
  target: showInNewTab ? "_blank" : "_self",
  children: [{ text }],
});

export const insertLink = (editor, { url, showInNewTab }) => {
  if (!url) return;

  const { selection } = editor;

  const link = createLinkNode(url, showInNewTab, "Посилання");
  
  if (!!selection) {
    const [parent, parentPath] = Editor.parent(editor, selection.focus.path);
    // якщо вибраний лінк, видаляємо його
    if (parent.type === "link") {
      removeLink(editor);
    }

    // якщо вибраний void-елемент (image, youtube etc.) вставляємо за ним paragraph з лінком у children
    if (editor.isVoid(parent)) {
      Transforms.insertNodes(
        editor,
        { type: "paragraph", children: [link] },
        {
          at: Path.next(parentPath),
          select: true,
        }
      );
    } else if (Range.isCollapsed(selection)) { // якщо нічого не вибрано
      Transforms.insertNodes(editor, link, { select: true }); 
    } else {
      Transforms.wrapNodes(editor, link, { split: true });
    }

  } else {
    Transforms.insertNodes(editor, { type: "paragraph", children: [link] })
  }
};

/**
 * видалення лінку з тексту
 * @param {} editor : Editor
 */
export const removeLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
  });
};
