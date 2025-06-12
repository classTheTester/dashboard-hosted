import Link from 'next/link'
import { memo } from 'react'
import { BarChart, LineChart, PieChart, Activity, Grid, FilterIcon as Funnel } from 'lucide-react'

interface Graph {
  id: string
  name: string
  createdAt: string
  type: 'column' | 'bar' | 'line' | 'combo' | 'pie' | 'heatmap' | 'funnel'
}

const GraphCard = memo(function GraphCard({ graph }: { graph: Graph }) {
  const formatDate = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
    return `${diff} days ago`
  }

  const renderIcon = () => {
    switch (graph.type) {
      case 'column':
        return <BarChart className="w-12 h-12 rotate-90" />
      case 'bar':
        return <BarChart className="w-12 h-12" />
      case 'line':
        return <LineChart className="w-12 h-12" />
      case 'combo':
        return <Activity className="w-12 h-12" />
      case 'pie':
        return <PieChart className="w-12 h-12" />
      case 'heatmap':
        return <Grid className="w-12 h-12" />
      case 'funnel':
        return <Funnel className="w-12 h-12" />
      default:
        return <BarChart className="w-12 h-12" />
    }
  }

  return (
    <Link 
      href={`/graphs/${graph.id}`}
      className="block aspect-[4/3] bg-[#2C2C2C] rounded-xl overflow-hidden group hover:ring-2 hover:ring-[#0066FF] transition-all"
    >
      <div className="h-[75%] bg-[#1A1A1A] flex items-center justify-center">
        {renderIcon()}
      </div>
      <div className="h-[25%] p-4">
        <h3 className="text-white font-medium truncate">{graph.name}</h3>
        <p className="text-sm text-gray-400">{formatDate(graph.createdAt)}</p>
      </div>
    </Link>
  )
})

export default GraphCard

