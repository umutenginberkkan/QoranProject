import { useState, useEffect } from "react"

export default function Settings() {
  const user = null // Giriş yapılmışsa burada kullanıcı objesi olur

  const [tema, setTema] = useState(() => {
    const saved = localStorage.getItem("appSettings")
    return saved ? JSON.parse(saved).tema || "light" : "light"
  })

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("appSettings")
    return saved ? JSON.parse(saved).fontSize || "normal" : "normal"
  })

  const [bildirimler, setBildirimler] = useState(() => {
    const saved = localStorage.getItem("appSettings")
    return saved ? JSON.parse(saved).bildirimler ?? true : true
  })

  const [istatistikTuru, setIstatistikTuru] = useState<"ayet" | "harf">(() => {
    const saved = localStorage.getItem("appSettings")
    return saved ? JSON.parse(saved).istatistikTuru || "ayet" : "ayet"
  })

  const [resetMessage, setResetMessage] = useState("")
  const [saveMessage, setSaveMessage] = useState("")

  // 🔄 Ayarlar her değiştiğinde kaydedilir
  useEffect(() => {
    const settings = { tema, fontSize, bildirimler, istatistikTuru }
    localStorage.setItem("appSettings", JSON.stringify(settings))

    if (user) {
      // Giriş yapılmışsa API ile veritabanına kaydedilebilir
      // fetch(`/api/users/${user.id}/settings`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings),
      // })
    }
  }, [tema, fontSize, bildirimler, istatistikTuru])

  const handleReset = () => {
    localStorage.removeItem("readVerses")
    localStorage.removeItem("lastSelectedSureNo")
    localStorage.removeItem("lastSelectedAyet")
    setResetMessage("Okuma geçmişi sıfırlandı.")
    setTimeout(() => setResetMessage(""), 3000)
  }

  const handleSaveClick = () => {
    setSaveMessage("Ayarlar kaydedildi.")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Ayarlar</h1>

      {/* Tema Ayarı */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Tema</label>
        <select
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="light">Açık Tema</option>
          <option value="dark">Koyu Tema</option>
        </select>
      </div>

      {/* Yazı Boyutu */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Yazı Boyutu</label>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="small">Küçük</option>
          <option value="normal">Normal</option>
          <option value="large">Büyük</option>
        </select>
      </div>

      {/* Bildirimler */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={bildirimler}
          onChange={(e) => setBildirimler(e.target.checked)}
          id="bildirimler"
          className="mr-2"
        />
        <label htmlFor="bildirimler" className="font-medium">
          Okuma hatırlatmalarını al
        </label>
      </div>

      {/* İstatistik Hesaplama Türü */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">İstatistik Türü</label>
        <select
          value={istatistikTuru}
          onChange={(e) =>
            setIstatistikTuru(e.target.value as "ayet" | "harf")
          }
          className="w-full border rounded px-3 py-2"
        >
          <option value="ayet">Ayet Sayısı</option>
          <option value="harf">Harf Sayısı</option>
        </select>
      </div>

      {/* Butonlar */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveClick}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ayarları Kaydet
        </button>

        <button
          onClick={handleReset}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Okuma Geçmişini Sıfırla
        </button>
      </div>

      {/* Mesajlar */}
      {resetMessage && (
        <p className="text-green-600 mt-4 font-medium">{resetMessage}</p>
      )}
      {saveMessage && (
        <p className="text-blue-600 mt-4 font-medium">{saveMessage}</p>
      )}
    </div>
  )
}
