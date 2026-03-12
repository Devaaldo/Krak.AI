'use client'
import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

interface PredictResult {
  label:      string
  confidence: number
  gradcam:    string
}

export default function UploadMode() {
  const [preview,  setPreview]  = useState<string | null>(null)
  const [result,   setResult]   = useState<PredictResult | null>(null)
  const [loading,  setLoading]  = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setResult(null)
  }

  const handlePredict = async () => {
    if (!preview) return
    setLoading(true)
    const file     = (document.querySelector('input[type=file]') as HTMLInputElement).files![0]
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await axios.post<PredictResult>('http://localhost:8000/predict', formData)
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-6">

      {/* Upload area */}
      <label className="w-full max-w-md h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all">
        <span className="text-gray-400 text-sm mb-2">Click to upload image</span>
        <span className="text-gray-600 text-xs">JPG, PNG supported</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>

      {/* Preview */}
      {preview && (
        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400">Original</span>
            <img src={preview} className="w-48 h-48 object-cover rounded-lg" />
          </div>
          {result && (
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">Grad-CAM</span>
              <img src={`data:image/jpeg;base64,${result.gradcam}`} className="w-48 h-48 object-cover rounded-lg" />
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`px-6 py-4 rounded-xl text-center ${
          result.label === 'Positive' ? 'bg-red-900/40 border border-red-500' : 'bg-green-900/40 border border-green-500'
        }`}>
          <p className="text-2xl font-bold">{result.label === 'Positive' ? '⚠️ Crack Detected' : '✅ No Crack'}</p>
          <p className="text-gray-300 mt-1">Confidence: {result.confidence}%</p>
        </div>
      )}

      {/* Button */}
      {preview && (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-full font-medium transition-all"
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      )}

    </div>
  )
}