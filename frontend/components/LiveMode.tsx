'use client'
import { useEffect, useRef, useState } from 'react'

interface PredictResult {
  label:      string
  confidence: number
  gradcam:    string
}

export default function LiveMode() {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wsRef      = useRef<WebSocket | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [result,  setResult]  = useState<PredictResult | null>(null)
  const [active,  setActive]  = useState(false)

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    if (videoRef.current) videoRef.current.srcObject = stream

    wsRef.current = new WebSocket('ws://localhost:8000/ws')

    wsRef.current.onmessage = (e) => {
      setResult(JSON.parse(e.data))
    }

    // Kirim frame setiap 500ms
    intervalRef.current = setInterval(() => {
      const canvas  = canvasRef.current
      const video   = videoRef.current
      if (!canvas || !video || wsRef.current?.readyState !== WebSocket.OPEN) return

      canvas.getContext('2d')!.drawImage(video, 0, 0, 128, 128)
      canvas.toBlob((blob) => {
        if (blob) wsRef.current!.send(blob)
      }, 'image/jpeg')
    }, 500)

    setActive(true)
  }

  const stopCamera = () => {
    clearInterval(intervalRef.current!)
    wsRef.current?.close()
    const stream = videoRef.current?.srcObject as MediaStream
    stream?.getTracks().forEach(t => t.stop())
    if (videoRef.current) videoRef.current.srcObject = null
    setResult(null)
    setActive(false)
  }

  // Cleanup saat komponen unmount
  useEffect(() => () => stopCamera(), [])

  return (
    <div className="flex flex-col items-center gap-6">

      <div className="flex gap-6">
        {/* Webcam feed */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400">Camera</span>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-64 h-64 object-cover rounded-xl bg-gray-800"
          />
        </div>

        {/* Grad-CAM overlay */}
        {result && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400">Grad-CAM</span>
            <img
              src={`data:image/jpeg;base64,${result.gradcam}`}
              className="w-64 h-64 object-cover rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Hidden canvas untuk capture frame */}
      <canvas ref={canvasRef} width={128} height={128} className="hidden" />

      {/* Result */}
      {result && (
        <div className={`px-6 py-4 rounded-xl text-center ${
          result.label === 'Positive'
            ? 'bg-red-900/40 border border-red-500'
            : 'bg-green-900/40 border border-green-500'
        }`}>
          <p className="text-2xl font-bold">
            {result.label === 'Positive' ? '⚠️ Crack Detected' : '✅ No Crack'}
          </p>
          <p className="text-gray-300 mt-1">Confidence: {result.confidence}%</p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={active ? stopCamera : startCamera}
        className={`px-8 py-3 rounded-full font-medium transition-all ${
          active
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {active ? 'Stop Camera' : 'Start Camera'}
      </button>

    </div>
  )
}