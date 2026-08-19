import fs from 'fs'
import path from 'path'

export async function saveUploadedFile(file: File | Blob, subfolder: 'images' | 'audio'): Promise<string> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', subfolder)
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    const extension = subfolder === 'images' ? 'jpg' : 'webm'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`
    const filePath = path.join(uploadsDir, fileName)

    fs.writeFileSync(filePath, buffer)
    return `/uploads/${subfolder}/${fileName}`
  } catch (err) {
    console.warn('saveUploadedFile: Falling back to Data URL due to filesystem permission', err)
    // Data URL fallback for read-only environments
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mime = subfolder === 'images' ? 'image/jpeg' : 'audio/webm'
    return `data:${mime};base64,${base64}`
  }
}
