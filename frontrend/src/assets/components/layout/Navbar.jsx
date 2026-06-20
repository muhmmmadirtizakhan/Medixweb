import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDoctor = location.pathname === '/doctors';
  const { isSignedIn } = useUser()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <div className="logo-text">
          <a href="#" onClick={(e) => { e.preventDefault(); handleNav('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
            <img className="medical-logo-img"
              src="https://png.pngtree.com/png-vector/20250220/ourmid/pngtree-a-modern-heart-hand-medical-logo-design-vector-png-image_15511908.png"
              alt="MedixWeb Logo"
            />
            <span>MedixWeb</span>
          </a>
        </div>
      </div>

      <div className={`nav-menu ${menuOpen ? 'nav-menu-open' : ''}`}>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => { e.preventDefault(); isDoctor ? handleNav('/') : scrollToSection('hero'); }}>Home</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); isDoctor ? handleNav('/') : scrollToSection('about'); }}>About</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); isDoctor ? handleNav('/') : scrollToSection('services'); }}>Services</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); isDoctor ? handleNav('/') : scrollToSection('team'); }}>Our Team</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); isDoctor ? handleNav('/') : scrollToSection('testimonials'); }}>Testimonials</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); isDoctor ? handleNav('/') : scrollToSection('blogs'); }}>Blogs</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); isDoctor ? handleNav('/') : scrollToSection('footer'); }}>Contact</a></li>
        </ul>

        {isDoctor ? (
          <button className="book-btn" onClick={() => { navigate(-1); setMenuOpen(false); }}>
            ← Go Back
            <span className="arrow">←</span>
          </button>
        ) : isSignedIn ? (
          <button className="book-btn" onClick={() => handleNav('/doctors')}>
            Book Appointment
            <span className="arrow">→</span>
          </button>
        ) : (
          <SignUpButton mode="modal">
            <button className="book-btn" onClick={() => setMenuOpen(false)}>
              Sign Up
              <span className="arrow">→</span>
            </button>
          </SignUpButton>
        )}
      </div>

      {/* Profile + Hamburger grouped - always top right */}
      <div className="nav-right-controls">
        {isSignedIn && !isDoctor && (
          <div className="nav-profile">
            <UserButton afterSignOutUrl="/" />
          </div>
        )}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;