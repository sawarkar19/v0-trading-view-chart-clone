"use client"

import { useState } from "react"

interface PriceLevel {
  id: string
  price: number
  label: string
  color: string
  type: "support" | "resistance" | "custom"
}

export function RightSidebar() {
  const [priceLevels, setPriceLevels] = useState<PriceLevel[]>([
    { id: "1", price: 270.0, label: "Resistance", color: "#f23645", type: "resistance" },
    { id: "2", price: 260.0, label: "Current", color: "#26a69a", type: "custom" },
    { id: "3", price: 250.0, label: "Support", color: "#2962ff", type: "support" },
  ])

  const [newPrice, setNewPrice] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [showAddLevel, setShowAddLevel] = useState(false)

  const addPriceLevel = () => {
    if (newPrice && newLabel) {
      const newLevel: PriceLevel = {
        id: Date.now().toString(),
        price: Number.parseFloat(newPrice),
        label: newLabel,
        color: "#2962ff",
        type: "custom",
      }
      setPriceLevels([...priceLevels, newLevel].sort((a, b) => b.price - a.price))
      setNewPrice("")
      setNewLabel("")
      setShowAddLevel(false)
    }
  }

  const removePriceLevel = (id: string) => {
    setPriceLevels(priceLevels.filter((level) => level.id !== id))
  }

  const updateLevelColor = (id: string, color: string) => {
    setPriceLevels(priceLevels.map((level) => (level.id === id ? { ...level, color } : level)))
  }

  return (
    <div className="w-24 bg-[#1e222d] border-l border-[#2d3139] flex flex-col overflow-hidden">
      {/* Price levels header */}
      <div className="px-2 py-3 border-b border-[#2d3139]">
        <div className="text-xs font-semibold text-gray-400 mb-2">Price Levels</div>
        <button
          onClick={() => setShowAddLevel(!showAddLevel)}
          className="w-full text-xs px-2 py-1 bg-[#2962ff] text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Add level form */}
      {showAddLevel && (
        <div className="px-2 py-3 border-b border-[#2d3139] space-y-2 bg-[#0d0f12]">
          <input
            type="number"
            placeholder="Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-full text-xs px-2 py-1 bg-[#2d3139] border border-[#3d4249] rounded text-white focus:outline-none focus:border-blue-500"
            step="0.01"
          />
          <input
            type="text"
            placeholder="Label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full text-xs px-2 py-1 bg-[#2d3139] border border-[#3d4249] rounded text-white focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-1">
            <button
              onClick={addPriceLevel}
              className="flex-1 text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddLevel(false)}
              className="flex-1 text-xs px-2 py-1 bg-[#2d3139] text-gray-400 rounded hover:bg-[#3d4249] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Price levels list */}
      <div className="flex-1 overflow-y-auto space-y-1 px-2 py-2">
        {priceLevels.map((level) => (
          <div
            key={level.id}
            className="group p-2 bg-[#0d0f12] rounded border border-[#2d3139] hover:border-[#3d4249] transition-colors"
          >
            <div className="flex items-center gap-1 mb-1">
              <input
                type="color"
                value={level.color}
                onChange={(e) => updateLevelColor(level.id, e.target.value)}
                className="w-4 h-4 rounded cursor-pointer border border-[#3d4249]"
              />
              <span className="text-xs font-semibold text-gray-300 flex-1 truncate">{level.label}</span>
              {level.type === "custom" && (
                <button
                  onClick={() => removePriceLevel(level.id)}
                  className="text-xs text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="text-sm font-mono text-white">${level.price.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">
              {level.type === "support" && "Support"}
              {level.type === "resistance" && "Resistance"}
              {level.type === "custom" && "Custom"}
            </div>
          </div>
        ))}
      </div>

      {/* Right side tools */}
      <div className="border-t border-[#2d3139] px-2 py-2 flex flex-col gap-2">
        <button
          className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-[#2d3139] transition-colors"
          title="Time"
        >
          ⏱
        </button>
        <button
          className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-[#2d3139] transition-colors"
          title="Settings"
        >
          ⚙
        </button>
        <button
          className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-[#2d3139] transition-colors"
          title="Visibility"
        >
          👁
        </button>
        <button
          className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-[#2d3139] transition-colors"
          title="Delete"
        >
          🗑
        </button>
        <button
          className="text-gray-400 hover:text-white text-sm p-1 rounded hover:bg-[#2d3139] transition-colors"
          title="More"
        >
          ⋯
        </button>
      </div>
    </div>
  )
}
