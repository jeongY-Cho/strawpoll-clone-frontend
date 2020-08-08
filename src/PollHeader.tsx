import React from "react";

export const PollHeader: React.FC<{ prompt: string; createdAt: string }> = (
  props
) => {
  return (
    <div>
      <h3>{props.prompt}</h3>
      <div style={{ paddingBottom: 5 }}>
        Created: {new Date(props.createdAt).toLocaleString()}
      </div>
    </div>
  );
};
