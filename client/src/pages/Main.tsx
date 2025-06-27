import { useState } from "react"

const sureler = [
  { ad: "Fatiha", no: 1, ayetSayisi: 7 },
  { ad: "Bakara", no: 2, ayetSayisi: 286 },
  { ad: "Yasin", no: 36, ayetSayisi: 83 },
]

export default function Main() {
  const [selectedSure, setSelectedSure] = useState(sureler[0])
  const [selectedAyet, setSelectedAyet] = useState(1)

  const imageSrc = `/img/${selectedSure.no}_${selectedAyet}.png`

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      {/* Dropdownlar */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        {/* Sure Dropdown */}
        <select
          className="w-full sm:w-1/2 border rounded px-3 py-2"
          value={selectedSure.ad}
          onChange={(e) => {
            const yeniSure = sureler.find(s => s.ad === e.target.value)!
            setSelectedSure(yeniSure)
            setSelectedAyet(1)
          }}
        >
          {sureler.map((sure) => (
            <option key={sure.no} value={sure.ad}>
              {sure.ad}
            </option>
          ))}
        </select>

        {/* Ayet Dropdown */}
        <select
          className="w-full sm:w-1/2 border rounded px-3 py-2"
          value={selectedAyet}
          onChange={(e) => setSelectedAyet(Number(e.target.value))}
        >
          {Array.from({ length: selectedSure.ayetSayisi }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}. Ayet
            </option>
          ))}
        </select>
      </div>

      {/* Ayet Görseli */}
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt={`Ayet: ${selectedSure.ad} ${selectedAyet}`}
          className="w-full max-w-3xl h-auto border-2 border-gray-300 rounded-lg shadow-lg"
          onError={(e) => (e.currentTarget.src = "/img/not-found.png")}
        />
      </div>
    </div>
  )
}
