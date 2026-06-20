import { useState } from 'react';
import Footer from '../layout/Footer';
import { useChat } from '../../../context/ChatContext';
import { doctorsData, emergencyDoctors } from '../../../data/doctorsData';

const Toast = ({ toasts, removeToast }) => (
  <div className="dc-toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`dc-toast dc-toast-${t.type}`}>
        <div className="dc-toast-icon">
          {t.type === 'success' && <i className="fas fa-check-circle"></i>}
          {t.type === 'emergency' && <i className="fas fa-ambulance"></i>}
        </div>
        <div className="dc-toast-content">
          <div className="dc-toast-title">{t.title}</div>
          <div className="dc-toast-message">{t.message}</div>
        </div>
        <div className="dc-toast-close" onClick={() => removeToast(t.id)}>
          <i className="fas fa-times"></i>
        </div>
      </div>
    ))}
  </div>
);

const Doctors = () => {
  const { openWithDoctor } = useChat()
  const [mode, setMode] = useState('normal');
  const [calledId, setCalledId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message, type) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleBook = (doc) => {
    openWithDoctor(doc)
  };

  const handleCall = (name, hotline, idx) => {
    setCalledId(idx);
    addToast('Emergency Response Activated', `${name} is being notified. Hotline: ${hotline}`, 'emergency');
    setTimeout(() => setCalledId(null), 3000);
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />

      <section className={`dc-hero ${mode === 'emergency' ? 'dc-hero-emergency' : 'dc-hero-normal'}`}>
        <div className="dc-hero-bg"></div>
        <div className="dc-hero-overlay"></div>
        <div className="dc-hero-content">
          <div className={`dc-hero-badge ${mode === 'emergency' ? 'dc-badge-emergency' : ''}`}>
            {mode === 'emergency' ? '24/7 EMERGENCY NETWORK' : 'Trusted Medical Network'}
          </div>
          <h1>
            {mode === 'emergency'
              ? <><span>Critical Care</span><br />When Every Second Counts</>
              : <><span>Expert Doctors</span><br />For Every Need</>}
          </h1>
          <p className="dc-hero-desc">
            {mode === 'emergency'
              ? 'Our emergency response team of 6 board-certified specialists is ready 24/7.'
              : 'Connect with 12+ board-certified specialists across cardiology, neurology, pediatrics, and emergency care.'}
          </p>
          <div className="dc-hero-stats">
            {mode === 'emergency' ? (
              <>
                <div className="dc-hero-stat"><div className="dc-stat-num">6+</div><div className="dc-stat-label">ER Specialists</div></div>
                <div className="dc-hero-stat"><div className="dc-stat-num">5 Min</div><div className="dc-stat-label">Response Time</div></div>
                <div className="dc-hero-stat"><div className="dc-stat-num">24/7</div><div className="dc-stat-label">Rapid Response</div></div>
              </>
            ) : (
              <>
                <div className="dc-hero-stat"><div className="dc-stat-num">12+</div><div className="dc-stat-label">Specialists</div></div>
                <div className="dc-hero-stat"><div className="dc-stat-num">24/7</div><div className="dc-stat-label">Emergency Care</div></div>
                <div className="dc-hero-stat"><div className="dc-stat-num">10k+</div><div className="dc-stat-label">Patients Served</div></div>
              </>
            )}
          </div>
          <div className="dc-hero-btns">
            {mode === 'emergency' ? (
              <>
                <button className="dc-btn-back" onClick={() => setMode('normal')}>← Back to Specialists</button>
                <button className="dc-btn-outline-white" onClick={() => addToast('Emergency Helpline', '1-800-EMER-CARE | Available 24/7', 'emergency')}>Emergency Hotline</button>
              </>
            ) : (
              <>
                <button className="dc-btn-primary" onClick={() => document.getElementById('dc-cards').scrollIntoView({ behavior: 'smooth' })}>Find a Doctor →</button>
                <button className="dc-btn-outline-white" onClick={() => setMode('emergency')}>Emergency Support</button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="dc-section" id="dc-cards">
        <div className="dc-section-header">
          <h2 style={{ color: mode === 'emergency' ? '#8b1a1a' : '#1c6d8c' }}>
            {mode === 'emergency' ? 'Emergency Response Team' : 'Our Medical Specialists'}
          </h2>
          <p>{mode === 'emergency' ? '6 critical care specialists | Ready 24/7' : '12 distinguished doctors | Verified credentials | Same-day appointments'}</p>
        </div>

        <div className="dc-cards-grid">
          {mode === 'normal' ? doctorsData.map((doc, idx) => (
            <div className="dc-card" key={idx}>
              <div className="dc-img-wrap">
                <img src={doc.image} alt={doc.name} />
                <div className="dc-exp-badge">{doc.experience}+ Years Experience</div>
                <div className="dc-timing-badge">{doc.timing}</div>
                <div className="dc-img-overlay"><h2>{doc.name}</h2><p>{doc.title}</p></div>
              </div>
              <div className="dc-card-body">
                <div className="dc-credentials">{doc.credentials.map((c, i) => <span key={i}>{c}</span>)}</div>
                <div className="dc-spec-box"><h4>{doc.specialization}</h4><p>{doc.specializationDesc}</p></div>
                <div className="dc-tags">{doc.tags.map((t, i) => <span key={i}>{t}</span>)}</div>
                <div className="dc-stats-grid">
                  <div className="dc-stat-box"><h3>{doc.patients}</h3><p>Patients</p></div>
                  <div className="dc-stat-box"><h3>{doc.rating}</h3><p>Rating</p></div>
                  <div className="dc-stat-box"><h3>{doc.experience}+</h3><p>Years Exp</p></div>
                </div>
                <div className="dc-trust">✓ {doc.trustLine}</div>
                <button className="dc-book-btn" onClick={() => handleBook(doc)}>
                  Book Appointment
                  <div className="dc-btn-arrow">→</div>
                </button>
              </div>
            </div>
          )) : emergencyDoctors.map((doc, idx) => (
            <div className="dc-emg-card" key={idx}>
              <div className="dc-emg-img-wrap">
                <img src={doc.image} alt={doc.name} />
                <div className="dc-emg-overlay"></div>
                <div className="dc-alert-badge">EMERGENCY RESPONSE</div>
                <div className="dc-online-badge">24/7 ACTIVE</div>
                <div className="dc-emg-info"><h2>{doc.name}</h2><p>{doc.title}</p></div>
              </div>
              <div className="dc-emg-body">
                <div className="dc-coverage"><h4>{doc.coverage}</h4><p>{doc.coverageDesc}</p></div>
                <div className="dc-emg-tags">{doc.tags.map((t, i) => <span key={i}>{t}</span>)}</div>
                <div className="dc-emg-stats">
                  <div className="dc-emg-stat"><h3>{doc.response}</h3><p>Response</p></div>
                  <div className="dc-emg-stat"><h3>{doc.available}</h3><p>Available</p></div>
                  <div className="dc-emg-stat"><h3>{doc.cases}</h3><p>Cases</p></div>
                </div>
                <div className="dc-hotline"><small>Emergency Hotline</small><strong>{doc.hotline}</strong></div>
                <button className="dc-emg-btn" onClick={() => handleCall(doc.name, doc.hotline, idx)}>
                  {calledId === idx ? 'Connecting Emergency Team...' : 'Emergency Consultation'}
                  <div className="dc-emg-icon">
                    {calledId === idx ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-phone-alt"></i>}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Doctors;