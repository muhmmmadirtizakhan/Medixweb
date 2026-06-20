const ChatMessage = ({ message }) => {
  const isBot = message.type === 'bot'

  return (
    <div className={`chat-msg ${isBot ? 'bot' : 'user'}`}>
      {isBot && (
        <div className="msg-avatar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      )}
      <div className="msg-content">
        <div className="msg-bubble">{message.text}</div>
        <div className="msg-time">{message.time}</div>
      </div>
    </div>
  )
}

export default ChatMessage