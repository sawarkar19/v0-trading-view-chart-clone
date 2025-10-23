"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { fetchMarketData } from "@/lib/market-data"

interface ChartCanvasProps {
  symbol: string
  timeframe: string
  selectedTool: string
}

interface DrawingPoint {
  x: number
  y: number
}

interface HoverData {
  candleIndex: number
  x: number
  y: number
}

export function ChartCanvas({ symbol, timeframe, selectedTool }: ChartCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollOffset, setScrollOffset] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [hoverData, setHoverData] = useState<HoverData | null>(null)
  const [drawings, setDrawings] = useState<DrawingPoint[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const marketData = await fetchMarketData(symbol, timeframe)
        setData(marketData)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load data"
        setError(errorMsg)
        console.error("[v0] Error loading market data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [symbol, timeframe])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = 60

    // Background
    ctx.fillStyle = "#131722"
    ctx.fillRect(0, 0, width, height)

    // Grid
    ctx.strokeStyle = "#1e222d"
    ctx.lineWidth = 1

    // Vertical grid lines
    const candleWidth = 8 * zoomLevel
    const spacing = 12 * zoomLevel
    for (let i = 0; i < width; i += spacing) {
      ctx.beginPath()
      ctx.moveTo(i, padding)
      ctx.lineTo(i, height - 40)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = padding; i < height - 40; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    if (data.length === 0) return

    // Calculate price range
    const prices = data.flatMap((d) => [d.high, d.low])
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const priceRange = maxPrice - minPrice
    const chartHeight = height - padding - 40

    // Draw candlesticks
    const startIdx = Math.max(0, data.length - Math.floor((width - padding) / spacing))
    data.slice(startIdx).forEach((candle, idx) => {
      const x = padding + idx * spacing

      // Calculate positions
      const openY = padding + ((maxPrice - candle.open) / priceRange) * chartHeight
      const closeY = padding + ((maxPrice - candle.close) / priceRange) * chartHeight
      const highY = padding + ((maxPrice - candle.high) / priceRange) * chartHeight
      const lowY = padding + ((maxPrice - candle.low) / priceRange) * chartHeight

      const isGreen = candle.close >= candle.open
      const color = isGreen ? "#26a69a" : "#f23645"

      // Wick
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, highY)
      ctx.lineTo(x + candleWidth / 2, lowY)
      ctx.stroke()

      // Body
      ctx.fillStyle = color
      const bodyTop = Math.min(openY, closeY)
      const bodyHeight = Math.abs(closeY - openY) || 1
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight)
      ctx.strokeStyle = color
      ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight)

      // Highlight hovered candle
      if (hoverData && hoverData.candleIndex === startIdx + idx) {
        ctx.strokeStyle = "#2962ff"
        ctx.lineWidth = 2
        ctx.strokeRect(x - 2, bodyTop - 2, candleWidth + 4, bodyHeight + 4)
      }
    })

    // Draw user drawings
    if (drawings.length > 0 && selectedTool !== "pointer") {
      ctx.strokeStyle = "#2962ff"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(drawings[0].x, drawings[0].y)
      for (let i = 1; i < drawings.length; i++) {
        ctx.lineTo(drawings[i].x, drawings[i].y)
      }
      ctx.stroke()
    }

    // Y-axis labels
    ctx.fillStyle = "#787f8f"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange / 5) * i
      const y = padding + chartHeight - (chartHeight / 5) * i
      ctx.fillText(price.toFixed(2), padding - 10, y + 4)
    }

    // X-axis labels (dates)
    ctx.fillStyle = "#787f8f"
    ctx.textAlign = "center"
    const dateLabels = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"]
    dateLabels.forEach((label, idx) => {
      const x = padding + (idx * (width - padding)) / dateLabels.length
      ctx.fillText(label, x, height - 10)
    })

    // Draw crosshair and tooltip on hover
    if (hoverData) {
      // Crosshair lines
      ctx.strokeStyle = "rgba(41, 98, 255, 0.3)"
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(hoverData.x, padding)
      ctx.lineTo(hoverData.x, height - 40)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, hoverData.y)
      ctx.lineTo(width, hoverData.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Tooltip
      const candle = data[hoverData.candleIndex]
      if (candle) {
        const tooltipWidth = 140
        const tooltipHeight = 80
        let tooltipX = hoverData.x + 10
        let tooltipY = hoverData.y - 10

        if (tooltipX + tooltipWidth > width) {
          tooltipX = hoverData.x - tooltipWidth - 10
        }
        if (tooltipY + tooltipHeight > height) {
          tooltipY = hoverData.y - tooltipHeight - 10
        }

        ctx.fillStyle = "rgba(19, 23, 34, 0.95)"
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)
        ctx.strokeStyle = "#2962ff"
        ctx.lineWidth = 1
        ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight)

        ctx.fillStyle = "#d1d5db"
        ctx.font = "11px monospace"
        ctx.textAlign = "left"
        const tooltipData = [
          `O ${candle.open.toFixed(2)}`,
          `H ${candle.high.toFixed(2)}`,
          `L ${candle.low.toFixed(2)}`,
          `C ${candle.close.toFixed(2)}`,
          `V ${(candle.volume / 1000000).toFixed(1)}M`,
        ]
        tooltipData.forEach((text, idx) => {
          ctx.fillText(text, tooltipX + 8, tooltipY + 16 + idx * 14)
        })
      }
    }
  }, [data, scrollOffset, zoomLevel, hoverData, drawings, selectedTool])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const padding = 60

    if (x > padding && y > padding && y < canvas.offsetHeight - 40) {
      const spacing = 12 * zoomLevel
      const candleIndex = Math.floor((x - padding) / spacing)
      setHoverData({ candleIndex, x, y })

      if (isDrawing && selectedTool !== "pointer" && selectedTool !== "crosshair") {
        setDrawings([...drawings, { x, y }])
      }
    } else {
      setHoverData(null)
    }

    if (dragStart && selectedTool === "pointer") {
      const deltaX = e.clientX - dragStart.x
      setScrollOffset((prev) => prev - deltaX)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === "pointer") {
      setDragStart({ x: e.clientX, y: e.clientY })
    } else if (selectedTool !== "crosshair") {
      setIsDrawing(true)
      const canvas = canvasRef.current
      if (canvas) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setDrawings([{ x, y }])
      }
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    setDragStart(null)
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoomLevel((prev) => Math.max(0.5, Math.min(3, prev * delta)))
  }

  return (
    <div className="flex-1 relative bg-[#131722] overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#131722]/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2962ff] mx-auto mb-4"></div>
            <p className="text-gray-400">Loading {symbol} data...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#131722]/80 z-10">
          <div className="text-center">
            <p className="text-red-400 mb-2">⚠️ Error loading data</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <p className="text-gray-500 text-xs mt-2">Using fallback data...</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`w-full h-full ${selectedTool === "pointer" ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setHoverData(null)}
        onWheel={handleWheel}
      />

      {/* Current price indicator */}
      <div className="absolute top-4 right-4 bg-[#1e222d] rounded p-3 border border-[#2d3139]">
        <div className="text-sm text-gray-400">
          {symbol} · {timeframe} · NASDAQ
        </div>
        <div className="text-2xl font-bold mt-1">
          <span className="text-white">259.85</span>
          <span className="text-green-400 ml-2">+0.34</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">O 262.65 H 262.85 L 255.43 C 258.45</div>
      </div>

      {/* Volume indicator */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">Vol 45.01M</div>

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-[#1e222d] px-2 py-1 rounded border border-[#2d3139]">
        Zoom: {(zoomLevel * 100).toFixed(0)}%
      </div>
    </div>
  )
}
