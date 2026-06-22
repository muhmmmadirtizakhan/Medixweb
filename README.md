# 🏥 MedixWeb - AI-Powered Hospital Assistant & Appointment Management System

## 📌 What is MedixWeb?
 
MedixWeb is a **PERN-stack hospital web application** with a built-in AI chatbot assistant. Patients can chat naturally, describe their symptoms, get a doctor recommendation, and complete the entire appointment flow — without filling a single form.
The chatbot understands natural language (including english ), routes intent intelligently, and sends real-time WhatsApp confirmations for every action ( limits for only five contacts as we are in the free plan ) and email as well

---

<p align="center">
  <img src="https://shmsolutions.in/blog/wp-content/uploads/2025/06/features-of-hospital-management-system.jpg" />
</p>

-----
# TechStack:

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.1-F55036?style=for-the-badge)](https://groq.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com)
[![Whapi](https://img.shields.io/badge/Whapi-WhatsApp_API-25D366?style=for-the-badge&logo=whatsapp)](https://whapi.cloud)
[![Brevo](https://img.shields.io/badge/Brevo-Email-0092FF?style=for-the-badge&logo=sendinblue)](https://brevo.com)

----
 
## ✨ Features
 
### 🤖 AI Chatbot
- Symptom analysis → automatic doctor recommendation
- Natural language understanding (English others langugaes are weakley suportive like roman urdu etc)
- Two-stage AI pipeline: **Intent Classifier → Response Generator**
- Deterministic safety layer prevents hallucinated actions
- Persistent chat history per user (Supabase)

### 📅 Appointment Management
| Action | How |
|--------|-----|
| **Book** | Chat → Doctor recommended → Calendar → Time slot → Confirmed |
| **Update** | "Change my appointment" → Choose date/time/doctor → Updated |
| **Cancel** | "Cancel my appointment" → Instantly removed from DB |

----
 
### 📱 WhatsApp Confirmations
- Real-time WhatsApp messages via **Whapi.cloud**
- Three distinct message templates:
  - 🏥 Booking confirmed
  - 🔄 Appointment updated
  - ❌ Appointment cancelled
 
----

### 🔐 Authentication
- Clerk-powered auth (email/password, OAuth)
- Auto user sync from Clerk → Supabase on first login
- Per-user appointment & chat history isolation

 -------
### 🗓️ Smart Calendar
- Doctor-specific available days (parsed from timing strings)
- Time slots auto-generated from doctor schedules
- Past dates disabled, unavailable days greyed out
---
 
## 👨‍💻 Developer
 
Built by **Irtiza Khan** — Full Stack Developer
 
---
 
## ⭐ Support 💖
If you like this project, give it a ⭐ on GitHub!

---

## 🌍 Live Demo 🌐

👉 https://medixweb-x89r.vercel.app/

---
<div align="center">
*MedixWeb — Because booking a doctor shouldn't require a phone call.*
 
</div>
