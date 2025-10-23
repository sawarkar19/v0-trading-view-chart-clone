"use client"

import { useState } from "react"

interface LeftSidebarProps {
  selectedTool: string
  onToolSelect: (tool: string) => void
}

interface ToolOption {
  id: string
  icon: string
  label: string
  category: "selection" | "drawing" | "measurement" | "utility"
}

const tools: ToolOption[] = [
  { id: "pointer", icon: "↖", label: "Pointer", category: "selection" },
  { id: "crosshair", icon: "+", label: "Crosshair", category: "selection" },

  { id: "line", icon: "/", label: "Line", category: "drawing" },
  { id: "trend", icon: "\\", label: "Trend Line", category: "drawing" },
  { id: "rectangle", icon: "▭", label: "Rectangle", category: "drawing" },
  { id: "circle", icon: "◯", label: "Circle", category: "drawing" },
  { id: "text", icon: "T", label: "Text", category: "drawing" },
  { id: "brush", icon: "✏", label: "Brush", category: "drawing" },

  { id: "measure", icon: "📏", label: "Measure", category: "measurement" },

  { id: "eraser", icon: "⌫", label: "Eraser", category: "utility" },
  { id: "settings", icon: "⚙", label: "Settings", category: "utility" },
]

export function LeftSidebar({ selectedTool, onToolSelect }: LeftSidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [lineWidth, setLineWidth] = useState(2)
  const [lineColor, setLineColor] = useState("#26a69a")
  const [showOptions, setShowOptions] = useState(false)

  const categories = ["selection", "drawing", "measurement", "utility"]
  const categoryLabels = {
    selection: "Selection",
    drawing: "Drawing",
    measurement: "Measurement",
    utility: "Utility",
  }

  const getToolsByCategory = (category: string) => {
    return tools.filter((t) => t.category === category)
  }

  const isDrawingTool = (toolId: string) => {
    const tool = tools.find((t) => t.id === toolId)
    return tool?.category === "drawing"
  }

  return (
    <div className="w-16 bg-[#1e222d] border-r border-[#2d3139] flex flex-col items-center py-4 gap-1 overflow-y-auto">
      {/* Tool categories */}
      {categories.map((category) => {
        const categoryTools = getToolsByCategory(category)
        const isExpanded = expandedCategory === category

        return (
          <div key={category} className="w-full">
            {/* Category header */}
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="w-full px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#2d3139] transition-colors text-center"
              title={categoryLabels[category as keyof typeof categoryLabels]}
            >
              {categoryLabels[category as keyof typeof categoryLabels].charAt(0)}
            </button>

            {/* Category tools */}
            {isExpanded && (
              <div className="flex flex-col gap-1 py-1 border-t border-[#2d3139]">
                {categoryTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onToolSelect(tool.id)
                      if (isDrawingTool(tool.id)) {
                        setShowOptions(true)
                      }
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded transition-colors mx-auto ${
                      selectedTool === tool.id
                        ? "bg-[#2962ff] text-white"
                        : "text-gray-400 hover:bg-[#2d3139] hover:text-white"
                    }`}
                    title={tool.label}
                  >
                    {tool.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}

      {/* Drawing options panel */}
      {showOptions && isDrawingTool(selectedTool) && (
        <div className="w-full mt-4 pt-4 border-t border-[#2d3139] px-2 space-y-3">
          {/* Line width control */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 block">Width</label>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-full h-1 bg-[#2d3139] rounded appearance-none cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">{lineWidth}px</div>
          </div>

          {/* Color picker */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 block">Color</label>
            <div className="flex gap-1">
              <input
                type="color"
                value={lineColor}
                onChange={(e) => setLineColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-[#2d3139]"
              />
              <div
                className="flex-1 rounded border border-[#2d3139] bg-[#2d3139]"
                style={{ backgroundColor: lineColor }}
              />
            </div>
          </div>

          {/* Quick color presets */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 block">Presets</label>
            <div className="grid grid-cols-4 gap-1">
              {["#26a69a", "#f23645", "#2962ff", "#ff9800"].map((color) => (
                <button
                  key={color}
                  onClick={() => setLineColor(color)}
                  className="w-6 h-6 rounded border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: lineColor === color ? "#ffffff" : "transparent",
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Close options */}
          <button
            onClick={() => setShowOptions(false)}
            className="w-full text-xs text-gray-400 hover:text-white py-1 border-t border-[#2d3139] mt-2"
          >
            Hide
          </button>
        </div>
      )}
    </div>
  )
}
