import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

type User = {
  id: string
  name: string
  email: string
}

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [formType, setFormType] = useState<"login" | "register" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as User
        setUser(parsed)
      } catch {
        localStorage.removeItem("user")
      }
    }
  }, [])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const url =
      formType === "login"
        ? "http://localhost:4000/api/login"
        : "http://localhost:4000/api/register"

    const payload =
      formType === "login"
        ? { email: formData.email, password: formData.password }
        : formData

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    const data = await res.json()

    if (!res.ok) return alert(data.error || "Bir hata oluştu")

    if (formType === "login") {
      localStorage.setItem("user", JSON.stringify(data))
      setUser(data)
      setDropdownOpen(false)
      setFormType(null)
      alert("Giriş başarılı")
    } else {
      alert("Kayıt başarılı. Şimdi giriş yapabilirsiniz.")
      setFormType("login")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setDropdownOpen(false)
  }

  const handleNavigateStatistics = () => {
    navigate("/statistics")
    setDropdownOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-red-800 text-white z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Sol: Navigasyon */}
        <div>
          <button
            onClick={() => navigate("/Main")}
            className="font-semibold hover:underline"
          >
            Oku
          </button>
        </div>

        {/* Sağ: Kullanıcı menüsü */}
        <div className="relative">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen)
              setFormType(null)
            }}
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black text-sm font-semibold border">
              👤
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black border rounded shadow z-10 p-3 space-y-2">
              {/* Ayarlar ve İstatistikler - herkes için erişilebilir */}
              <button
                onClick={() => {
                  navigate("/Settings")
                  setDropdownOpen(false)
                }}
                className="w-full text-left px-2 py-1 hover:bg-gray-100"
              >
                ⚙️ Ayarlar
              </button>

              <button
                onClick={handleNavigateStatistics}
                className="w-full text-left px-2 py-1 hover:bg-gray-100"
              >
                📊 İstatistikler
              </button>

              {user ? (
                <>
                  <div className="px-2 text-sm">👋 Merhaba, {user.name}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    🚪 Çıkış Yap
                  </button>
                </>
              ) : formType ? (
                <form onSubmit={handleFormSubmit} className="space-y-2 text-sm">
                  {formType === "register" && (
                    <input
                      type="text"
                      placeholder="İsim"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                      required
                    />
                  )}
                  <input
                    type="email"
                    placeholder="E-posta"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Şifre"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-3 py-1 rounded w-full"
                  >
                    {formType === "login" ? "Giriş Yap" : "Üye Ol"}
                  </button>
                  <div className="text-center text-xs mt-1">
                    <button
                      type="button"
                      className="text-blue-600 underline"
                      onClick={() =>
                        setFormType(formType === "login" ? "register" : "login")
                      }
                    >
                      {formType === "login" ? "Üye değil misin?" : "Zaten üyeyim"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <button
                    onClick={() => setFormType("login")}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    📥 Giriş Yap
                  </button>
                  <button
                    onClick={() => setFormType("register")}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100"
                  >
                    📝 Üye Ol
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
