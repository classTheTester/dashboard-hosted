import React from 'react'
import { BarChart, LineChart, PieChart, Activity, Grid, FilterIcon as Funnel } from 'lucide-react'

type ChartType = 'column' | 'bar' | 'line' | 'combo' | 'pie' | 'heatmap' | 'funnel'

interface ChartTypeSelectorProps {
  value: ChartType
  onChange: (value: ChartType) => void
}

const chartTypes: { type: ChartType; icon: React.ReactNode }[] = [
  { type: 'column', icon: <BarChart className="rotate-90" /> },
  { type: 'bar', icon: <BarChart /> },
  { type: 'line', icon: <LineChart /> },
  { type: 'combo', icon: <Activity /> },
  { type: 'pie', icon: <PieChart /> },
  { type: 'heatmap', icon: <Grid /> },
  { type: 'funnel', icon: <Funnel /> },
]

export function ChartTypeSelector({ value, onChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chartTypes.map(({ type, icon }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`p-2 rounded-md transition-colors ${
            value === type
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title={type.charAt(0).toUpperCase() + type.slice(1)}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}

