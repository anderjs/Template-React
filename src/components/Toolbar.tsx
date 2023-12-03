import React from "react";

const Toolbar: React.FC = () => {
  return (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic">Italic Text</button>
      <button className="ql-underline">Underlined Text</button>
      <button className="ql-strike">Strikethrough Text</button>
      <button className="ql-script">Subscript</button>
      <button className="ql-script">Superscript</button>
      <button className="ql-link">Link</button>
      {/* Size */}
      <span className="ql-size">Small</span>
      <span className="ql-size">Large Text</span>
      <span className="ql-size">Huge Text</span>
    </span>
  );
};

export default Toolbar;
