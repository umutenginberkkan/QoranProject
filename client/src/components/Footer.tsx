export default function Footer() {
  return (
    <footer className="w-full bg-red-800 text-white py-4 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
        
        <p>&copy; {new Date().getFullYear()} Kur’an Okuma Uygulaması</p>

        <div className="flex gap-4">
          <a href="/hakkinda" className="hover:underline">
            Hakkında
          </a>
          <a href="/gizlilik" className="hover:underline">
            Gizlilik
          </a>
        </div>

      </div>
    </footer>
  )
}
