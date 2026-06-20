import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import Navbar from './assets/components/layout/Navbar'
import Home from './assets/components/pages/Home'
import Doctors from './assets/components/home/Doctors'
import ChatWindow from './assets/components/chatbot/ChatWindow'

function App() {
  const { user, isSignedIn } = useUser()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    if (isSignedIn && user) {
      fetch(`${API_URL}/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: user.id,
          name: user.fullName || 'Guest',
          email: user.primaryEmailAddress?.emailAddress || ''
        })
      }).catch(err => console.error('User sync error:', err))
    }
  }, [isSignedIn, user])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>

      {/* Sirf ChatWindow component - iske andar hi FAB buttons hain */}
      <ChatWindow />
    </Router>
  )
}

export default App