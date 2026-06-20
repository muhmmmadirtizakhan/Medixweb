import { createContext, useContext, useState } from 'react'

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi! I'm MedixWeb's assistant. How can I help you today?",
    }
  ])

  const openWithDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setIsOpen(true)
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: `Hi! I see you'd like to book an appointment with **${doctor.name}** (${doctor.title}). Shall we proceed? 🏥`,
      }
    ])
  }

  return (
    <ChatContext.Provider value={{
      isOpen, setIsOpen,
      selectedDoctor, setSelectedDoctor,
      messages, setMessages,
      openWithDoctor
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)