"use client"

import { useState } from "react"
import { ChartCanvas } from "@/components/chart-canvas"
import { LeftSidebar } from "@/components/left-sidebar"
import { TopToolbar } from "@/components/top-toolbar"
import { RightSidebar } from "@/components/right-sidebar"
import { BottomControls } from "@/components/bottom-controls"

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<string>("pointer")
  const [timeframe, setTimeframe] = useState<string>("1D")
  const [symbol, setSymbol] = useState("AAPL")
  const [showVolume, setShowVolume] = useState(true)

  const getAssetType = (sym: string) => {
    if (
      sym.length <= 5 &&
      /^[A-Z]+$/.test(sym) &&
      ["BTC", "ETH", "XRP", "ADA", "SOL", "DOGE", "MATIC", "LINK"].includes(sym)
    ) {
      return "CRYPTO"
    }
    if (sym.length === 6 && /^[A-Z]{3}[A-Z]{3}$/.test(sym)) {
      return "FOREX"
    }
    return "STOCK"
  }

  return (
    <div className="flex h-screen bg-[#131722] text-white overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar selectedTool={selectedTool} onToolSelect={setSelectedTool} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <TopToolbar symbol={symbol} onSymbolChange={setSymbol} />

        {/* Asset Type Indicator */}
        <div className="px-4 py-2 bg-[#1e222d] border-b border-[#2d3139] text-xs text-gray-400">
          <span className="inline-block px-2 py-1 bg-[#2d3139] rounded mr-2">{getAssetType(symbol)}</span>
          <span>Live data with automatic fallback • {symbol}</span>
        </div>

        {/* Chart Area */}
        <div className="flex-1 flex overflow-hidden">
          <ChartCanvas symbol={symbol} timeframe={timeframe} selectedTool={selectedTool} />
          <RightSidebar />
        </div>

        {/* Bottom Controls */}
        <BottomControls
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          showVolume={showVolume}
          onVolumeToggle={setShowVolume}
        />
      </div>
    </div>
  )
}
