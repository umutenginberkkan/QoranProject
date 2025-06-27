import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 w-full bg-red-600 text-white z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Sol: Tab */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate("/Main")}
            className="font-semibold hover:underline"
          >
            Oku
          </button>
        </div>

        {/* Sağ: Profil */}
        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            {/* Profil simgesi */}
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black text-sm font-semibold border">
              👤
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded shadow z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false)
                  navigate("/Settings")
                }}
              >
                Ayarlar
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false)
                  navigate("/Statistics")
                }}
              >
                İstatistikler
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
