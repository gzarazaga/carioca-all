import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'
import Toast from './components/common/Toast'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby/:id" element={<LobbyPage />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
      </Routes>
      <Toast />
    </>
  )
}
