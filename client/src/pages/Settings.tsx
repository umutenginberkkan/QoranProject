import { useState } from "react"

export default function Settings() {
  const [tema, setTema] = useState("light")
  const [fontSize, setFontSize] = useState("normal")
  const [bildirimler, setBildirimler] = useState(true)

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
        <label htmlFor="bildirimler" className="font-medium">Okuma hatırlatmalarını al</label>
      </div>

      {/* Kaydet Butonu */}
      <button
        onClick={() => alert("Ayarlar kaydedildi (örnek).")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Kaydet
      </button>
    </div>
  )
}
