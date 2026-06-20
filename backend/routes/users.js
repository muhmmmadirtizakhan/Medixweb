const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// ─────────────────────────────────────────
// POST — Sync Clerk User to Supabase
// Agar user already exists (clerk_id se) toh
// kuch nahi karega, naya hai toh insert karega.
// ─────────────────────────────────────────
router.post('/sync', async (req, res) => {
  try {
    const { clerk_id, name, email } = req.body

    if (!clerk_id) {
      return res.status(400).json({ error: 'clerk_id is required' })
    }

    // Check karo user already exists ya nahi
    const { data: existingUser, error: fetchErr } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerk_id)
      .maybeSingle()

    if (fetchErr) {
      console.error('❌ User fetch error:', fetchErr)
      return res.status(500).json({ error: fetchErr })
    }

    // Agar already hai toh kuch mat karo
    if (existingUser) {
      return res.json({ success: true, message: 'User already exists', user: existingUser })
    }

    // Naya user insert karo
    const { data, error } = await supabase
      .from('users')
      .insert({ clerk_id, name, email })
      .select()

    if (error) {
      console.error('❌ User insert error:', error)
      return res.status(500).json({ error })
    }

    console.log('✅ New user synced:', clerk_id)
    res.json({ success: true, message: 'User created', user: data[0] })

  } catch (err) {
    console.error('❌ Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router