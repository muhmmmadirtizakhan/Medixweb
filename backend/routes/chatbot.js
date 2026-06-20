const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
 
const express = require('express')
const router = express.Router()
const axios = require('axios')
const supabase = require('../config/supabase')
const { doctorsData, emergencyDoctors } = require('../knowledge-base/doctors-data')
 
console.log('🔑 Groq Key loaded:', process.env.GROQ_API_KEY?.substring(0, 15))
 
// ─────────────────────────────────────────
// GET — Chat History Load
// ─────────────────────────────────────────
router.get('/history/:clerk_id', async (req, res) => {
  try {
    const { clerk_id } = req.params
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('clerk_id', clerk_id)
      .order('created_at', { ascending: true })
 
    if (error) return res.status(500).json({ error })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────
// GET — Last Appointment
// ─────────────────────────────────────────
router.get('/appointment/last/:clerk_id', async (req, res) => {
  try {
    const { clerk_id } = req.params
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('clerk_id', clerk_id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) return res.status(500).json({ error })
    res.json(data[0] || null)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────
// DELETE — Cancel Appointment by ID
// ─────────────────────────────────────────
router.delete('/appointment/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) return res.status(500).json({ error })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────
// PATCH — Update Appointment
// ─────────────────────────────────────────
router.patch('/appointment/update/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { doctor_name, specialization, appointment_date, appointment_time, phone_number } = req.body

    const updateFields = {}
    if (doctor_name) updateFields.doctor_name = doctor_name
    if (specialization) updateFields.specialization = specialization
    if (appointment_date) updateFields.appointment_date = appointment_date
    if (appointment_time) updateFields.appointment_time = appointment_time
    if (phone_number) updateFields.phone_number = phone_number

    const { error } = await supabase
      .from('appointments')
      .update(updateFields)
      .eq('id', id)

    if (error) return res.status(500).json({ error })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
 
// ─────────────────────────────────────────
// POST — Send Message (Main AI Logic)
// ─────────────────────────────────────────
router.post('/message', async (req, res) => {
  try {
    const { clerk_id, user_name, user_email, message, doctor } = req.body
 
    console.log('✅ Request received:', { clerk_id, user_name, message })
 
    // ── Step 1: Save User Message ──
    const { error: saveErr } = await supabase.from('chat_history').insert({
      clerk_id,
      role: 'user',
      message
    })
    if (saveErr) console.error('❌ Save user msg error:', saveErr)
 
    // ── Step 2: Fetch Last 12 Messages for Context ──
    const { data: chatHistory, error: historyErr } = await supabase
      .from('chat_history')
      .select('role, message')
      .eq('clerk_id', clerk_id)
      .order('created_at', { ascending: true })
      .limit(12)
 
    if (historyErr) console.error('❌ History fetch error:', historyErr)
 
    const conversationMessages = (chatHistory || []).map(h => ({
      role: h.role === 'bot' ? 'assistant' : 'user',
      content: h.message
    }))
 
    // ── Step 3: Build Doctors Context ──
    const doctorsContext = doctorsData.map(d =>
      `• ${d.name} | ${d.title} | ${d.tags?.join(', ')} | Exp: ${d.experience}yrs | ${d.timing}`
    ).join('\n')
 
    const doctorContext = doctor
      ? `\n🩺 Currently discussing: ${doctor.name} (${doctor.title}) | Timing: ${doctor.timing}`
      : ''

    // ── Step 3.5: Check if user has an existing appointment ──
    const { data: existingAppt } = await supabase
      .from('appointments')
      .select('*')
      .eq('clerk_id', clerk_id)
      .order('created_at', { ascending: false })
      .limit(1)

    const lastAppointment = existingAppt?.[0] || null
    const appointmentContext = lastAppointment
      ? `\n📋 Patient has an EXISTING appointment: Dr. ${lastAppointment.doctor_name.replace('Dr. ', '')} on ${lastAppointment.appointment_date} at ${lastAppointment.appointment_time} (Status: ${lastAppointment.status})`
      : '\n📋 Patient has NO existing appointments.'
 
    // ── Step 4: CALL 1 — Intent Detection (5 categories, typo-tolerant) ──
    const intentResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        max_tokens: 5,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content: `Classify the latest message into ONE word: BOOK, DECLINE, UPDATE, CANCEL, or CONTINUE.

BOOK: user confirms booking after a doctor was already recommended (yes/haan/confirm/proceed/krdo/lelo). IMPORTANT: If the previous assistant message asked "Shall I book an appointment" or similar, and user replies with any affirmative word (yes/yeah/sure/ok/haan), this is ALWAYS BOOK.
UPDATE: user uses action words to MODIFY existing appointment (change/update/reschedule/shift/modify). NOT just checking details.
CANCEL: user wants to fully remove existing appointment (cancel/delete/remove/nahi chahiye)
DECLINE: user says no to a suggestion (no/nahi/not now/maybe later)
CONTINUE: everything else — symptoms, greetings, questions, checking appointment info, generic "book appointment" with no doctor discussed yet

RULES:
- Checking appointment info (what time/date/doctor) = CONTINUE, not UPDATE
- BOOK only if a specific doctor was recommended earlier in chat
- Tolerate typos (updste=update, apointemnt=appointment)

Reply with ONE word only.`
          },
          ...conversationMessages.slice(-8),
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
 
    let intent = intentResponse.data.choices[0].message.content
      .trim()
      .toUpperCase()
      .replace(/[^A-Z]/g, '')

    console.log('🔍 Raw intent response:', JSON.stringify(intentResponse.data.choices[0].message.content))

    const validIntents = ['BOOK', 'DECLINE', 'UPDATE', 'CANCEL', 'CONTINUE']
    if (!validIntents.includes(intent)) {
      console.log(`⚠️ Invalid intent "${intent}" received, falling back to CONTINUE`)
      intent = 'CONTINUE'
    }
    console.log('🎯 Intent detected:', intent)

    const botRecommendedDoctor = (chatHistory || []).some(
      h => h.role === 'bot' && (h.message.includes('I recommend') || h.message.includes('perfect doctor') || /Dr\.\s[A-Z]/.test(h.message))
    )

    // BOOK ko CONTINUE mein convert karo agar abhi tak koi doctor discuss nahi hua
    let finalIntent = (intent === 'BOOK' && !doctor && !botRecommendedDoctor)
      ? 'CONTINUE'
      : intent

    // UPDATE/CANCEL ko CONTINUE mein convert karo agar koi existing appointment hi nahi hai
    if ((finalIntent === 'UPDATE' || finalIntent === 'CANCEL') && !lastAppointment) {
      console.log(`Intent overridden: ${finalIntent} to CONTINUE (no existing appointment)`)
      finalIntent = 'CONTINUE'
    }

    // FIX: Short negative replies pe UPDATE ko DECLINE mein convert karo
    const isShortNegative = /^(no|nahi|nope|nah|na|nai|nothing|bas|done|shukriya|thanks|thank you|okay|ok|fine)[\s!.]*$/i.test(message.trim())
    if (finalIntent === 'UPDATE' && isShortNegative) {
      console.log('Intent overridden: UPDATE to DECLINE (short negative reply)')
      finalIntent = 'DECLINE'
    }

    if (finalIntent !== intent) {
      console.log(`⚠️ Intent overridden: ${intent}→${finalIntent}`)
    }

    // ── Step 4.5: Build ONLY the relevant instruction block for the detected intent ──
    let intentInstructions = ''

    if (finalIntent === 'BOOK') {
      intentInstructions = `
🟢 YOUR TASK RIGHT NOW (intent = BOOK):
A doctor was already discussed/recommended in this conversation, and the patient just confirmed they want to proceed.
Reply EXACTLY with this and NOTHING else:
"Great! I've found the perfect doctor for you. 📅 Please select your preferred date from the calendar to proceed."
Do NOT say "booked", "confirmed", "expect a call", "shortly", or add any other text. ONLY the line above.`
    } else if (finalIntent === 'UPDATE') {
      intentInstructions = `
🟣 YOUR TASK RIGHT NOW (intent = UPDATE):
The patient wants to modify their EXISTING appointment shown below.
Reply EXACTLY with this and NOTHING else:
"📋 Your current appointment is with ${lastAppointment ? lastAppointment.doctor_name : 'your doctor'} on ${lastAppointment ? lastAppointment.appointment_date : ''} at ${lastAppointment ? lastAppointment.appointment_time : ''}. What would you like to change — the doctor, date, or time?"
Do not add any other text. The frontend will show buttons for this.`
    } else if (finalIntent === 'CANCEL') {
      intentInstructions = `
🟠 YOUR TASK RIGHT NOW (intent = CANCEL):
Reply EXACTLY with this and NOTHING else:
"✅ Your appointment with ${lastAppointment ? lastAppointment.doctor_name : 'your doctor'} has been cancelled. Take care! 💙"
Do not add any other text. The frontend handles the actual database deletion.`
    } else if (finalIntent === 'DECLINE') {
      intentInstructions = `
🔴 YOUR TASK RIGHT NOW (intent = DECLINE):
Reply warmly with ONLY this: "No problem at all! I'm here whenever you need. Stay healthy! 💙"`
    } else {
      // CONTINUE
      intentInstructions = `
🔵 YOUR TASK RIGHT NOW (intent = CONTINUE):
You are in general conversation mode. Follow these rules based on what the patient said:

- Greetings → Greet warmly, mention you can help with appointments & symptoms.
- If user is asking/checking their appointment details (time, date, doctor) → simply reply with their appointment info clearly. Do NOT show update/cancel options.
- Generic requests like "book an appointment" or "talk to a doctor" with NO symptoms and NO doctor discussed yet → ask:
  "Sure! Tell me your symptoms and I'll recommend the right specialist right away."
  (Do NOT mention a calendar or say "I've found the perfect doctor" — no doctor has been chosen yet!)
- "Our services" or "kya services hain" → Reply EXACTLY:
  "🏥 MedixWeb Services:
  ✅ Cardiology & Heart Care
  ✅ Neurology & Brain Health
  ✅ Pediatrics & Child Care
  ✅ Dermatology & Skin
  ✅ Orthopedics & Joints
  ✅ Gastroenterology & Liver
  ✅ Psychiatry & Mental Health
  ✅ ENT & Head-Neck
  ✅ Ophthalmology & Eye Care
  ✅ Endocrinology & Diabetes
  ✅ 24/7 Emergency Unit
  Which service interests you?"
- Emergency or "emergency help" → Reply EXACTLY:
  "🚨 EMERGENCY? Call NOW:
  📞 Trauma: +1 (800) 911-CARE
  ❤️ Cardiac: +1 (800) HEART-911
  🧠 Stroke: +1 (800) STROKE-NOW
  👶 Pediatric: +1 (800) KID-EMERG
  🫁 Respiratory: +1 (800) LUNG-911
  Our team responds in 4–6 minutes. Please call immediately!"
- Symptoms described → analyze symptoms from the FULL conversation, then recommend ONE doctor:
  "Based on your symptoms, I recommend **Dr. [Name]** — [Title]
   📋 [Credentials] | ⭐ [Experience] years experience
   🕐 Available: [Timing]
   Shall I book an appointment for you?"
- If unclear → ask ONE short follow-up question only.`
    }
 
    // Small delay to avoid rate limit between 2 Groq calls
    await new Promise(resolve => setTimeout(resolve, 300))

    // ── Step 5: CALL 2 — Main AI Response ──
    const groqResponse = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        max_tokens: 200,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content: `You are Dr. MediX — the AI Medical Assistant of MedixWeb Hospital.
You are smart, empathetic, fast, and always helpful.
Patient: ${user_name} | Email: ${user_email}
${doctorContext}
${appointmentContext}

${intentInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT RESPONSE RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ MAX 5 lines — never exceed
✅ Use conversation history — NEVER forget what was discussed
✅ Always show empathy
✅ Recommend ONE doctor only — never a list
✅ NEVER give a final medical diagnosis
✅ NEVER ask more than 1 follow-up question
✅ NEVER say "I don't know" — always guide the patient
✅ For symptoms already discussed → don't ask again, use that info
✅ ONLY follow the task instructions above — do not mix in behavior from other scenarios
 
OUR SPECIALISTS:
${doctorsContext}
 
EMERGENCY 24/7 CONTACTS:
• Trauma: Dr. Michael Smith — +1 (800) 911-CARE — Response: 5 Min
• Cardiac: Dr. Sarah Williams — +1 (800) HEART-911 — Response: 4 Min
• Stroke: Dr. James Rodriguez — +1 (800) STROKE-NOW — Response: 6 Min
• Pediatric: Dr. Emily Foster — +1 (800) KID-EMERG — Response: 5 Min
• Respiratory: Dr. Robert Okonkwo — +1 (800) LUNG-911 — Response: 5 Min`
          },
          ...conversationMessages,
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
 
    console.log('✅ Groq response received!')
    const botReply = groqResponse.data.choices[0].message.content
 
    const { error: botSaveErr } = await supabase.from('chat_history').insert({
      clerk_id,
      role: 'bot',
      message: botReply
    })
    if (botSaveErr) console.error('❌ Save bot msg error:', botSaveErr)
 
    res.json({
      reply: botReply,
      intent: finalIntent,
      lastAppointment: lastAppointment
    })
 
  } catch (err) {
    console.error('❌ Error:', err.message)
    console.error('❌ Groq Error Details:', JSON.stringify(err.response?.data, null, 2))
    console.error('❌ Status:', err.response?.status)
    res.status(500).json({
      error: err.message,
      groq_error: err.response?.data || null
    })
  }
})
 
// ─────────────────────────────────────────
// POST — Save Appointment
// ─────────────────────────────────────────
router.post('/appointment', async (req, res) => {
  try {
    const {
      clerk_id,
      patient_name,
      patient_email,
      doctor_name,
      specialization,
      appointment_date,
      appointment_time,
      phone_number
    } = req.body
 
    console.log('📅 Appointment saving:', { doctor_name, appointment_date, appointment_time })
 
    const { data, error } = await supabase.from('appointments').insert({
      clerk_id,
      patient_name,
      patient_email,
      doctor_name,
      specialization,
      appointment_date,
      appointment_time,
      phone_number: phone_number || null,
      status: 'pending'
    }).select()
 
    if (error) {
      console.error('❌ Supabase error:', error)
      return res.status(500).json({ error })
    }
 
    console.log('✅ Appointment saved!')
    res.json({ success: true, data })
 
  } catch (err) {
    console.error('❌ Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────
// DELETE — Clear Chat History
// ─────────────────────────────────────────
router.delete('/history/:clerk_id', async (req, res) => {
  try {
    const { clerk_id } = req.params
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('clerk_id', clerk_id)
 
    if (error) return res.status(500).json({ error })
    res.json({ success: true, message: 'Chat history cleared.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
 
module.exports = router