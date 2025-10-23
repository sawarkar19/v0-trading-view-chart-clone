"use client"

import { useEffect, useRef, useState } from "react"
import { generateMockData } from "@/lib/chart-data"

interface BottomControlsProps {
  timeframe: string
  onTimeframeChange: (tf: string) => void
  showVolume: boolean
  onVolumeToggle: (show: boolean) => void
}

const timeframes = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"]

export function BottomControls({ timeframe, onTimeframeChange, showVolume, onVolumeToggle }: BottomControlsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setData(generateMockData(100))
  }, [])

  // Update time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Draw volume chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !showVolume || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = 40

    // Background
    ctx.fillStyle = "#131722"
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = "#1e222d"
    ctx.lineWidth = 1
    const spacing = 12
    for (let i = 0; i < width; i += spacing) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height - 20)
      ctx.stroke()
    }

    // Find max volume
    const maxVolume = Math.max(...data.map((d) => d.volume))
    const chartHeight = height - 20

    // Draw volume bars
    const startIdx = Math.max(0, data.length - Math.floor((width - padding) / spacing))
    data.slice(startIdx).forEach((candle, idx) => {
      const x = padding + idx * spacing
      const barHeight = (candle.volume / maxVolume) * chartHeight
      const y = chartHeight - barHeight

      const isGreen = candle.close >= candle.open
      ctx.fillStyle = isGreen ? "rgba(38, 166, 154, 0.3)" : "rgba(242, 54, 69, 0.3)"
      ctx.fillRect(x, y, 8, barHeight)
    })

    // Y-axis labels
    ctx.fillStyle = "#787f8f"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 3; i++) {
      const volume = (maxVolume / 3) * i
      const y = chartHeight - (chartHeight / 3) * i
      ctx.fillText((volume / 1000000).toFixed(0) + "M", padding - 5, y + 3)
    }

    // X-axis label
    ctx.fillStyle = "#787f8f"
    ctx.textAlign = "center"
    ctx.fillText("Volume", width / 2, height - 2)
  }, [data, showVolume])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <div className="flex flex-col bg-[#1e222d] border-t border-[#2d3139]">
      {/* Volume Chart */}
      {showVolume && (
        <div className="h-16 border-b border-[#2d3139]">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      )}

      {/* Time Controls */}
      <div className="h-12 flex items-center px-4 gap-4">
        {/* Timeframe buttons */}
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                timeframe === tf ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-[#2d3139] hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Time display */}
        <div className="text-xs text-gray-400 font-mono">{formatTime(currentTime)} UTC</div>

        {/* Volume toggle */}
        <button
          onClick={() => onVolumeToggle(!showVolume)}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            showVolume ? "bg-[#2962ff] text-white" : "text-gray-400 hover:bg-[#2d3139] hover:text-white"
          }`}
        >
          Vol
        </button>

        {/* ADJ button */}
        <button className="text-xs text-gray-400 hover:text-white hover:bg-[#2d3139] px-2 py-1 rounded transition-colors">
          ADJ
        </button>

        {/* Broadcast button */}
        <button className="text-gray-400 hover:text-white hover:bg-[#2d3139] p-1 rounded transition-colors">📡</button>
      </div>
    </div>
  )
}
