const express = require('express')
const router = express.Router()
const axios = require('axios')

const WHAPI_URL = process.env.WHAPI_URL || 'https://gate.whapi.cloud'
const WHAPI_TOKEN = process.env.WHAPI_TOKEN

const sendWhapi = async (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, '')
  await axios.post(
    `${WHAPI_URL}/messages/text`,
    {
      to: `${cleanPhone}@s.whatsapp.net`,
      body: message
    },
    {
      headers: {
        Authorization: `Bearer ${WHAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  )
}

// ─────────────────────────────────────────
// POST — Send WhatsApp Notification
// ─────────────────────────────────────────
router.post('/send-confirmation', async (req, res) => {
  try {
    const { phone_number, patient_name, doctor_name, appointment_date, appointment_time, notification_type } = req.body

    let message = ''

    if (notification_type === 'cancel') {
      message = `❌ *Appointment Cancelled*

👤 Patient: ${patient_name}
👨‍⚕️ Doctor: ${doctor_name}
📅 Date: ${appointment_date}
⏰ Time: ${appointment_time}

Your appointment has been cancelled. We hope to see you soon! 💙
*MedixWeb Hospital*`

    } else if (notification_type === 'update') {
      message = `🔄 *Appointment Updated!*

👤 Patient: ${patient_name}
👨‍⚕️ Doctor: ${doctor_name}
📅 New Date: ${appointment_date}
⏰ New Time: ${appointment_time}

Your appointment has been successfully updated! 💙
*MedixWeb Hospital*`

    } else {
      message = `🏥 *Appointment Confirmed!*

👤 Patient: ${patient_name}
👨‍⚕️ Doctor: ${doctor_name}
📅 Date: ${appointment_date}
⏰ Time: ${appointment_time}

Thank you for choosing MedixWeb! 💙
Please arrive 10 minutes early.
*MedixWeb Hospital*`
    }

    await sendWhapi(phone_number, message)
    console.log(`✅ WhatsApp [${notification_type || 'book'}] sent to:`, phone_number)
    res.json({ success: true })

  } catch (err) {
    console.error('❌ WhatsApp error:', err.response?.data || err.message)
    res.status(500).json({ error: err.response?.data || err.message })
  }
})

module.exports = router