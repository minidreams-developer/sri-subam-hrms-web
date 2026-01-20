import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import theme from "../../theme/theme";

const data = [
  { name: "Jan", value: 800 },
  { name: "Feb", value: 1600 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 1000 },
  { name: "May", value: 1800 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 200 },
  { name: "Aug", value: 0 },
  { name: "Sep", value: 0 },
  { name: "Oct", value: 0 },
  { name: "Nov", value: 0 },
  { name: "Dec", value: 0 },
];

const Chart = () => {
  return (
    <ResponsiveContainer width="100%" height={392}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} horizontal={true} stroke="#E7E7E7" />
        <XAxis
          dataKey="name"
          tick={{
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fill: `${theme.colors.textColor}`,
          }}
        />
        <YAxis
          tick={{
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fill: `${theme.colors.textColor}`,
          }}
        />
        <Tooltip cursor={{ fill: "transparent" }} />

        <Bar
          dataKey="value"
          shape={(props) => {
            const { x, y, width, height, index } = props;
            const fillColor = index === 4 ? "#1a2e05" : "#c4c4c4";
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fillColor}
                rx={2}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
