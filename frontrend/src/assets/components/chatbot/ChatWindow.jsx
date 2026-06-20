import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat } from "../../../context/ChatContext"
import { useUser } from '@clerk/clerk-react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { doctorsData } from '../../../data/doctorsData'

const quickReplies = ['Book an appointment', 'Our services', 'Talk to a doctor', 'Emergency help']

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const defaultTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

const parseDoctorTiming = (timingStr) => {
  const fallback = { days: [0, 1, 2, 3, 4, 5, 6], slots: defaultTimeSlots }
  if (!timingStr || !timingStr.includes('•')) return fallback

  try {
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
    const [daysPart, timePart] = timingStr.split('•').map(s => s.trim())

    let days = []
    if (daysPart.includes('-')) {
      const [start, end] = daysPart.split('-').map(s => s.trim())
      const startIdx = dayMap[start]
      const endIdx = dayMap[end]
      if (startIdx === undefined || endIdx === undefined) return fallback
      if (startIdx <= endIdx) {
        for (let i = startIdx; i <= endIdx; i++) days.push(i)
      } else {
        for (let i = startIdx; i <= 6; i++) days.push(i)
        for (let i = 0; i <= endIdx; i++) days.push(i)
      }
    } else {
      days = daysPart.split(',').map(d => dayMap[d.trim()]).filter(d => d !== undefined)
    }
    if (days.length === 0) return fallback

    const timeMatch = timePart.match(/(\d{1,2}(?::\d{2})?)\s*(AM|PM)\s*-\s*(\d{1,2}(?::\d{2})?)\s*(AM|PM)/i)
    if (!timeMatch) return { days, slots: defaultTimeSlots }

    const [, startTime, startPeriod, endTime, endPeriod] = timeMatch
    const to24 = (time, period) => {
      let [h, m] = time.split(':').map(Number)
      m = m || 0
      if (period.toUpperCase() === 'PM' && h !== 12) h += 12
      if (period.toUpperCase() === 'AM' && h === 12) h = 0
      return h * 60 + m
    }
    const startMin = to24(startTime, startPeriod)
    const endMin = to24(endTime, endPeriod)
    if (isNaN(startMin) || isNaN(endMin) || startMin >= endMin) return { days, slots: defaultTimeSlots }

    const slots = []
    for (let t = startMin; t < endMin; t += 60) {
      let h = Math.floor(t / 60)
      const m = t % 60
      const period = h >= 12 ? 'PM' : 'AM'
      let displayH = h % 12
      if (displayH === 0) displayH = 12
      slots.push(`${displayH}:${m.toString().padStart(2, '0')} ${period}`)
    }
    return { days, slots: slots.length ? slots : defaultTimeSlots }
  } catch (err) {
    console.error('Timing parse error:', err)
    return fallback
  }
}

const ChatWindow = () => {
  const { isOpen, setIsOpen, messages, setMessages, selectedDoctor, setSelectedDoctor } = useChat()
  const { user } = useUser()

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimeSlots, setShowTimeSlots] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const [updateMode, setUpdateMode] = useState(false)
  const [updateField, setUpdateField] = useState(null)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const updateJustDone = useRef(false)

  const [awaitingPhone, setAwaitingPhone] = useState(false)
  const pendingAppointment = useRef(null)
  const savedPhoneNumber = useRef(null)

  const messagesEndRef = useRef(null)

  const { days: allowedDays, slots: timeSlots } = useMemo(
    () => parseDoctorTiming(selectedDoctor?.timing),
    [selectedDoctor]
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, isOpen])

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'bot', text }])
  }

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'user', text }])
  }

  // ── Email Notification Helper ──
  const sendEmail = (type, details) => {
    const toEmail = user?.primaryEmailAddress?.emailAddress
    if (!toEmail) return
    fetch(`${API_URL}/api/email/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to_email: toEmail, notification_type: type, ...details })
    }).catch(err => console.error('Email notify error:', err))
  }

  const formatText = (text) => {
    if (!text) return ''
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  const isDateDisabled = ({ date, view }) => {
    if (view !== 'month') return false
    return !allowedDays.includes(date.getDay())
  }

  const handleNewConversation = async () => {
    try {
      await fetch(`${API_URL}/api/chatbot/history/${user?.id}`, { method: 'DELETE' })
    } catch (err) {
      console.error('History clear error:', err)
    }
    setMessages([{ id: Date.now() + Math.random(), sender: 'bot', text: "Hi! I'm MedixWeb's assistant. How can I help you today? 😊" }])
    setSelectedDoctor(null)
    setShowCalendar(false)
    setShowTimeSlots(false)
    setSelectedDate(null)
    setUpdateMode(false)
    setUpdateField(null)
    setCurrentAppointment(null)
    updateJustDone.current = false
    setAwaitingPhone(false)
    pendingAppointment.current = null
    setInput('')
  }

  const sendToGroq = async (userMessage) => {
    setIsTyping(true)
    try {
      const res = await fetch(`${API_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: user?.id || 'guest',
          user_name: user?.fullName || 'Guest',
          user_email: user?.primaryEmailAddress?.emailAddress || '',
          message: userMessage,
          doctor: selectedDoctor
        })
      })
      const data = await res.json()
      console.log('🎯 Intent:', data.intent)

      let currentDoctor = selectedDoctor
      if (data.reply) {
        const match = data.reply.match(/Dr\.\s[A-Z][a-zA-Z'-]+\s[A-Z][a-zA-Z'-]+/)
        if (match) {
          const foundDoctor = doctorsData.find(d => d.name === match[0])
          const newDoctor = foundDoctor || { name: match[0], title: 'Specialist' }
          if (!selectedDoctor || newDoctor.name !== selectedDoctor.name) {
            currentDoctor = newDoctor
            setSelectedDoctor(newDoctor)
          }
        }
      }

      addBotMessage(data.reply)

      // Persist phone number across session if already saved before
      if (data.lastAppointment?.phone_number && !savedPhoneNumber.current) {
        savedPhoneNumber.current = data.lastAppointment.phone_number
      }

      if (data.intent === 'DECLINE') {
        setShowCalendar(false)
        setShowTimeSlots(false)
        setUpdateMode(false)
        setUpdateField(null)
        updateJustDone.current = false
      }

      if (data.intent === 'CONTINUE') {
        setShowCalendar(false)
        setShowTimeSlots(false)
        if (!updateJustDone.current) {
          setUpdateMode(false)
        }
        updateJustDone.current = false
      }

      if (data.intent === 'BOOK' && currentDoctor) {
        setTimeout(() => setShowCalendar(true), 1200)
      }

      if (data.intent === 'UPDATE' && data.lastAppointment && !updateJustDone.current) {
        setCurrentAppointment(data.lastAppointment)
        setUpdateMode(true)
        setUpdateField(null)
      }

      if (data.intent === 'CANCEL' && data.lastAppointment) {
        try {
          await fetch(`${API_URL}/api/chatbot/appointment/cancel/${data.lastAppointment.id}`, {
            method: 'DELETE'
          })
          if (data.lastAppointment.phone_number) {
            fetch(`${API_URL}/api/whatsapp/send-confirmation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone_number: data.lastAppointment.phone_number,
                notification_type: 'cancel',
                patient_name: user?.fullName || 'Patient',
                doctor_name: data.lastAppointment.doctor_name,
                appointment_date: data.lastAppointment.appointment_date,
                appointment_time: data.lastAppointment.appointment_time
              })
            })
          }
          // Email cancel notification
          sendEmail('cancel', {
            patient_name: user?.fullName || 'Patient',
            doctor_name: data.lastAppointment.doctor_name,
            appointment_date: data.lastAppointment.appointment_date,
            appointment_time: data.lastAppointment.appointment_time
          })
        } catch (err) {
          console.error('Cancel error:', err)
        }
      }

    } catch (err) {
      console.error('Chat error:', err)
      addBotMessage('Sorry, something went wrong. Please try again!')
    }
    setIsTyping(false)
  }

  const handleDateSelect = (date) => {
    if (!allowedDays.includes(date.getDay())) {
      addBotMessage(`Sorry, the doctor isn't available on that day. Please pick a day matching: ${selectedDoctor?.timing || 'their schedule'}`)
      return
    }

    setSelectedDate(date)
    setShowCalendar(false)
    const formatted = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    addUserMessage(`Selected date: ${formatted}`)

    if (updateMode && updateField === 'date' && currentAppointment) {
      setIsTyping(true)
      setTimeout(async () => {
        try {
          await fetch(`${API_URL}/api/chatbot/appointment/update/${currentAppointment.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              appointment_date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            })
          })
          addBotMessage(`✅ Appointment date updated to **${formatted}**!\n\nIs there anything else you'd like to change?`)
          // Email update notification
          sendEmail('update', {
            patient_name: user?.fullName || 'Patient',
            doctor_name: currentAppointment.doctor_name,
            appointment_date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            appointment_time: currentAppointment.appointment_time
          })
        } catch (err) {
          addBotMessage('Sorry, could not update the date.')
        }
        updateJustDone.current = true
        setUpdateMode(false)
        setUpdateField(null)
        setIsTyping(false)
      }, 800)
      return
    }

    setIsTyping(true)
    setTimeout(() => {
      addBotMessage(`Perfect! You selected **${formatted}**. Now please choose a time slot:`)
      setShowTimeSlots(true)
      setIsTyping(false)
    }, 800)
  }

  const handleTimeSelect = async (time) => {
    setShowTimeSlots(false)
    addUserMessage(`Selected time: ${time}`)
    setIsTyping(true)

    if (updateMode && updateField === 'time' && currentAppointment) {
      try {
        await fetch(`${API_URL}/api/chatbot/appointment/update/${currentAppointment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointment_time: time })
        })
        addBotMessage(`✅ Appointment time updated to **${time}**!\n\nIs there anything else you'd like to change?`)
        // Email update notification
        sendEmail('update', {
          patient_name: user?.fullName || 'Patient',
          doctor_name: currentAppointment.doctor_name,
          appointment_date: currentAppointment.appointment_date,
          appointment_time: time
        })
      } catch (err) {
        addBotMessage('Sorry, could not update the time.')
      }
      updateJustDone.current = true
      setUpdateMode(false)
      setUpdateField(null)
      setIsTyping(false)
      return
    }

    let savedAppointmentId = null
    try {
      const apptRes = await fetch(`${API_URL}/api/chatbot/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerk_id: user?.id || 'guest',
          patient_name: user?.fullName || 'Guest',
          patient_email: user?.primaryEmailAddress?.emailAddress || '',
          doctor_name: selectedDoctor?.name || 'Unknown',
          specialization: selectedDoctor?.title || 'Specialist',
          appointment_date: selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          appointment_time: time,
          phone_number: null
        })
      })
      const apptData = await apptRes.json()
      savedAppointmentId = apptData?.data?.[0]?.id || null
    } catch (err) {
      console.error('Appointment save error:', err)
    }

    setTimeout(() => {
      const dateStr = selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      const docName = selectedDoctor?.name || 'our specialist'
      addBotMessage(`✅ Appointment Confirmed!\n\n👨‍⚕️ Doctor: ${docName}\n📅 Date: ${dateStr}\n⏰ Time: ${time}\n\nA confirmation will be sent to ${user?.primaryEmailAddress?.emailAddress || 'your email'}. See you soon! 🏥`)
      setIsTyping(false)

      // Email book confirmation
      sendEmail('book', {
        patient_name: user?.fullName || 'Patient',
        doctor_name: docName,
        appointment_date: dateStr,
        appointment_time: time
      })

      pendingAppointment.current = {
        appointment_id: savedAppointmentId,
        patient_name: user?.fullName || 'Patient',
        doctor_name: docName,
        appointment_date: dateStr,
        appointment_time: time
      }

      if (savedPhoneNumber.current) {
        // Phone already known — reuse it, no need to ask again
        const phoneClean = savedPhoneNumber.current
        if (savedAppointmentId) {
          fetch(`${API_URL}/api/chatbot/appointment/update/${savedAppointmentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: phoneClean })
          }).catch(() => {})
        }
        fetch(`${API_URL}/api/whatsapp/send-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: phoneClean,
            notification_type: 'book',
            ...pendingAppointment.current
          })
        }).catch(() => {})
        pendingAppointment.current = null
      } else {
        setTimeout(() => {
          addBotMessage('📱 Please share your WhatsApp number to receive appointment confirmation!')
          setAwaitingPhone(true)
        }, 1000)
      }
    }, 1000)
  }

  const handleUpdateChoice = (choice) => {
    setUpdateField(choice)
    if (choice === 'doctor') {
      addUserMessage('Change doctor')
      addBotMessage('Sure! Please describe your symptoms and I will recommend the right specialist for you.')
      setUpdateMode(false)
      setUpdateField(null)
      setSelectedDoctor(null)
    } else if (choice === 'date') {
      addUserMessage('Change date')
      addBotMessage(`📅 Please select your new preferred date. Available: ${selectedDoctor?.timing || 'check schedule'}`)
      setShowCalendar(true)
    } else if (choice === 'time') {
      addUserMessage('Change time')
      addBotMessage('⏰ Please select your new preferred time:')
      setShowTimeSlots(true)
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return

    if (awaitingPhone) {
      const phoneRegex = /^[+]?[\d\s\-]{10,15}$/
      if (!phoneRegex.test(text.trim())) {
        addUserMessage(text)
        setInput('')
        addBotMessage('❌ Invalid number. Please enter a valid WhatsApp number (e.g. 923001234567)')
        return
      }

      addUserMessage(text)
      setInput('')
      setAwaitingPhone(false)
      setIsTyping(true)

      try {
        const phoneClean = text.trim()
        savedPhoneNumber.current = phoneClean

        if (pendingAppointment.current?.appointment_id) {
          await fetch(`${API_URL}/api/chatbot/appointment/update/${pendingAppointment.current.appointment_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: phoneClean })
          })
        }

        await fetch(`${API_URL}/api/whatsapp/send-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: phoneClean,
            notification_type: 'book',
            ...pendingAppointment.current
          })
        })
        addBotMessage('✅ WhatsApp confirmation sent! Check your WhatsApp. 💬')
      } catch (err) {
        addBotMessage('⚠️ Could not send WhatsApp message. Please try again later.')
      }
      pendingAppointment.current = null
      setIsTyping(false)
      return
    }

    addUserMessage(text)
    setInput('')
    sendToGroq(text)
  }

  const openWhatsApp = () => {
    window.open('https://wa.me/923001234567?text=Hi%20MedixWeb%2C%20I%20need%20assistance', '_blank')
  }

  return (
    <div className="mw-chat-root">
      {isOpen && (
        <div className="mw-chat-window">
          <div className="mw-chat-header">
            <div className="mw-chat-header-info">
              <div className="mw-chat-avatar">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div>
                <h4>MedixWeb Assistant</h4>
                <span className="mw-chat-status">
                  <span className="mw-status-dot"></span> Online
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="mw-new-chat-btn" onClick={handleNewConversation} title="New Conversation">
                <i className="fas fa-plus"></i>
              </button>
              <button className="mw-whatsapp-btn" onClick={openWhatsApp}>
                <i className="fab fa-whatsapp"></i>
              </button>
              <button className="mw-chat-close" onClick={() => setIsOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="mw-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`mw-msg-row ${msg.sender === 'user' ? 'mw-msg-user' : 'mw-msg-bot'}`}>
                {msg.sender === 'bot' && (
                  <div className="mw-msg-avatar"><i className="fas fa-heartbeat"></i></div>
                )}
                <div className="mw-msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="mw-msg-row mw-msg-bot">
                <div className="mw-msg-avatar"><i className="fas fa-heartbeat"></i></div>
                <div className="mw-msg-bubble mw-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {updateMode && !updateField && (
              <div className="mw-update-choices">
                <button className="mw-update-btn" onClick={() => handleUpdateChoice('doctor')}>
                  👨‍⚕️ Change Doctor
                </button>
                <button className="mw-update-btn" onClick={() => handleUpdateChoice('date')}>
                  📅 Change Date
                </button>
                <button className="mw-update-btn" onClick={() => handleUpdateChoice('time')}>
                  ⏰ Change Time
                </button>
              </div>
            )}

            {showCalendar && (
              <div className="mw-calendar-wrap">
                {selectedDoctor?.timing && (
                  <div className="mw-calendar-note">
                    🗓️ Available: {selectedDoctor.timing}
                  </div>
                )}
                <Calendar
                  onChange={handleDateSelect}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={isDateDisabled}
                />
              </div>
            )}

            {showTimeSlots && (
              <div className="mw-time-slots">
                {timeSlots.map((time, i) => (
                  <button key={i} className="mw-time-btn" onClick={() => handleTimeSelect(time)}>
                    {time}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="mw-quick-replies">
              {quickReplies.map((q) => (
                <button key={q} className="mw-quick-btn" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          )}

          <form className="mw-chat-input-row" onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="mw-send-btn">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      <div className="mw-fab-container">
        <button className="mw-whatsapp-fab" onClick={openWhatsApp}>
          <i className="fab fa-whatsapp"></i>
        </button>
        <button
          className={`mw-chat-fab ${isOpen ? 'mw-chat-fab-open' : ''}`}
          onClick={() => setIsOpen(prev => !prev)}
        >
          {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-heartbeat"></i>}
        </button>
      </div>
    </div>
  )
}

export default ChatWindow