const express = require('express')
const router = express.Router()
const axios = require('axios')

const BREVO_API_KEY = process.env.BREVO_API_KEY
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'irtizakhan844@gmail.com'
const SENDER_NAME = 'MedixWeb Hospital'

router.post('/send-confirmation', async (req, res) => {
  try {
    const { to_email, patient_name, doctor_name, appointment_date, appointment_time, notification_type } = req.body

    if (!to_email) {
      return res.status(400).json({ error: 'No email provided' })
    }

    console.log('📧 Email request:', { to_email, patient_name, doctor_name, notification_type })

    const safeName = patient_name && patient_name.trim() ? patient_name : 'Patient'

    let subject = ''
    let htmlContent = ''

    if (notification_type === 'cancel') {
      subject = '❌ Appointment Cancelled - MedixWeb'
      htmlContent = `
        <h2 style="color:#e53935;">Appointment Cancelled</h2>
        <p>Dear ${patient_name},</p>
        <p>Your appointment has been cancelled:</p>
        <ul>
          <li><b>Doctor:</b> ${doctor_name}</li>
          <li><b>Date:</b> ${appointment_date}</li>
          <li><b>Time:</b> ${appointment_time}</li>
        </ul>
        <p>We hope to see you soon! 💙</p>
        <p><b>MedixWeb Hospital</b></p>`
    } else if (notification_type === 'update') {
      subject = '🔄 Appointment Updated - MedixWeb'
      htmlContent = `
        <h2 style="color:#2b87af;">Appointment Updated</h2>
        <p>Dear ${patient_name},</p>
        <p>Your appointment has been successfully updated:</p>
        <ul>
          <li><b>Doctor:</b> ${doctor_name}</li>
          <li><b>New Date:</b> ${appointment_date}</li>
          <li><b>New Time:</b> ${appointment_time}</li>
        </ul>
        <p><b>MedixWeb Hospital</b></p>`
    } else {
      subject = '✅ Appointment Confirmed - MedixWeb'
      htmlContent = `
        <h2 style="color:#22c55e;">Appointment Confirmed!</h2>
        <p>Dear ${patient_name},</p>
        <p>Thank you for booking with MedixWeb. Your appointment details:</p>
        <ul>
          <li><b>Doctor:</b> ${doctor_name}</li>
          <li><b>Date:</b> ${appointment_date}</li>
          <li><b>Time:</b> ${appointment_time}</li>
        </ul>
        <p>Please arrive 10 minutes early.</p>
        <p><b>MedixWeb Hospital</b></p>`
    }

    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: to_email, name: safeName }],
        subject,
        htmlContent
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log(`✅ Email [${notification_type || 'book'}] sent to:`, to_email)
    res.json({ success: true })

  } catch (err) {
    console.error('❌ Email error:', JSON.stringify(err.response?.data || err.message))
    res.status(500).json({ error: err.response?.data || err.message })
  }
})

module.exports = router