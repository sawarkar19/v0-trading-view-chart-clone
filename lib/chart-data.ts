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
