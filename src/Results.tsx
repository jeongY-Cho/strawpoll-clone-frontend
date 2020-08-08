import React, { useState } from "react";
import { IVoteFormProps as IPoll } from "./VoteForm";
import { PieChart } from "./Poll";
import { CopyLink } from "./CopyLink";
import chroma from "chroma-js";
import { PollHeader } from "./PollHeader";

const colors = chroma.scale([
  "#264653",
  "#2A9D8F",
  "#E9C46A",
  "#F4A261",
  "#E76F51",
]);

export const Results: React.FC<IPoll> = (props) => {
  const selectedColors = colors.colors(props.choices.length);

  const maxCount = props.choices.reduce((acc, cur) => {
    return acc > cur.count ? acc : cur.count;
  }, 0);
  return (
    <div>
      <PollHeader prompt={props.prompt} createdAt={props.createdAt} />
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        <div style={{ marginRight: 20, maxWidth: "80%", minWidth: 200 }}>
          <table style={{ width: "100%" }}>
            <colgroup>
              <col
                style={{ width: "2rem", backgroundColor: "rgba(0,0,0,0.1)" }}
              />
              <col
                style={{ width: "3rem", backgroundColor: "rgba(0,0,0,0.1)" }}
              />
            </colgroup>
            <tbody>
              {props.choices.map((item, i) => {
                const percent = `${Math.round(
                  (item.count / props.total) * 100
                )}%`;
                return (
                  <React.Fragment key={i}>
                    <tr>
                      <td>{percent}</td>
                      <td>{item.count}</td>
                      <td
                        style={{
                          textAlign: "left",
                          overflowWrap: "anywhere",
                          paddingLeft: 10,
                        }}
                      >
                        {item.text}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3}>
                        <div
                          style={{
                            backgroundColor:
                              maxCount === item.count
                                ? selectedColors[i % selectedColors.length]
                                : "rgba(0,0,0,0.1)",
                            width: item.count ? percent : "1%",
                            height: 10,
                          }}
                        ></div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div>{props.total} Votes</div>
          <br />
          <CopyLink />
        </div>
        <div style={{ minWidth: 200, padding: 20 }}>
          <PieChartDiv
            choices={props.choices}
            total={props.total}
            colors={selectedColors}
          />
        </div>
      </div>
    </div>
  );
};

const PieChartDiv: React.FC<{
  choices: { text: string; count: number }[];
  total: number;
  colors: string[];
}> = (props) => {
  const [hovered, setHovered] = useState<number | undefined>(undefined);

  return (
    <PieChart
      animate={true}
      label={(labelRenderProps: any) => {
        return labelRenderProps.dataEntry.label === "0%"
          ? ""
          : labelRenderProps.dataEntry.label;
      }}
      labelStyle={{ fill: "beige", opacity: 0.95, fontSize: 10 }}
      data={props.choices.map((item, i) => {
        const percent = `${Math.round((item.count * 100) / props.total)}%`;
        return {
          label: i === hovered ? item.count : percent,
          title: item.text,
          value: item.count,
          color: props.colors[i % props.colors.length],
          percentage: percent,
        };
      })}
      startAngle={180}
      onMouseOver={(_: any, i: number) => {
        setHovered(i);
      }}
      onMouseOut={() => {
        setHovered(undefined);
      }}
    />
  );
};
