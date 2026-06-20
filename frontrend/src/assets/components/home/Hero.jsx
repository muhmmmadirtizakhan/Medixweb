const Hero = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80;
      const elementPosition = section.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="hero-content">
        <div className="hero-top">
          <div className="trust-badge">
            <div className="avatars">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="happy patient" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="happy patient" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="happy patient" />
              <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="happy patient" />
            </div>
            <span>Trusted by 135k+ people</span>
          </div>

          <h1>
            Your Trusted<br />
            Partner in Modern<br />
            Healthcare
          </h1>

          <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }} className="hero-btn">
            Explore Services <i className="fas fa-arrow-right" style={{ marginLeft: '10px', fontSize: '14px' }}></i>
          </a>
        </div>

        <br />

        <div className="hero-bottom">
          <p>
            Accessible, modern medical care — where technology meets compassion. 
            Book appointments, view reports, and stay healthy from anywhere.
          </p>
        </div>
      </div>

      <div className="stats-card">
        <span><i className="fas fa-heartbeat" style={{ marginRight: '5px' }}></i> Trusted Care Rate</span>
        <h2>97%</h2>
        <p>
          Our patients trust us and are consistently satisfied with our treatment & support.
        </p>
        <div className="trust-features">
          <div className="feature-tag"><i className="fas fa-hands-helping"></i> Caring</div>
          <div className="feature-tag"><i className="fas fa-user-check"></i> Personalized</div>
          <div className="feature-tag"><i className="fas fa-shield-alt"></i> Reliable</div>
        </div>
        <div className="sub-badge">
          <small><i className="fas fa-chart-line"></i> +24% recovery rate</small>
          <small><i className="fas fa-calendar-alt"></i> instant booking</small>
        </div>
      </div>
    </>
  );
};

export default Hero;