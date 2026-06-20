import { useState } from 'react';

const OurTeam = () => {
  const [badgeText, setBadgeText] = useState('Trusted Healthcare Excellence');

  const handleMouseEnter = () => {
    setBadgeText('Patient-Centered Care');
  };

  const handleMouseLeave = () => {
    setBadgeText('Trusted Healthcare Excellence');
  };

  const handleClick = () => {
    setBadgeText('Healthcare You Can Trust ✓');
    setTimeout(() => {
      setBadgeText('Trusted Healthcare Excellence');
    }, 2000);
  };

  return (
    <section className="approach-section">
      <div className="section-header">
        <span className="subtitle">✦ APPROACH</span>
        <h2 className="title">The MedixWeb Total Care™ Model</h2>
        <p className="description">
          Providing patient-centered care through expert guidance,
          innovative solutions, and personalized support every step
          of the way.
        </p>
      </div>

      <div 
        className="video-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <img
          src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=1600"
          alt="Medical Care"
        />

        <div className="stats">
          <div className="stat">24/7 Support</div>
          <div className="stat">Expert Doctors</div>
        </div>

        <div className="center-badge">
          {badgeText}
        </div>

        <div className="bottom-content">
          <p>
            Our MedixWeb™ model unites doctors, specialists,
            and wellness experts in one place. From diagnostics
            to recovery, we ensure holistic healing and long-term
            wellness through personalized, coordinated care.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;