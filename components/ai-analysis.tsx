'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Graph {
  id: string
  name: string
  data: Array<{ name: string; value: number }>
  type: string
  colors: {
    background: string
    border: string
  }
}

interface AIAnalysisProps {
  graph: Graph
  updateGraph: (graph: Graph) => void
}

export function AIAnalysis({ graph, updateGraph }: AIAnalysisProps) {
  const [prompt, setPrompt] = useState('')
  const [analysis, setAnalysis] = useState('')

  const handleAnalyze = async () => {
    // In a real application, you would send the prompt and graph data to an AI service
    // For this example, we'll simulate an AI response
    const simulatedAIResponse = `Analysis of ${graph.name}:
    1. The graph shows a ${graph.type} chart.
    2. The data contains ${graph.data.length} points.
    3. The highest value is ${Math.max(...graph.data.map(d => d.value))}.
    4. The lowest value is ${Math.min(...graph.data.map(d => d.value))}.
    5. Suggested color scheme: Use a light blue (#87CEEB) for background and a dark blue (#4682B4) for borders.`

    setAnalysis(simulatedAIResponse)

    // Simulate AI-suggested changes
    const updatedGraph = {
      ...graph,
      colors: {
        background: '#87CEEB',
        border: '#4682B4'
      }
    }
    updateGraph(updatedGraph)
  }

  return (
    <div className="mt-6 bg-[#2C2C2C] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">AI Analysis</h2>
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Ask AI to analyze or modify the graph..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAnalyze}>Analyze</Button>
      </div>
      {analysis && (
        <div className="bg-[#1e1e2f] p-4 rounded-md">
          <pre className="text-white whitespace-pre-wrap">{analysis}</pre>
        </div>
      )}
    </div>
  )
}
