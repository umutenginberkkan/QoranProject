export default function Statistics() {
  const exampleStats = [
    { tarih: '2025-06-24', sayfa: 441, sure: 'Yasin', süre: '5 dk' },
    { tarih: '2025-06-23', sayfa: 1, sure: 'Fatiha', süre: '1 dk' },
    { tarih: '2025-06-22', sayfa: 255, sure: 'Bakara', süre: '10 dk' },
  ]

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">İstatistikler</h1>

      <table className="w-full text-sm text-left border-collapse border">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="border px-4 py-2">Tarih</th>
            <th className="border px-4 py-2">Sayfa</th>
            <th className="border px-4 py-2">Sure</th>
            <th className="border px-4 py-2">Okuma Süresi</th>
          </tr>
        </thead>
        <tbody>
          {exampleStats.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{item.tarih}</td>
              <td className="border px-4 py-2">{item.sayfa}</td>
              <td className="border px-4 py-2">{item.sure}</td>
              <td className="border px-4 py-2">{item.süre}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-gray-500 mt-4">Veriler örnek amaçlıdır. Gerçek kullanıcı verileri ileride burada gösterilecektir.</p>
    </div>
  )
}
