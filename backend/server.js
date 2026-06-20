const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true })
console.log('KEY:', process.env.GROQ_API_KEY?.substring(0, 15))
const chatbotRoute = require('./routes/chatbot')
const usersRoute = require('./routes/users')
const whatsappRoute = require('./routes/whatsapp')
const emailRoute = require('./routes/email')
const app = express()
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean)
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}
app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/chatbot', chatbotRoute)
app.use('/api/users', usersRoute)
app.use('/api/whatsapp', whatsappRoute)
app.use('/api/email', emailRoute)
app.get('/', (req, res) => {
  res.send('MedixWeb Backend Running! 🏥')
})
const PORT = process.env.PORT || 5000
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
module.exports = app
