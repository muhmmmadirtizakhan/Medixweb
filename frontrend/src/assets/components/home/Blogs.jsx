const Blogs = () => {
  return (
    <section className="blog-section">
      <div className="blog-container">
        {/* Header */}
        <div className="blog-header">
          <span className="blog-tag">✦ LATEST INSIGHTS</span>
          <h1 className="blog-title">
            Expert Insights &<br />
            Medical Updates
          </h1>
          <p className="blog-subtitle">
            Stay informed with the latest healthcare news, expert advice, 
            and medical breakthroughs from our team of specialists.
          </p>
        </div>

        {/* Featured Blog */}
        <div className="blog-featured">
          <div className="featured-image">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800" 
              alt="Featured blog"
            />
            <span className="featured-category">FEATURED</span>
          </div>
          <div className="featured-content">
            <div className="blog-meta">
              <span><i className="fas fa-calendar-alt"></i> June 15, 2024</span>
              <span><i className="fas fa-user-md"></i> Dr. Sarah Johnson</span>
              <span><i className="fas fa-clock"></i> 5 min read</span>
            </div>
            <h2>The Future of Telemedicine: How AI is Transforming Healthcare</h2>
            <p>
              Discover how artificial intelligence and telemedicine are revolutionizing 
              patient care, making healthcare more accessible and efficient than ever before.
            </p>
            <a href="#" className="read-more">Read More →</a>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {/* Blog Card 1 */}
          <div className="blog-card">
            <div className="blog-card-image">
              <img 
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=600" 
                alt="Blog 1"
              />
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span><i className="fas fa-calendar-alt"></i> June 10, 2024</span>
                <span><i className="fas fa-user-md"></i> Dr. Michael Lee</span>
              </div>
              <h3>5 Tips for Maintaining Mental Health in a Digital Age</h3>
              <p>Learn practical strategies to protect your mental wellbeing while navigating our increasingly connected world.</p>
              <a href="#" className="read-more">Read More →</a>
            </div>
          </div>

          {/* Blog Card 2 */}
          <div className="blog-card">
            <div className="blog-card-image">
              <img 
                src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=600" 
                alt="Blog 2"
              />
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span><i className="fas fa-calendar-alt"></i> June 5, 2024</span>
                <span><i className="fas fa-user-md"></i> Dr. Emily Chen</span>
              </div>
              <h3>Understanding Preventive Care: Your Guide to Annual Checkups</h3>
              <p>Why regular health screenings matter and what to expect during your annual physical examination.</p>
              <a href="#" className="read-more">Read More →</a>
            </div>
          </div>

          {/* Blog Card 3 */}
          <div className="blog-card">
            <div className="blog-card-image">
              <img 
                src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600" 
                alt="Blog 3"
              />
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span><i className="fas fa-calendar-alt"></i> May 28, 2024</span>
                <span><i className="fas fa-user-md"></i> Dr. James Wilson</span>
              </div>
              <h3>Nutrition Myths Debunked: What Science Says About Your Diet</h3>
              <p>Separating fact from fiction in the world of nutrition and healthy eating habits.</p>
              <a href="#" className="read-more">Read More →</a>
            </div>
          </div>

          {/* Blog Card 4 */}
          <div className="blog-card">
            <div className="blog-card-image">
              <img 
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600" 
                alt="Blog 4"
              />
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span><i className="fas fa-calendar-alt"></i> May 20, 2024</span>
                <span><i className="fas fa-user-md"></i> Dr. Lisa Martinez</span>
              </div>
              <h3>The Importance of Vaccinations: Protecting Your Community</h3>
              <p>Understanding herd immunity and why vaccines remain crucial for public health.</p>
              <a href="#" className="read-more">Read More →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;