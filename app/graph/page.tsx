"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowLeft, Table, ImageIcon, Download, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { ImagePositionPresets } from "@/components/ImagePositionPresets"
import { DraggableImage } from "@/components/DraggableImage"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const DynamicChart = dynamic(() => import("../../components/dynamic-chart"), { ssr: false })
const Sidebar = dynamic(() => import("../../components/sidebar").then((mod) => mod.Sidebar), { ssr: false })

interface ChartData {
  name: string
  value: number
}

interface Graph {
  id: string
  name: string
  data: ChartData[]
  type: "column" | "bar" | "line" | "combo" | "pie" | "heatmap" | "funnel"
  colors: {
    background: string
    border: string
  }
  image?: {
    url: string
    position: { x: number; y: number }
    size: { width: number; height: number }
  }
  xAxis: string
  yAxis: string
}

function GraphEditorContent() {
  const [graph, setGraph] = useState<Graph | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [imageSize, setImageSize] = useState({ width: 300, height: 300 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState("")
  const [showOverwriteDialog, setShowOverwriteDialog] = useState(false)
  const [showDataTable, setShowDataTable] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchGraph = () => {
      if (!id) {
        router.push("/")
        return
      }
      
      if (typeof window === 'undefined') return
      
      const graphs = JSON.parse(localStorage.getItem("graphs") || "[]")
      const currentGraph = graphs.find((g: Graph) => g.id === id)
      if (currentGraph) {
        setGraph({
          ...currentGraph,
          xAxis: currentGraph.xAxis || "Data Points",
          yAxis: currentGraph.yAxis || "Values",
        })
        setNewName(currentGraph.name)
        if (currentGraph.image) {
          setImagePosition(currentGraph.image.position || { x: 0, y: 0 })
          setImageSize(currentGraph.image.size || { width: 300, height: 300 })
        } else {
          setImagePosition({ x: 0, y: 0 })
          setImageSize({ width: 300, height: 300 })
        }
      } else {
        router.push("/")
      }
      setIsLoading(false)
    }

    fetchGraph()
  }, [id, router])

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateContainerSize()
    window.addEventListener("resize", updateContainerSize)

    return () => {
      window.removeEventListener("resize", updateContainerSize)
    }
  }, [])

  const updateGraph = useCallback((updatedGraph: Partial<Graph>) => {
    setGraph((prevGraph) => {
      if (!prevGraph) return null
      const newGraph = { ...prevGraph, ...updatedGraph }
      if (typeof window !== 'undefined') {
        const graphs = JSON.parse(localStorage.getItem("graphs") || "[]")
        const updatedGraphs = graphs.map((g: Graph) => (g.id === newGraph.id ? newGraph : g))
        localStorage.setItem("graphs", JSON.stringify(updatedGraphs))
      }
      return newGraph
    })
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && containerRef.current) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        const containerRect = containerRef.current!.getBoundingClientRect()
        const centerPosition = {
          x: (containerRect.width - 300) / 2,
          y: (containerRect.height - 300) / 2,
        }
        updateGraph({
          image: {
            url: imageUrl,
            position: centerPosition,
            size: { width: 300, height: 300 },
          },
        })
        setImagePosition(centerPosition)
        setImageSize({ width: 300, height: 300 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragEnd = (newPosition: { x: number; y: number }) => {
    setImagePosition(newPosition)
    if (graph && graph.image) {
      updateGraph({
        image: {
          ...graph.image,
          position: newPosition,
        },
      })
    }
  }

  const handleResize = (newSize: { width: number; height: number }) => {
    setImageSize(newSize)
    if (graph && graph.image) {
      updateGraph({
        image: {
          ...graph.image,
          size: newSize,
        },
      })
    }
  }

  const handlePositionSelect = (position: string) => {
    if (containerRef.current && graph?.image) {
      const containerRect = containerRef.current.getBoundingClientRect()
      let newPosition = { x: 0, y: 0 }

      switch (position) {
        case "top-left":
          newPosition = { x: 10, y: 10 }
          break
        case "top-center":
          newPosition = { x: (containerRect.width - imageSize.width) / 2, y: 10 }
          break
        case "top-right":
          newPosition = { x: containerRect.width - imageSize.width - 10, y: 10 }
          break
        case "center":
          newPosition = {
            x: (containerRect.width - imageSize.width) / 2,
            y: (containerRect.height - imageSize.height) / 2,
          }
          break
        case "bottom-left":
          newPosition = { x: 10, y: containerRect.height - imageSize.height - 10 }
          break
        case "bottom-center":
          newPosition = {
            x: (containerRect.width - imageSize.width) / 2,
            y: containerRect.height - imageSize.height - 10,
          }
          break
        case "bottom-right":
          newPosition = {
            x: containerRect.width - imageSize.width - 10,
            y: containerRect.height - imageSize.height - 10,
          }
          break
      }

      setImagePosition(newPosition)
      updateGraph({
        image: {
          ...graph.image,
          position: newPosition,
        },
      })
    }
  }

  const handleDownloadPDF = useCallback(async () => {
    if (containerRef.current) {
      const presetButtons = containerRef.current.querySelector(".preset-buttons")
      if (presetButtons) presetButtons.classList.add("hidden")

      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      })

      if (presetButtons) presetButtons.classList.remove("hidden")

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      })
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
      pdf.save(`${graph?.name || "graph"}.pdf`)
    }
  }, [graph?.name])

  const handleNameChange = () => {
    if (newName && newName !== graph?.name) {
      if (typeof window !== 'undefined') {
        const graphs = JSON.parse(localStorage.getItem("graphs") || "[]")
        const existingGraph = graphs.find((g: Graph) => g.name === newName && g.id !== graph?.id)

        if (existingGraph) {
          setShowOverwriteDialog(true)
        } else {
          updateGraph({ name: newName })
          setIsEditingName(false)
        }
      }
    } else {
      setIsEditingName(false)
    }
  }

  const handleOverwrite = () => {
    if (typeof window !== 'undefined') {
      const graphs = JSON.parse(localStorage.getItem("graphs") || "[]")
      const updatedGraphs = graphs.filter((g: Graph) => g.name !== newName || g.id === graph?.id)
      updateGraph({ name: newName })
      localStorage.setItem("graphs", JSON.stringify(updatedGraphs))
    }
    setShowOverwriteDialog(false)
    setIsEditingName(false)
  }

  const memoizedDynamicChart = useMemo(() => {
    if (!graph) return null
    return (
      <DynamicChart
        data={graph.data}
        type={graph.type}
        colors={graph.colors}
        xAxisName={graph.xAxis}
        yAxisName={graph.yAxis}
      />
    )
  }, [graph])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-[#1A1A1A] text-white">Loading...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#1e1e2f]">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center px-8 py-4 bg-[#2C2C2C] w-full">
          <Link href="/" className="inline-flex items-center text-white hover:text-gray-300">
            <ArrowLeft className="mr-2" size={20} />
            Back to Graphs
          </Link>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]"
              onClick={() => setShowDataTable(!showDataTable)}
            >
              <Table className="mr-2 h-4 w-4" />
              {showDataTable ? 'Hide' : 'Show'} Data Table
            </Button>
            <Button
              variant="outline"
              className="bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Image
            </Button>
            <Button
              variant="outline"
              className="bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]"
              onClick={handleDownloadPDF}
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              aria-label="Upload image"
            />
          </div>
        </div>
        <div className="flex-1 relative overflow-hidden px-8 py-4">
          <div className="flex items-center mb-4">
            {isEditingName ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleNameChange}
                onKeyPress={(e) => e.key === "Enter" && handleNameChange()}
                className="text-2xl font-semibold text-white"
              />
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-white mr-2">{graph?.name || "Loading..."}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingName(true)}
                  className="text-white hover:bg-[#3C3C3C]"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {showDataTable ? (
            <div className="bg-[#2C2C2C] rounded-xl p-6 h-full overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Data Table</h2>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2">{graph?.xAxis || 'X Axis'}</th>
                    <th className="text-left p-2">{graph?.yAxis || 'Y Axis'}</th>
                  </tr>
                </thead>
                <tbody>
                  {graph?.data.map((point, index) => (
                    <tr key={index}>
                      <td className="p-2">{point.name}</td>
                      <td className="p-2">{point.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              ref={containerRef}
              className="w-full h-full bg-[#1e1e2f] rounded-xl relative overflow-hidden flex items-center justify-center"
            >
              {graph?.image && (
                <div className="absolute top-4 left-4 z-20 preset-buttons">
                  <ImagePositionPresets onPositionSelect={handlePositionSelect} />
                </div>
              )}
              {memoizedDynamicChart}
              {graph?.image && (
                <DraggableImage
                  url={graph.image.url}
                  position={imagePosition}
                  size={imageSize}
                  onDragEnd={handleDragEnd}
                  onResize={handleResize}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {graph && Object.keys(graph).length > 0 && <Sidebar graph={graph} updateGraph={updateGraph} />}
      <Dialog open={showOverwriteDialog} onOpenChange={setShowOverwriteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Overwrite Existing Graph?</DialogTitle>
            <DialogDescription>
              A graph with the name "{newName}" already exists. Do you want to overwrite it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOverwriteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleOverwrite}>Overwrite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function GraphEditor() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-[#1A1A1A] text-white">Loading...</div>}>
      <GraphEditorContent />
    </Suspense>
  )
}