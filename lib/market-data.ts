export interface CandleData {
  open: number
  high: number
  low: number
  close: number
  volume: number
  date: string
}

export function generateMockData(count: number): CandleData[] {
  const data: CandleData[] = []
  let price = 200

  for (let i = 0; i < count; i++) {
    const open = price
    const change = (Math.random() - 0.5) * 10
    const close = Math.max(100, open + change)
    const high = Math.max(open, close) + Math.random() * 5
    const low = Math.min(open, close) - Math.random() * 5
    const volume = Math.floor(Math.random() * 100000000)

    data.push({
      open,
      high,
      low,
      close,
      volume,
      date: new Date(Date.now() - (count - i) * 86400000).toISOString(),
    })

    price = close
  }

  return data
}

export async function fetchMarketData(symbol: string, timeframe: string): Promise<CandleData[]> {
  try {
    console.log(`[v0] Fetching market data for ${symbol}`)
    const response = await fetch(`/api/market-data?symbol=${symbol}&timeframe=${timeframe}`)

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "API returned error")
    }

    console.log(`[v0] Successfully fetched ${result.count} candles for ${symbol}`)
    return result.data
  } catch (error) {
    console.warn(`[v0] Failed to fetch real data: ${error instanceof Error ? error.message : String(error)}`)
    console.log(`[v0] Falling back to mock data for ${symbol}`)
    return generateMockData(100)
  }
}
