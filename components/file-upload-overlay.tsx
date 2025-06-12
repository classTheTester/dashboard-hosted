'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploadOverlayProps {
  onFileSelect: (file: File) => void
}

export function FileUploadOverlay({ onFileSelect }: FileUploadOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xlsx'))) {
      onFileSelect(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-[#1e1e2f] flex items-center justify-center transition-opacity ${
        isDragging ? 'bg-opacity-90' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center">
        <div className="text-6xl text-[#ffa500] mb-6">
          <Plus />
        </div>
        <input
          type="file"
          id="fileInput"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={handleFileInput}
        />
        <Button
          onClick={() => document.getElementById('fileInput')?.click()}
          className="bg-[#ffa500] hover:bg-[#ff8c00]"
        >
          Add File
        </Button>
      </div>
    </div>
  )
}
