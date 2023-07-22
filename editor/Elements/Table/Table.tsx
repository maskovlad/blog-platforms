import { css } from "@emotion/css";

const Table = ({ attributes, children }) => {
  return (
    <table className="post-table">
      <tbody {...attributes}>{children}</tbody>
    </table>
  );
};

export default Table;
