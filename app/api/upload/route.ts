import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = await file.arrayBuffer()
  let workbook

  try {
    workbook = XLSX.read(buffer, { type: 'array' })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ error: 'Invalid file format' }, { status: 400 })
  }

  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(worksheet)

  // Ensure the data has a 'name' column for the X-axis
  const processedData = data.map((row: any, index: number) => {
    if (!row.name) {
      row.name = `Row ${index + 1}`
    }
    return row
  })

  return NextResponse.json({ data: processedData })
}

