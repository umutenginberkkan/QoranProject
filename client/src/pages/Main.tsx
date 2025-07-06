import { useState, useEffect } from "react"
import { surahs } from "../data/surahs"

export default function Main() {
  const [selectedSure, setSelectedSure] = useState(() => {
    const saved = localStorage.getItem("lastSelectedSureNo")
    const sureNo = saved ? Number(saved) : surahs[0].no
    return surahs.find((s) => s.no === sureNo) || surahs[0]
  })

  const [selectedAyet, setSelectedAyet] = useState(() => {
    const saved = localStorage.getItem("lastSelectedAyet")
    return saved ? Number(saved) : 1
  })

  const [ayetMetni, setAyetMetni] = useState("")
  const [wasReadBefore, setWasReadBefore] = useState(false)

  const imageSrc = `/img/${selectedSure.no}_${selectedAyet}.png`

  // 🔸 Touch ve Klavye Navigasyonu
  useEffect(() => {
  let touchStartX = 0
  let touchStartY = 0
  let isPinching = false

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      isPinching = true
      return
    }
    isPinching = false
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (isPinching || e.changedTouches.length > 1) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY

    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    // 🔸 Yalnızca yatay swipe'larda (sağ/sol) çalışsın
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        setSelectedAyet((prev) => (prev > 1 ? prev - 1 : prev))
      } else {
        setSelectedAyet((prev) =>
          prev < selectedSure.ayetSayisi ? prev + 1 : prev
        )
      }
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      setSelectedAyet((prev) =>
        prev < selectedSure.ayetSayisi ? prev + 1 : prev
      )
    } else if (e.key === "ArrowLeft") {
      setSelectedAyet((prev) => (prev > 1 ? prev - 1 : prev))
    } else if (e.key === "ArrowDown") {
      const i = surahs.findIndex((s) => s.no === selectedSure.no)
      if (i < surahs.length - 1) {
        setSelectedSure(surahs[i + 1])
        setSelectedAyet(1)
      }
    } else if (e.key === "ArrowUp") {
      const i = surahs.findIndex((s) => s.no === selectedSure.no)
      if (i > 0) {
        setSelectedSure(surahs[i - 1])
        setSelectedAyet(1)
      }
    }
  }

  window.addEventListener("touchstart", handleTouchStart)
  window.addEventListener("touchend", handleTouchEnd)
  window.addEventListener("keydown", handleKey)

  return () => {
    window.removeEventListener("touchstart", handleTouchStart)
    window.removeEventListener("touchend", handleTouchEnd)
    window.removeEventListener("keydown", handleKey)
  }
}, [selectedSure])


  // 🔸 Ayet metni + okuma durumu kontrolü
  useEffect(() => {
    const sureNo = selectedSure.no
    const ayetNo = selectedAyet

    const readMap = JSON.parse(localStorage.getItem("readVerses") || "{}")
    const ayetList: number[] = readMap[sureNo] || []

    const wasRead = ayetList.includes(ayetNo)
    setWasReadBefore(wasRead)

    fetch("/quran-simple-plain.txt")
      .then((res) => res.text())
      .then((text) => {
        const satirlar = text
          .split("\n")
          .map((s) => s.trim().replace(/^\uFEFF/, ""))

        const hedef = satirlar.find((satir) => {
          const [sureStr, ayetStr] = satir.split("|")
          return Number(sureStr) === sureNo && Number(ayetStr) === ayetNo
        })

        if (hedef) {
          const [, , metin] = hedef.split("|")
          setAyetMetni(metin)

          // 👇 Sadece ilk geçiş sonrası kaydet
          if (!wasRead) {
            const updatedList = [...ayetList, ayetNo]
            updatedList.sort((a, b) => a - b)
            readMap[sureNo] = updatedList
            localStorage.setItem("readVerses", JSON.stringify(readMap))
          }
        } else {
          setAyetMetni("")
        }
      })
      .catch(() => setAyetMetni(""))
  }, [selectedSure, selectedAyet])

  // 🔸 Son kaldığı yeri kaydet
  useEffect(() => {
    localStorage.setItem("lastSelectedSureNo", String(selectedSure.no))
  }, [selectedSure])

  useEffect(() => {
    localStorage.setItem("lastSelectedAyet", String(selectedAyet))
  }, [selectedAyet])

  return (
    <div className="max-w-4xl mx-auto px-4 mt-6">
      {/* Dropdownlar */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
        <select
          className="w-full sm:w-1/2 border rounded px-3 py-2"
          value={selectedSure.ad}
          onChange={(e) => {
            const yeniSure = surahs.find((s) => s.ad === e.target.value)!
            setSelectedSure(yeniSure)
            setSelectedAyet(1)
          }}
        >
          {surahs.map((sure) => (
            <option key={sure.no} value={sure.ad}>
              {sure.ad}
            </option>
          ))}
        </select>

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

      {/* Görsel */}
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt={`Ayet: ${selectedSure.ad} ${selectedAyet}`}
          className="w-full max-w-3xl h-auto border-2 border-gray-300 rounded-lg shadow-lg"
          onError={(e) => (e.currentTarget.src = "/img/not-found.png")}
        />
      </div>

      {/* Ayet metni ve işaret */}
      {ayetMetni && (
        <div className="mt-6 text-center text-3xl font-serif leading-loose">
          <div className="mb-4">
            <span
              className={`inline-block w-4 h-4 rounded-full ${
                wasReadBefore ? "bg-green-500" : "bg-gray-400"
              }`}
              title={wasReadBefore ? "Okundu" : "İlk görüntüleme"}
            ></span>
          </div>

          <div className="space-y-3">
            {ayetMetni.split(" ").map((kelime, i) => (
              <div
                key={i}
                className="relative pb-2 after:content-[''] after:block after:h-[1px] after:bg-black after:opacity-30 after:mx-auto after:mt-2 after:w-1/2"
              >
                {kelime}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
