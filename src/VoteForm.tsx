import React, { useState } from "react";
import Axios from "axios";
import { useHistory, useRouteMatch } from "react-router-dom";
import { PollHeader } from "./PollHeader";

export interface IVoteFormProps {
  id: string;
  createdAt: string;
  total: number;
  prompt: string;
  choices: {
    text: string;
    count: number;
  }[];
}
export const VoteForm: React.FC<IVoteFormProps> = (props) => {
  const [selected, changeSelected] = useState("");
  console.log(props);
  const history = useHistory();
  const { url } = useRouteMatch();
  return (
    <div style={{ textAlign: "left", margin: 50, paddingLeft: "20%" }}>
      <PollHeader createdAt={props.createdAt} prompt={props.prompt} />
      {props.choices.map((item, i) => {
        const name = "choice:" + i;
        return (
          <div className="custom-control custom-radio" key={i}>
            <input
              type="radio"
              id={name}
              name="choices"
              value={name}
              className="custom-control-input"
              checked={selected === name}
              onChange={() => {
                changeSelected(name);
              }}
            />
            <label htmlFor={name} className="custom-control-label">
              {item.text}
            </label>
          </div>
        );
      })}
      <br />
      <div className="btn-group">
        <button
          className="btn btn-primary btn-sm"
          onClick={(_e) => {
            Axios.post(`https://strawpoll.jeongyeoncho.com/api/${props.id}`, {
              inc: selected.split(":")[1],
            }).then(() => {
              history.push(`${url}/r`);
            });
          }}
        >
          Vote
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => history.push(`${url}/r`)}
        >
          Results
        </button>
      </div>
    </div>
  );
};
