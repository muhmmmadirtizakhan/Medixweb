const Testimonials = () => {
  return (
    <section className="testimonial-section">
      <div className="tag">✦ TESTIMONIALS</div>

      <h1 className="title">
        Real Stories, Real Healing —
        From Our Community
      </h1>

      <p className="subtitle">
        Providing patient-centered care through expert guidance,
        innovative solutions, and personalized support every step
        of the way.
      </p>

      <div className="testimonials-cards">
        {/* Left Card */}
        <div className="testimonial-card small-card">
          <div>
            <h3>Friendly staff review</h3>
            <p>
              The team made every step stress-free and
              supportive. I finally feel confident
              about my treatment.
            </p>
          </div>

          <div className="profile">
            <div className="user">
              <img 
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Robert Fox"
              />
              <div>
                <h4>Robert Fox</h4>
                <span>Regular Tester</span>
              </div>
            </div>

            <div className="icons">
              <a href="#" className="icon">
                <span className="t-icon">𝕏</span>  {/* ✅ fixed */}
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Center Card */}
        <div className="testimonial-card center-card">
          <img 
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000" 
            alt="Cody Fisher"
          />
          <div className="overlay">
            <div>
              <h4>Cody Fisher</h4>
              <span>Regular Tester</span>
            </div>
            <div className="icons">
              <a href="#" className="icon">
                <span className="t-icon">𝕏</span>  {/* ✅ fixed */}
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="testimonial-card small-card">
          <div>
            <h3>Seamless experience</h3>
            <p>
              The team made every step stress-free and
              supportive. I finally feel confident
              about my treatment.
            </p>
          </div>

          <div className="profile">
            <div className="user">
              <img 
                src="https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500" 
                alt="Albert Flores"
              />
              <div>
                <h4>Albert Flores</h4>
                <span>Regular Tester</span>
              </div>
            </div>

            <div className="icons">
              <a href="#" className="icon">
                <span className="t-icon">𝕏</span>  {/* ✅ fixed */}
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

