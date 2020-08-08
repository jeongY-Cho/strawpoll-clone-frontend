import React, { useState } from "react";
export const CopyLink: React.FC = (_props) => {
  const [copied, updateCopy] = useState(false);

  return (
    <div>
      Click to copy link to this poll:
      <div>
        <input
          type="text"
          value={window.location.href.replace("/r", "")}
          onClick={(e) => {
            // @ts-ignore
            e.target.select();
            document.execCommand("copy");
            updateCopy(true);
          }}
          readOnly
        />
      </div>
      {copied && <div className="text-info">Link copied!</div>}
    </div>
  );
};
