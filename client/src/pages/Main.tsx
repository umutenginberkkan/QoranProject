import { useState, useEffect } from "react"
import { surahs } from "../data/surahs"

export default function Main() {
  const [selectedSure, setSelectedSure] = useState(surahs[0])
  const [selectedAyet, setSelectedAyet] = useState(1)
  const [ayetMetni, setAyetMetni] = useState("")

  const imageSrc = `/img/${selectedSure.no}_${selectedAyet}.png`
  let touchStartX = 0
  // 🔸 Klavye ile yönlendirme
 useEffect(() => {
  let touchStartX = 0
  let isPinching = false

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      isPinching = true
      return
    }
    isPinching = false
    touchStartX = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (isPinching || e.changedTouches.length > 1) return

    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchEndX - touchStartX

    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        // 👉 sağa kaydır — önceki ayet
        setSelectedAyet((prev) => (prev > 1 ? prev - 1 : prev))
      } else {
        // 👈 sola kaydır — sonraki ayet
        setSelectedAyet((prev) =>
          prev < selectedSure.ayetSayisi ? prev + 1 : prev
        )
      }
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      // → sonraki ayet
      setSelectedAyet((prev) =>
        prev < selectedSure.ayetSayisi ? prev + 1 : prev
      )
    } else if (e.key === "ArrowLeft") {
      // ← önceki ayet
      setSelectedAyet((prev) => (prev > 1 ? prev - 1 : prev))
    } else if (e.key === "ArrowDown") {
      const currentIndex = surahs.findIndex((s) => s.no === selectedSure.no)
      if (currentIndex < surahs.length - 1) {
        setSelectedSure(surahs[currentIndex + 1])
        setSelectedAyet(1)
      }
    } else if (e.key === "ArrowUp") {
      const currentIndex = surahs.findIndex((s) => s.no === selectedSure.no)
      if (currentIndex > 0) {
        setSelectedSure(surahs[currentIndex - 1])
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


  // 🔸 Metin yükleme
  useEffect(() => {
    fetch("/quran-simple-plain.txt")
      .then((res) => res.text())
      .then((text) => {
        const satirlar = text
          .split("\n")
          .map((s) => s.trim().replace(/^\uFEFF/, ""))

        const hedef = satirlar.find((satir) => {
          const [sureNo, ayetNo] = satir.split("|")
          return (
            Number(sureNo) === selectedSure.no &&
            Number(ayetNo) === selectedAyet
          )
        })

        if (hedef) {
          const [, , metin] = hedef.split("|")
          setAyetMetni(metin)
        } else {
          setAyetMetni("")
        }
      })
      .catch(() => setAyetMetni(""))
  }, [selectedSure, selectedAyet])

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

      {/* Ayet kelimeleri */}
      {ayetMetni && (
        <div className="mt-6 text-center text-3xl font-serif leading-loose space-y-3">
          {ayetMetni.split(" ").map((kelime, i) => (
            <div
              key={i}
              className="relative pb-2 after:content-[''] after:block after:h-[1px] after:bg-black after:opacity-30 after:mx-auto after:mt-2 after:w-1/2"
            >
              {kelime}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
