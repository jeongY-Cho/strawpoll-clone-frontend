import React from "react";
import Axios from "axios";
import { Route, RouteComponentProps } from "react-router-dom";
import { VoteForm, IVoteFormProps as IPoll } from "./VoteForm";
import { CopyLink } from "./CopyLink";
import { Results } from "./Results";
import { GotoPollInput } from "./GotoPollInput";
export const PieChart = require("react-minimal-pie-chart").PieChart;

export class Poll extends React.Component<RouteComponentProps<{ id: string }>> {
  state: { invalid: boolean; poll: IPoll; loaded: boolean } = {
    invalid: false,
    loaded: false,
    poll: {
      total: 0,
      createdAt: "",
      id: "",
      choices: [
        { text: "item 1", count: 100 },
        { text: "item 2", count: 0 },
      ],
      prompt: "this is a question",
    },
  };
  socket: WebSocket;

  constructor(props: RouteComponentProps<{ id: string }>) {
    super(props);
    this.socket = new WebSocket(
      `wss://strawpoll.jeongyeoncho.com/api/live/${this.props.match.params.id}`
    );
  }

  componentDidMount() {
    this.socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (message.data === "invalid id") {
        this.setState({
          invalid: true,
        });
        return;
      }
      let cc = [...this.state.poll.choices];
      Object.keys(data).forEach((item) => {
        if (item !== "total") {
          const i = parseInt(item.split(":")[1]);
          cc[i].count = data[item];
        }
      });
      this.setState({
        poll: {
          prompt: this.state.poll.prompt,
          createdAt: this.state.poll.createdAt,
          id: this.state.poll.id,
          total: data.total,
          choices: cc,
        },
      });
      let retry = false;
      this.socket.onclose = () => {
        if (!retry) {
          retry = true;
          this.socket = new WebSocket(
            `wss://strawpoll.jeongyeoncho.com/api/live/${this.props.match.params.id}`
          );
        } else {
          console.log("closed");
        }
      };
    };

    Axios.get(
      "https://strawpoll.jeongyeoncho.com/api/" + this.props.match.params.id
    ).then((res) => {
      if (!res.data.id) {
        this.setState({
          invalid: true,
        });
        return;
      }
      console.log(res.data);
      this.setState({
        poll: res.data,
        loaded: true,
      });
      console.log(res.data);
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }
  render() {
    if (this.state.invalid) {
      return (
        <div>
          <div>Invalid id</div>
          <GotoPollInput showButton />
          <div></div>
        </div>
      );
    }

    return (
      <div>
        <Route path={`${this.props.match.url}/r`}>
          <Results {...this.state.poll} />
        </Route>
        <Route path={this.props.match.url} exact>
          <VoteForm {...this.state.poll} />
          <CopyLink />
        </Route>
      </div>
    );
  }
}
