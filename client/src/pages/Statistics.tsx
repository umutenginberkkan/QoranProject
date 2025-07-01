import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { surahs } from "../data/surahs"

type ChartItem = { name: string; ayet: number }
type DetailItem = { sure: string; ranges: string[] }

export default function StatisticsPage() {
  const [chartData, setChartData] = useState<ChartItem[]>([])
  const [details, setDetails] = useState<DetailItem[]>([])

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("readVerses") || "{}")
    const sureGroups: Record<number, number[]> = {}

    // Yeni yapıya uygun okuma
    for (const sureNoStr in raw) {
      const sureNo = parseInt(sureNoStr)
      const ayetList = raw[sureNoStr] as number[]
      if (!Array.isArray(ayetList)) continue

      sureGroups[sureNo] = ayetList
    }

    const chart: ChartItem[] = []
    const detail: DetailItem[] = []

    Object.entries(sureGroups).forEach(([sureNoStr, ayetList]) => {
      const sureNo = parseInt(sureNoStr)
      const sure = surahs.find((s) => s.no === sureNo)
      if (!sure) return

      const sorted = [...ayetList].sort((a, b) => a - b)
      const ranges: string[] = []

      let start = sorted[0]
      let prev = sorted[0]

      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === prev + 1) {
          prev = sorted[i]
        } else {
          ranges.push(start === prev ? `${start}` : `${start}-${prev}`)
          start = sorted[i]
          prev = sorted[i]
        }
      }
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`)

      chart.push({ name: sure.ad, ayet: sorted.length })
      detail.push({ sure: sure.ad, ranges })
    })

    setChartData(chart)
    setDetails(detail)
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Okuma İstatistikleri</h1>

      {/* Grafik */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 50, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="ayet" fill="#38bdf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detaylı aralıklar */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Detaylı Okuma Aralıkları
        </h2>
        <ul className="space-y-2">
          {details.map((item) => (
            <li key={item.sure} className="border p-3 rounded shadow">
              <strong>{item.sure}</strong>: {item.ranges.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
