import React, { useState } from "react";
import useContextMenu from "../../customHooks/useContextMenu";
import Icon from "../../ui/Icon";
import { TableUtil } from "../../utils/table.js";
import { Location, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { css } from "@emotion/css";

const TableContextMenu = () => {
  const editor = useSlate()
  const [selection, setSelection] = useState<Location>([]);
  //@ts-ignore
  const [showMenu, { top, left }] = useContextMenu(
    editor,
    "table",
    setSelection
  );
  const table = new TableUtil(editor);

  const menu = [
    {
      icon: "insertColumnRight",
      text: "Додати стовпчик зправа",
      action: {
        type: "insertColumn",
        position: "after",
      },
    },
    {
      icon: "insertColumnLeft",
      text: "Додати стовпчик зліва",
      action: {
        type: "insertColumn",
        position: "at",
      },
    },
    {
      icon: "insertRowAbove",
      text: "Додати рядок зверху",
      action: {
        type: "insertRow",
        position: "at",
      },
    },
    {
      icon: "insertRowBelow",
      text: "Додати рядок знизу",
      action: {
        type: "insertRow",
        position: "after",
      },
    },
    {
      icon: "trashCan",
      text: "Видалити таблицю",
      action: {
        type: "remove",
      },
    },
  ];

  const handleInsert = ({ type, position }) => {
    Transforms.select(editor, selection);
    switch (type) {
      case "insertRow":
        table.insertRow(position);
        break;
      case "insertColumn":
        table.insertColumn(position);
        break;
      case "remove":
        table.removeTable();
        break;
      default:
        return;
    }
    ReactEditor.focus(editor);
  };

  return (
    showMenu ? (
      <div className={css`
          width: fit-content;
          height: fit-content;
          position: fixed;
          background: var(--c-lightgrey);
          border: 1px solid lightgray;
          border-radius: 10px;
          padding: 0.5%;
          display: flex;
          gap: 15px;
          flex-direction: column;
          cursor: pointer;
        `}
        style={{ top, left }}
      >
        {menu.map(({ icon, text, action }, index) => (
          <div className={css`
              display: flex;
              gap:15px;
            `}
            key={index}
            onClick={() => handleInsert(action as any)}
          >
            <Icon icon={icon} />
            <span>{text}</span>
          </div>
        ))}
      </div>
    ) : null
  );
};

export default TableContextMenu;
