"use client"

import { useState } from "react"

interface TopToolbarProps {
  symbol: string
  onSymbolChange: (symbol: string) => void
}

interface Indicator {
  id: string
  name: string
  category: string
}

const indicators: Indicator[] = [
  { id: "sma", name: "Simple Moving Average", category: "Trend" },
  { id: "ema", name: "Exponential Moving Average", category: "Trend" },
  { id: "rsi", name: "Relative Strength Index", category: "Momentum" },
  { id: "macd", name: "MACD", category: "Momentum" },
  { id: "bb", name: "Bollinger Bands", category: "Volatility" },
  { id: "atr", name: "Average True Range", category: "Volatility" },
  { id: "stoch", name: "Stochastic", category: "Momentum" },
  { id: "adx", name: "Average Directional Index", category: "Trend" },
]

export function TopToolbar({ symbol, onSymbolChange }: TopToolbarProps) {
  const [showSymbolSearch, setShowSymbolSearch] = useState(false)
  const [showIndicators, setShowIndicators] = useState(false)
  const [activeIndicators, setActiveIndicators] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState("")

  const toggleIndicator = (indicatorId: string) => {
    setActiveIndicators((prev) =>
      prev.includes(indicatorId) ? prev.filter((id) => id !== indicatorId) : [...prev, indicatorId],
    )
  }

  const groupedIndicators = indicators.reduce(
    (acc, indicator) => {
      if (!acc[indicator.category]) {
        acc[indicator.category] = []
      }
      acc[indicator.category].push(indicator)
      return acc
    },
    {} as Record<string, Indicator[]>,
  )

  return (
    <div className="h-14 bg-[#1e222d] border-b border-[#2d3139] flex items-center px-4 gap-4">
      {/* Menu */}
      <button className="text-gray-400 hover:text-white transition-colors">☰</button>

      {/* Symbol Search */}
      <div className="relative">
        <button
          onClick={() => setShowSymbolSearch(!showSymbolSearch)}
          className="flex items-center gap-2 px-3 py-2 bg-[#2d3139] rounded hover:bg-[#3d4249] text-white transition-colors"
        >
          <span className="font-semibold">{symbol}</span>
          <span className="text-xs text-gray-400">NASDAQ</span>
        </button>
        {showSymbolSearch && (
          <div className="absolute top-full mt-2 bg-[#2d3139] rounded shadow-lg p-2 z-10">
            <input
              type="text"
              placeholder="Search symbol..."
              className="w-40 px-2 py-1 bg-[#1e222d] border border-[#3d4249] rounded text-white text-sm focus:outline-none focus:border-blue-500"
              onChange={(e) => onSymbolChange(e.target.value.toUpperCase())}
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setShowIndicators(!showIndicators)}
          className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
            activeIndicators.length > 0
              ? "bg-[#2962ff] text-white hover:bg-blue-700"
              : "text-gray-400 hover:text-white hover:bg-[#2d3139]"
          }`}
        >
          <span>📊</span>
          <span className="text-sm">Indicators</span>
          {activeIndicators.length > 0 && (
            <span className="ml-1 text-xs bg-white text-blue-600 px-2 py-0.5 rounded-full font-semibold">
              {activeIndicators.length}
            </span>
          )}
        </button>

        {showIndicators && (
          <div className="absolute top-full mt-2 bg-[#1e222d] rounded shadow-lg border border-[#2d3139] z-10 w-64">
            {/* Search */}
            <div className="p-3 border-b border-[#2d3139]">
              <input
                type="text"
                placeholder="Search indicators..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-2 py-1 bg-[#2d3139] border border-[#3d4249] rounded text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Indicators by category */}
            <div className="max-h-80 overflow-y-auto">
              {Object.entries(groupedIndicators).map(([category, categoryIndicators]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-[#0d0f12] sticky top-0">
                    {category}
                  </div>
                  {categoryIndicators
                    .filter((ind) => ind.name.toLowerCase().includes(searchInput.toLowerCase()))
                    .map((indicator) => (
                      <button
                        key={indicator.id}
                        onClick={() => toggleIndicator(indicator.id)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                          activeIndicators.includes(indicator.id)
                            ? "bg-[#2962ff] text-white"
                            : "text-gray-300 hover:bg-[#2d3139]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={activeIndicators.includes(indicator.id)}
                          onChange={() => {}}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span>{indicator.name}</span>
                      </button>
                    ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-[#2d3139] flex gap-2">
              <button
                onClick={() => setActiveIndicators([])}
                className="flex-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2d3139] rounded transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowIndicators(false)}
                className="flex-1 px-2 py-1 text-xs bg-[#2962ff] text-white hover:bg-blue-700 rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawing Tools */}
      <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#2d3139] rounded transition-colors">
        <span>⊞</span>
        <span className="text-sm">Drawing</span>
      </button>

      {/* Alert */}
      <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#2d3139] rounded transition-colors">
        <span>🔔</span>
        <span className="text-sm">Alert</span>
      </button>

      {/* Replay */}
      <button className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-[#2d3139] rounded transition-colors">
        <span>⏮</span>
        <span className="text-sm">Replay</span>
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side buttons */}
      <button className="text-gray-400 hover:text-white hover:bg-[#2d3139] p-2 rounded transition-colors">☐</button>
      <button className="text-gray-400 hover:text-white hover:bg-[#2d3139] p-2 rounded transition-colors">💾</button>
      <button className="text-gray-400 hover:text-white hover:bg-[#2d3139] p-2 rounded transition-colors">🔍</button>
      <button className="text-gray-400 hover:text-white hover:bg-[#2d3139] p-2 rounded transition-colors">👁</button>
      <button className="text-gray-400 hover:text-white hover:bg-[#2d3139] p-2 rounded transition-colors">⛶</button>
      <button className="text-gray-400 hover:text-white hover:bg-[#2d3139] p-2 rounded transition-colors">📷</button>
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-semibold transition-colors">
        Publish
      </button>
    </div>
  )
}
