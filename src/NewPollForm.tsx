import React from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
export const NewPollForm: React.FC = (_props) => {
  const history = useHistory();
  const [prompt, updatePrompt] = React.useState("");
  const [choices, updateChoices] = React.useState(["", ""]);
  const [customId, updateId] = React.useState("");

  const submit = () => {
    const filteredChoices = choices.filter((val) => val);
    if (prompt && filteredChoices.length) {
      const newPoll = {
        prompt,
        choices: filteredChoices,
        id: customId.length
          ? customId.trim().replace(/ /g, "-").replace(/-$/, "")
          : undefined,
      };
      console.log(newPoll);
      Axios.put("https://strawpoll.jeongyeoncho.com/api/new", newPoll).then(
        (res) => {
          history.push(`/${res.data.id}`);
        }
      );
    }
  };

  const choicesInput = choices.map((_value, i) => {
    return (
      <div key={i}>
        <input
          type="text"
          placeholder="Enter poll option"
          data-i={i}
          value={choices[i]}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit();
            } else if (e.key === "Tab") {
              if (
                // @ts-ignore
                e.target.value &&
                // @ts-ignore
                parseInt(e.target.dataset.i) === choices.length - 1
              ) {
                updateChoices(choices.concat([""]));
              }
            }
          }}
          onChange={(e) => {
            e.preventDefault();
            e.persist();
            choices[i] = e.target.value;
            let cc = [...choices];
            cc[i] = e.target.value;
            updateChoices(cc);
          }}
          onBlur={(e) => {
            // @ts-ignore
            const i = parseInt(e.target.dataset.i);
            if (
              !e.target.value &&
              choices.length > 2 &&
              i !== choices.length - 1
            ) {
              let cc = [...choices];
              // @ts-ignore
              cc.splice(parseInt(e.target.dataset.i), 1);
              updateChoices(cc);
            }
          }}
        />
      </div>
    );
  });

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => {
          updatePrompt(e.target.value);
        }}
        placeholder={"Type your question here"}
        style={{ fontSize: 25 }}
      />
      {choicesInput}
      <div style={{ padding: 10 }}>
        <button
          className="btn btn-outline-success btn-small"
          onClick={() => {
            if (choices[choices.length - 1]) {
              updateChoices(choices.concat([""]));
            }
          }}
        >
          +
        </button>
      </div>
      <button className="btn btn-outline-primary btn-large" onClick={submit}>
        Make New Poll
      </button>
      <div>
        <input
          maxLength={128}
          type="text"
          placeholder="custom poll ID (optional)"
          value={customId}
          onChange={(e) => {
            updateId(
              e.target.value
                .replace(/ /g, "-")
                .replace(/-+/g, "-")
                .replace(/[^a-zA-Z0-9-_]/gi, "")
                .toLowerCase()
            );
          }}
        />
      </div>
    </div>
  );
};
