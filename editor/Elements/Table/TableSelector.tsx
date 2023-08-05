import React, { useEffect, useRef, useState } from "react";
import Icon from "../../ui/Icon";
import usePopup from "../../customHooks/usePopup";
import { BaseSelection, Transforms, Location } from "slate";
import { TableUtil } from "../../utils/table";

import { useSlate } from "slate-react";
import { css } from "@emotion/css";
import Button from "@/editor/Toolbar/buttons/Button";
import { isBlockActive } from "@/editor/utils/toggleBlock";

const TableSelector = ({ hint }) => {
  const editor = useSlate()
  const tableOptionsRef = useRef(null);
  const [selection, setSelection] = useState<BaseSelection>();
  const [showOptions, setShowOptions] = usePopup(tableOptionsRef);
  const [tableData, setTableData] = useState({
    row: 0,
    column: 0,
  });
  const [leftPosition, setLeftPosition] = useState(false)

  const [tableInput, setTableInput] = useState(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, (v, i) => ({
        bg: "lightGray",
        column: i,
      }))
    )
  );

  useEffect(() => {
    const newTable = Array.from({ length: 6 }, (obj, row) =>
      Array.from({ length: 6 }, (v, col) => ({
        bg:
          row + 1 <= tableData.row && col + 1 <= tableData.column
            ? "#f44336"
            : "lightgray",
        column: col,
      }))
    );
    setTableInput(newTable);
  }, [tableData]);

  useEffect(() => {
    if (!showOptions) {
      setTableData({
        row: 0,
        column: 0,
      });
    }
  }, [showOptions]);
  const table = new TableUtil(editor);

  const handleButtonClick = (e) => {
    // коригування позиції popup, коли він упирається в край вікна
    const buttonLeftCoord = e.target.getBoundingClientRect().left
    const documentWidth = document.documentElement.clientWidth
    if (buttonLeftCoord < (documentWidth - 200)) setLeftPosition(true); else setLeftPosition(false)

    setSelection(editor.selection);
    //@ts-ignore
    setShowOptions((prev) => !prev);
  };

  const handleInsert = () => {
    selection && Transforms.select(editor, selection as Location);
    setTableData({ row: -1, column: -1 });
    table.insertTable(tableData.row, tableData.column);
    //@ts-ignore
    setShowOptions(false);
  };

  // console.log({ leftPosition })
  return (
    <div
      ref={tableOptionsRef}
      className={css`
        display: inline;
        position: relative;
      `}
    >
      <Button
        className={css`
          ${showOptions ? "border: 1px solid lightgray;border-bottom: none;" : ""}
        `}
        onClick={handleButtonClick}
        active={isBlockActive(
          editor,
          "table"
        )}
        hint={hint}
      >
        <Icon icon="table" />
      </Button>

      {showOptions && (
        <div className={css`
          position: absolute;
          ${leftPosition ? "left: 0;" : "right: 0;"}
          background-color: var(--c-lightgrey);
          padding: 6px 10px;
          border: 1px solid var(--c-cyan);
          border-radius: 5px;
          height: fit-content;
          z-index: 1;
        `}>
          {
            <span style={{ fontSize: "0.85em" }}>
              <i>{`Таблиця ${tableData.row >= 1
                ? `${tableData.row} x ${tableData.column}`
                : ""
                }`}</i>
            </span>
          }

          <div className={css`
            display: grid;
            grid-template-columns: auto auto auto auto auto auto;
            gap: 3px;
          `}>
            {tableInput.map((grp, row) =>
              grp.map(({ column, bg }, col) => (
                <div
                  key={row + col}
                  onClick={() => handleInsert()}
                  onMouseOver={() =>
                    setTableData({ row: row + 1, column: column + 1 })
                  }
                  className={css`
                    width:17px;
                    height:17px;
                    border: 1px solid var(--c-cyan);
                    background-color: var(--c-green);
                  `}
                  style={{ border: `1px solid ${bg}` }}
                ></div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSelector;
