import React, { useEffect, useRef, useState } from "react";
import Icon from "../../ui/Icon";
import usePopup from "../../customHooks/usePopup";
import { BaseSelection, Transforms, Location } from "slate";
import { TableUtil } from "../../utils/table";

import "./TableSelector.css";
import { useSlate } from "slate-react";
import { css } from "@emotion/css";

const TableSelector = ({ hint }) => {
  const editor = useSlate()
  const tableOptionsRef = useRef(null);
  const [selection, setSelection] = useState<BaseSelection>();
  const [showOptions, setShowOptions] = usePopup(tableOptionsRef);
  const [tableData, setTableData] = useState({
    row: 0,
    column: 0,
  });

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
            ? "orange"
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

  const handleButtonClick = () => {
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


  return (
    <div
      ref={tableOptionsRef}
      className={css`
        display: inline;
        position: relative;
      `}
    >
      <button
        style={{
          color: showOptions ? "black" : "lightgray",
        }}
        className={css`
          display: flex;
          align-items: center;
          background: transparent;
          cursor: pointer;
          border: 1px solid transparent;
          border-bottom: none;
          ${showOptions ? "border-color: lightgray;" : ""}
        `}
        title="Таблиця"
        onClick={handleButtonClick}
        data-tooltip-id="format-tooltip" data-tooltip-content={hint}
      >
        <Icon icon="table" />
      </button>

      {showOptions && (
        <div className={css`
          position: absolute;
          left: 0;
          background-color: white;
          padding: 6px 10px;
          border: 1px solid lightgray;
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
                    width:15px;
                    height:15px;
                    border: 1px solid lightgray;
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
