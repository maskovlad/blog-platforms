import { css } from "@emotion/css"
import TableContextMenu from "../Elements/Table/TableContextMenu"

export const ToolBar = ({ children }) => {
  return (
    <div className={css`
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      position: sticky;
      top: 0;
      margin: 1rem 0;
      background: white;
      padding: 0.5rem 2rem;
      border-top: 1px solid var(--c-lightgrey);
      border-bottom: 1px solid var(--c-lightgrey);
      z-index: 2;
      background: linear-gradient(45deg, var(--c-grey), var(--c-cyan),var(--c-grey));

      @media (max-width: 640px) {
        // padding: 0.2rem 1rem;
      }
  `}>
      <TableContextMenu />
      {children}
    </div>
  )
}