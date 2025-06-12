"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DynamicGraphProps {
  data: any[]
}

export default function DynamicGraph({ data }: DynamicGraphProps) {
  const [keys, setKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [colors, setColors] = useState({})

  useEffect(() => {
    if (data && data.length > 0) {
      const dataKeys = Object.keys(data[0] || {}).filter((key) => key !== "name")
      setKeys(dataKeys)
      setSelectedKeys(dataKeys.slice(0, 2))
      const initialColors = {}
      dataKeys.forEach((key, index) => {
        initialColors[key] = `hsl(${(index * 360) / dataKeys.length}, 70%, 50%)`
      })
      setColors(initialColors)
    }
  }, [data])

  const handleKeyToggle = (key: string) => {
    setSelectedKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const handleColorChange = (key: string, color: string) => {
    setColors((prev) => ({ ...prev, [key]: color }))
  }

  if (!data || data.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-4">
        {keys.map((key) => (
          <div key={key} className="flex items-center">
            <input
              type="checkbox"
              id={key}
              checked={selectedKeys.includes(key)}
              onChange={() => handleKeyToggle(key)}
              className="mr-2"
            />
            <label htmlFor={key} className="mr-2 text-sm text-gray-700">
              {key}
            </label>
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded"
            />
          </div>
        ))}
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[key]}
                strokeWidth={1.5}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
