import { useState } from 'react';

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const statsData = [
    { number: "50+", desc: "Healthcare Professionals Supporting Lives Worldwide" },
    { number: "12k+", desc: "Happy Patients Successfully Treated" },
    { number: "98%", desc: "Patient Satisfaction Rate Across Global Network" }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + statsData.length) % statsData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % statsData.length);
  };

  return (
    <section className="medix-about-section">
      <div className="medix-container">
        
        {/* LEFT COLUMN */}
        <div className="left-col">
          <span className="about-us-title">✦ ABOUT US</span>
          
          <div className="about-description">
            <h3 className="about-heading">Revolutionizing Healthcare<br />with Technology & Compassion</h3>
            <p className="about-text">
              At MedixWeb, we believe that quality healthcare should be accessible to everyone. 
              Our platform bridges the gap between patients and healthcare providers, offering 
              seamless digital solutions for modern medical needs.
            </p>
          </div>

          <div className="impact-section">
            <div className="impact-box">
              <span className="tag">Our Impact</span>
              <div className="carousel-nav">
                <button className="nav-btn prev" onClick={handlePrev}>←</button>
                <button className="nav-btn next" onClick={handleNext}>→</button>
              </div>
            </div>
            
            <div className="stats-counter">
              <h2>{statsData[currentIndex].number}</h2>
              <p>{statsData[currentIndex].desc}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">
          
          {/* Intro: Doctor Image + Text side by side */}
          <div className="intro-content">
            <div className="profile-img-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1622253694238-3b22139576c6?auto=format&fit=crop&w=280&h=350&q=80" 
                alt="MedixWeb Doctor" 
                className="profile-img"
              />
            </div>
            <div className="intro-text">
              <p className="main-text">
                MedixWeb Clinic connects doctors and patients effortlessly, providing smarter, safer, and compassionate healthcare from diagnosis to full recovery.
              </p>
              <p className="sub-text">
                Our mission is to transform healthcare delivery through innovative technology, 
                making medical services more accessible, efficient, and patient-centered.
              </p>
            </div>
          </div>

          {/* Cards - Sirf 2 cards (Smart Care aur Secure Data) */}
          <div className="cards-wrapper">
            <div className="cards-row">
              {/* Card 1: Smart Care */}
              <div className="refined-card">
                <div className="top-row">
                  <div className="icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 21s-7-4.438-7-11a4 4 0 0 1 7-2.646A4 4 0 0 1 19 10c0 6.562-7 11-7 11z" fill="#c2e3f0" stroke="#1d8db8"/>
                      <circle cx="12" cy="10" r="3" fill="#fff" stroke="#1d8db8"/>
                    </svg>
                  </div>
                  <div className="badge">Connected Care</div>
                </div>
                <h3>Smart Care</h3>
                <div className="content-box">
                  <p>Smart digital health tracking ensures accurate insights and better outcomes for every patient.</p>
                </div>
              </div>
              
              {/* Card 2: Secure Data */}
              <div className="refined-card">
                <div className="top-row">
                  <div className="icon-circle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L5 5v6c0 5.25 3.438 10.125 7 11 3.563-.875 7-5.75 7-11V5l-7-3z" fill="#cdeef9" stroke="#1d8db8"/>
                      <path d="M12 9v4M12 17h.01" stroke="#1d8db8" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="badge">Data Privacy</div>
                </div>
                <h3>Secure Data</h3>
                <div className="content-box">
                  <p>Protecting patient data through secure, HIPAA-compliant digital health systems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;