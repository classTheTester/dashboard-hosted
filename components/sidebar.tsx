'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Download, Trash2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ChartTypeSelector } from './ChartTypeSelector'

interface ChartData {
  name: string
  value: number
}

interface Graph {
  id: string
  name: string
  data: ChartData[]
  type: 'column' | 'bar' | 'line' | 'combo' | 'pie' | 'heatmap' | 'funnel'
  colors: {
    background: string
    border: string
  }
  image?: {
    url: string
    position: { x: number; y: number }
  }
}

interface SidebarProps {
  graph: Graph
  updateGraph: (graph: Graph) => void
}

const Sidebar = memo(function Sidebar({ graph, updateGraph }: SidebarProps) {
  const [chartType, setChartType] = useState(graph?.type || 'line')
  const [backgroundColor, setBackgroundColor] = useState(graph?.colors?.background || '#36a2eb')
  const [borderColor, setBorderColor] = useState(graph?.colors?.border || '#36a2eb')

  useEffect(() => {
    if (graph) {
      setChartType(graph.type || 'line')
      setBackgroundColor(graph.colors?.background || '#36a2eb')
      setBorderColor(graph.colors?.border || '#36a2eb')
    }
  }, [graph])

  const handleUpdateGraph = useCallback((updates: Partial<Graph>) => {
    if (graph) {
      updateGraph({ ...graph, ...updates })
    }
  }, [graph, updateGraph])

  const handleDownloadPDF = useCallback(async () => {
    if (!graph) return;
    const chartElement = document.getElementById('chart-container')
    if (chartElement) {
      const canvas = await html2canvas(chartElement, {
        allowTaint: true,
        useCORS: true,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100)
      pdf.save(`${graph.name}.pdf`)
    }
  }, [graph])

  const handleDeleteGraph = useCallback(() => {
    if (!graph) return;
    const graphs = JSON.parse(localStorage.getItem('graphs') || '[]')
    const updatedGraphs = graphs.filter((g: Graph) => g.id !== graph.id)
    localStorage.setItem('graphs', JSON.stringify(updatedGraphs))
    window.location.href = '/'
  }, [graph])

  if (!graph) {
    return <div className="w-[300px] bg-[#2C2C2C] text-white p-6">No graph data available</div>;
  }

  return (
    <div className="w-[300px] bg-[#2C2C2C] text-white p-6 flex flex-col gap-6 overflow-y-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="chartType">Chart Type</Label>
          <ChartTypeSelector
            value={chartType}
            onChange={(value) => {
              setChartType(value)
              handleUpdateGraph({ type: value })
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => {
              const newColor = e.target.value
              setBackgroundColor(newColor)
              handleUpdateGraph({ colors: { ...graph.colors, background: newColor } })
            }}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="borderColor">Border Color</Label>
          <input
            type="color"
            id="borderColor"
            value={borderColor}
            onChange={(e) => {
              const newColor = e.target.value
              setBorderColor(newColor)
              handleUpdateGraph({ colors: { ...graph.colors, border: newColor } })
            }}
            className="w-full h-10 rounded-md cursor-pointer"
          />
        </div>

        <Button className="w-full bg-[#0066FF] hover:bg-[#0052CC]" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>

        <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleDeleteGraph}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Graph
        </Button>
      </div>
    </div>
  )
})

export { Sidebar }

