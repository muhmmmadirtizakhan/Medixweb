import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mnjlloaj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        setStatus('success');
        setShowNotification(true);
        setEmail('');
        setTimeout(() => {
          setStatus('');
          setShowNotification(false);
        }, 4000);
      } else {
        setStatus('error');
        setShowNotification(true);
        setTimeout(() => {
          setStatus('');
          setShowNotification(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setShowNotification(true);
      setTimeout(() => {
        setStatus('');
        setShowNotification(false);
      }, 4000);
    }
  };

  return (
    <footer className="footer">
      {/* Toast Notification */}
      {showNotification && (
        <div className={`toast-notification ${status === 'success' ? 'toast-success' : 'toast-error'}`}>
          <div className="toast-content">
            {status === 'success' ? (
              <>
                <span className="toast-icon">✅</span>
                <div>
                  <h4>Subscribed Successfully!</h4>
                  <p>Thank you for subscribing to our newsletter.</p>
                </div>
              </>
            ) : (
              <>
                <span className="toast-icon">❌</span>
                <div>
                  <h4>Subscription Failed</h4>
                  <p>Something went wrong. Please try again.</p>
                </div>
              </>
            )}
          </div>
          <button className="toast-close" onClick={() => setShowNotification(false)}>×</button>
        </div>
      )}

      <div className="footer-container">
        {/* LEFT SIDE - NEWSLETTER */}
        <div className="footer-newsletter">
          <h1>
            Stay ahead of your
            health journey
          </h1>
          <p>
            Get expert insights, wellness guides,
            and clinic news — delivered monthly.
          </p>
          
          <form onSubmit={handleSubmit} className="subscribe-box">
            <input 
              type="email" 
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="subscribe-btn" disabled={status === 'sending'}>
              {status === 'sending' ? (
                <span className="btn-spinner"></span>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE - LINKS COLUMNS */}
        <div className="footer-links-container">
          <div className="footer-links-column">
            <h3>Quick Links</h3>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Our Team</a>
            <a href="#">Testimonials</a>
            <a href="#">Contact</a>
            <a href="#">Blogs</a>
          </div>

          <div className="footer-links-column">
            <h3>Our Services</h3>
            <a href="#">General Medicine</a>
            <a href="#">Dental Care</a>
            <a href="#">Pediatrics</a>
            <a href="#">Women's Health</a>
            <a href="#">Cardiology</a>
            <a href="#">Physiotherapy</a>
          </div>

          <div className="footer-links-column">
            <h3>Doctors</h3>
            <a href="#">Our Specialists</a>
            <a href="#">Qualifications & Expertise</a>
            <a href="#">Patient Reviews</a>
            <a href="#">Join Our Team</a>
          </div>
        </div>
      </div>

      <div className="footer-line"></div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <div className="footer-logo">
          <i className="fa-solid fa-circle-dot"></i>
          <span>MedixWeb</span>
        </div>

        <div className="footer-social">
          <a href="#" className="t-icon">𝕏</a>
          <a href="#">
            <i className="fa-brands fa-facebook-f"></i>
          </a>
          <a href="#">
            <i className="fa-brands fa-youtube"></i>
          </a>
        </div>

        <div className="footer-copyright">
          © 2025 MedixWeb. All rights reserved.<br />
          Designed with care for healthier communities.
        </div>
      </div>
    </footer>
  );
};

export default Footer;