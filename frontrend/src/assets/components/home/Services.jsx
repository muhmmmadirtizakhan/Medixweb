import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const content = [
    {
      title: "Compassionate care focused on every patient's wellbeing and long-term health journey.",
      image: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=800",
      small: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300"
    },
    {
      title: "Collaboration between healthcare specialists ensures better treatment outcomes.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
      small: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300"
    },
    {
      title: "Transparency builds trust through clear communication and ethical practices.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800",
      small: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300"
    },
    {
      title: "Flexible healthcare solutions tailored to each patient's unique needs.",
      image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
      small: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300"
    },
    {
      title: "Excellence driven by innovation, expertise and world-class medical standards.",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800",
      small: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300"
    }
  ];

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  const values = ["Compassion", "Collaboration", "Transparency", "Flexibility", "Excellence"];

  return (
    <>
      <div className="blob-extra"></div>

      <section className="values-section">
        <div className="top-content">
          <div>
            <span className="subtitle">✦ WHY CHOOSE US</span>
            <h1 className="title">A Simplified Path to<br />Comprehensive Medical Care</h1>
          </div>
          <p className="desc">
            Providing patient-centered care through expert guidance, innovative solutions, and personalized support every step of the way.
          </p>
        </div>

        <div className="main-grid">
          {/* LEFT PANEL */}
          <div className="values-panel">
            <div className="list-header">
              <span>Values List</span>
              <span id="counter">{String(activeIndex + 1).padStart(2, '0')}/05</span>
            </div>
            <ul className="values-list">
              {values.map((value, idx) => (
                <li
                  key={idx}
                  className={activeIndex === idx ? "active" : ""}
                  onClick={() => handleItemClick(idx)}
                >
                  {value}
                </li>
              ))}
            </ul>
            <div className="floating-card">
              <img
                id="smallImage"
                src={content[activeIndex].small}
                alt="floating"
              />
            </div>
            <button className="book-btn" onClick={() => navigate('/doctors')}>
              Book Appointment
              <div className="arrow">→</div>
            </button>
          </div>

          {/* CENTER IMAGE */}
          <div className="image-card">
            <img
              id="mainImage"
              src={content[activeIndex].image}
              alt="medical care"
              className={activeIndex !== undefined ? "" : "fade"}
            />
          </div>

          {/* RIGHT BLUE CARD */}
          <div className="blue-card">
            <h2 id="cardTitle">{content[activeIndex].title}</h2>
            <div className="tags">
              {values.map((tag, idx) => (
                <div key={idx} className="tag">{tag}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;