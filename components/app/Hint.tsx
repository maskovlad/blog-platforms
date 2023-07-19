
import { css } from '@emotion/css';
import { Tooltip } from "react-tooltip";
// import "react-tooltip/dist/react-tooltip.css";

export const Hint = ({ text }: { text: string }) => {
  return (
    <>
      <Tooltip id="question" style={{fontSize:14}} />
      <sup
        className={css`
          background: #000;
          border-radius: 50%;
          font-size: 10px;
          cursor: pointer;
          padding: 2px 1px;
        `}
        data-tooltip-id="question"
        data-tooltip-content={text}
      >
        ❔
      </sup>
    </>
  );
};