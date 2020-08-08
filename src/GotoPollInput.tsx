import React from "react";
import { useHistory } from "react-router-dom";
export const GotoPollInput: React.FC<{ showButton?: boolean }> = ({
  showButton,
}) => {
  const [id, updateId] = React.useState("");
  const history = useHistory();

  const submit = () => {
    window.location.href = `/${id}`;
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Go to a Poll"
        style={{ background: "rgba(0,0,0,0)" }}
        value={id}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("enter");
            submit();
          }
        }}
        onChange={(e) => {
          updateId(e.target.value);
        }}
      />
      {showButton && (
        <button className="btn btn-primary" onClick={submit}>
          Go
        </button>
      )}
    </div>
  );
};
