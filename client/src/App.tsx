import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Main from './pages/Main'
import Settings from './pages/Settings'
import Statistics from './pages/Statistics'

export default function App() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <Header />

      <main className="flex-grow px-4">
        <Routes>
          <Route path="/Main" element={<Main />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Statistics" element={<Statistics />} />
          <Route path="*" element={<Navigate to="/Main" />} />
        </Routes>
      </main>

      <Footer />
    </div>
    
  )
}
