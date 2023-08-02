import { css } from "@emotion/css";
import { useSlate } from "slate-react";
import { activeMark, addMarkData } from "../../utils/toggleMark";


export const Dropdown = ({ format, options, hint }) => {
  const editor = useSlate();

  const changeMarkData = (event, format) => {
    event.preventDefault();
    const value = event.target.value;
    addMarkData(editor, { format, value });
  }

  return (
    <select
      className={css`
        font-size: 14px;
        padding: 3px;
        border-radius: 5px;
        width: 7rem;
        border: none;
        cursor: pointer;
      `}
      value={activeMark(editor, format)}
      onChange={(e) => changeMarkData(e, format)}
      data-tooltip-id="format-tooltip" data-tooltip-content={hint}
    >
      {options.map((item, index) => (
        <option key={index} value={item.value}>
          {item.text}
        </option>
      ))}
    </select>
  );
};

