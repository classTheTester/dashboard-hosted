'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

export default function FileUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      
      const existingGraphs = JSON.parse(localStorage.getItem('graphs') || '[]')
      
      const newGraph = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        data: result.data,
        createdAt: new Date().toISOString(),
        status: 'ready'
      }
      
      existingGraphs.push(newGraph)
      localStorage.setItem('graphs', JSON.stringify(existingGraphs))
      
      router.push('/graphs')
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <label 
        htmlFor="file-upload" 
        className={`
          flex flex-col items-center gap-4 p-8 
          border-2 border-dashed border-neutral-700 
          rounded-xl cursor-pointer
          hover:border-neutral-600 transition-colors
          ${isUploading ? 'opacity-50' : ''}
        `}
      >
        <Upload size={40} className="text-neutral-400" />
        <div className="text-center">
          <p className="text-lg font-medium">Upload a spreadsheet</p>
          <p className="text-sm text-neutral-400">Drag and drop or click to select</p>
        </div>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          accept=".xlsx, .xls, .csv, .ods, .tsv"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>
      {isUploading && (
        <div className="mt-4 text-neutral-400">Uploading...</div>
      )}
    </div>
  )
}

