"use client"

import { memo } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ComposedChart,
  FunnelChart,
  Funnel,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
  Label,
} from "recharts"

interface ChartData {
  name: string
  value: number
}

interface DynamicChartProps {
  data: ChartData[]
  type: "column" | "bar" | "line" | "combo" | "pie" | "heatmap" | "funnel"
  colors: {
    background: string
    border: string
  }
  xAxisName?: string
  yAxisName?: string
}

const DynamicChart = memo(function DynamicChart({
  data,
  type,
  colors,
  xAxisName = "X Axis",
  yAxisName = "Y Axis",
}: DynamicChartProps) {
  const baseColor = colors.background

  if (!data || data.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#1e1e2f] text-white">
        <p>No graph data available. Please upload a spreadsheet file.</p>
      </div>
    )
  }

  const chartMargin = { top: 20, right: 30, bottom: 65, left: 60 }

  const renderChart = () => {
    switch (type) {
      case "column":
        return (
          <BarChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              stroke="#ffffff"
              tick={{ fill: "#ffffff", fontSize: 12 }}
              tickLine={false}
              height={60}
            >
              <Label
                value={xAxisName}
                position="bottom"
                fill="#ffffff"
                dy={25}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </XAxis>
            <YAxis stroke="#ffffff" tick={{ fill: "#ffffff", fontSize: 12 }} tickLine={false}>
              <Label
                value={yAxisName}
                angle={-90}
                position="insideLeft"
                fill="#ffffff"
                dx={-50}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e2f",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                color: "#fff",
              }}
            />
            <Bar dataKey="value" fill={baseColor} radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#ffffff" />
            </Bar>
          </BarChart>
        )
      case "bar":
        return (
          <BarChart layout="vertical" data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
            <XAxis type="number" stroke="#FFFFFF" tick={{ fill: "#ffffff", fontSize: 12 }} tickLine={false} height={60}>
              <Label
                value={xAxisName}
                position="bottom"
                fill="#ffffff"
                dy={25}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </XAxis>
            <YAxis dataKey="name" type="category" stroke="#FFFFFF" width={120}>
              <Label
                value={yAxisName}
                angle={-90}
                position="insideLeft"
                fill="#ffffff"
                dx={-50}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </YAxis>
            <Tooltip contentStyle={{ backgroundColor: "#2C2C2C", border: "none" }} />
            <Bar dataKey="value" fill={baseColor} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="value" position="right" fill="#ffffff" />
            </Bar>
          </BarChart>
        )
      case "line":
        return (
          <LineChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              stroke="#ffffff"
              tick={{ fill: "#ffffff", fontSize: 12 }}
              tickLine={false}
              height={60}
            >
              <Label
                value={xAxisName}
                position="bottom"
                fill="#ffffff"
                dy={25}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </XAxis>
            <YAxis stroke="#ffffff" tick={{ fill: "#ffffff", fontSize: 12 }} tickLine={false}>
              <Label
                value={yAxisName}
                angle={-90}
                position="insideLeft"
                fill="#ffffff"
                dx={-50}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e2f",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={baseColor}
              strokeWidth={2}
              dot={{ r: 4, fill: baseColor }}
              activeDot={{ r: 6, fill: baseColor }}
            >
              <LabelList dataKey="value" position="top" fill="#ffffff" />
            </Line>
          </LineChart>
        )
      case "combo":
        return (
          <ComposedChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
            <XAxis
              dataKey="name"
              stroke="#FFFFFF"
              tick={{ fill: "#ffffff", fontSize: 12 }}
              tickLine={false}
              height={60}
            >
              <Label
                value={xAxisName}
                position="bottom"
                fill="#ffffff"
                dy={25}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </XAxis>
            <YAxis stroke="#FFFFFF" tick={{ fill: "#ffffff", fontSize: 12 }} tickLine={false}>
              <Label
                value={yAxisName}
                angle={-90}
                position="insideLeft"
                fill="#ffffff"
                dx={-50}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </YAxis>
            <Tooltip contentStyle={{ backgroundColor: "#2C2C2C", border: "none" }} />
            <Legend wrapperStyle={{ color: "#FFFFFF" }} />
            <Bar dataKey="value" fill={baseColor} radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#ffffff" />
            </Bar>
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.border}
              strokeWidth={2}
              dot={{ fill: colors.background, strokeWidth: 2 }}
            />
          </ComposedChart>
        )
      case "pie":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-white text-lg mb-4">{xAxisName}</h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  fill={baseColor}
                  stroke={colors.border}
                  strokeWidth={2}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={baseColor} opacity={1 - index * 0.2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e2f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#FFFFFF" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )
      case "heatmap":
        return (
          <BarChart data={data} layout="vertical" margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" />
            <XAxis type="number" stroke="#FFFFFF" tick={{ fill: "#ffffff", fontSize: 12 }} tickLine={false} height={60}>
              <Label
                value={xAxisName}
                position="bottom"
                fill="#ffffff"
                dy={25}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </XAxis>
            <YAxis dataKey="name" type="category" stroke="#FFFFFF" width={120}>
              <Label
                value={yAxisName}
                angle={-90}
                position="insideLeft"
                fill="#ffffff"
                dx={-50}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </YAxis>
            <Tooltip contentStyle={{ backgroundColor: "#2C2C2C", border: "none" }} />
            <Bar dataKey="value" fill={baseColor}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={baseColor}
                  opacity={0.2 + (0.8 * entry.value) / Math.max(...data.map((d) => d.value))}
                />
              ))}
              <LabelList dataKey="value" position="right" fill="#ffffff" />
            </Bar>
          </BarChart>
        )
      case "funnel":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h3 className="text-white text-lg mb-4">{xAxisName}</h3>
            <ResponsiveContainer width="100%" height="90%">
              <FunnelChart>
                <Tooltip contentStyle={{ backgroundColor: "#2C2C2C", border: "none" }} />
                <Funnel dataKey="value" data={data} isAnimationActive labelLine={true}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={baseColor} opacity={1 - index * 0.2} />
                  ))}
                  <LabelList position="right" fill="#ffffff" dataKey="name" />
                  <LabelList position="right" fill="#ffffff" dataKey="value" offset={40} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        )
      default:
        return (
          <LineChart data={data} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              stroke="#ffffff"
              tick={{ fill: "#ffffff", fontSize: 12 }}
              tickLine={false}
              height={60}
            >
              <Label
                value={xAxisName}
                position="bottom"
                fill="#ffffff"
                dy={25}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </XAxis>
            <YAxis stroke="#ffffff" tick={{ fill: "#ffffff", fontSize: 12 }} tickLine={false}>
              <Label
                value={yAxisName}
                angle={-90}
                position="insideLeft"
                fill="#ffffff"
                dx={-50}
                style={{ fontSize: 14, fill: "#ffffff" }}
              />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e2f",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={baseColor}
              strokeWidth={2}
              dot={{ r: 4, fill: baseColor }}
              activeDot={{ r: 6, fill: baseColor }}
            >
              <LabelList dataKey="value" position="top" fill="#ffffff" />
            </Line>
          </LineChart>
        )
    }
  }

  return (
    <div className="w-full h-full bg-[#1e1e2f] p-4 pb-8 rounded-xl flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
})

export default DynamicChart

