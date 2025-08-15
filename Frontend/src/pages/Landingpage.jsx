import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigateTo = (page) => {
    const urls = {
      login: "/login",
      admin: "/admin",
      results: "/check-result",
    };
    if (urls[page]) {
      window.location.href = urls[page];
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header" id="header">
        <div className="container">
          <div className="nav-brand">
            <div className="logo">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="brand-text">TECHUNIVERSITY</div>
          </div>

          <nav className="nav-menu">
            <a href="#about">About</a>
            <a href="#admin">Admin</a>
            <a href="#result">Results</a>
          </nav>

          <button className="mobile-menu-btn">
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="container">
          <div className="hero-content ">
            <div className="hero-left">
              <h1 className="hero-welcome">Welcome.</h1>
            </div>

            <div className="hero-right">
              <h2 className="hero-subtitle">Landing page.</h2>
              <p className="hero-description">
                Empowering education with decentralized innovation and secure
                digital infrastructure. Experience the future of academic
                credential management with blockchain technology.
              </p>
            </div>
          </div>
        </div>

        {/* Abstract Graphics */}
        <div className="abstract-graphics">
          <div className="flowing-lines"></div>
        </div>

        {/* Floating Particles */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </section>

      {/* Quick Access Cards */}
      <section className="quick-access" id="admin">
        <div className="container">
          <div className="quick-access ">
            <div
              className="access-card"
              onClick={() => navigateTo("admin")}
            >
              <div className="card-icon orange">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Admin Panel</h3>
              <p>
                Comprehensive administrative dashboard for result management
              </p>
              <span className="card-btn" id="result">
                Access <i className="fas fa-arrow-right"></i>
              </span>
            </div>

            <div
              className="access-card"
              onClick={() => navigateTo("results")}
            >
              <div className="card-icon purple">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3>Check Results</h3>
              <p>
                Instantly verify and download your tamper-proof academic results
              </p>
              <span className="card-btn">
                Check <i className="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats " id="about">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10</div>
              <div className="stat-label">Years Excellence</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25K</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span>TECHUNIVERSITY</span>
            </div>

            <div className="footer-bottom">
              <p>
                &copy; 2025 TechUniversity. All rights reserved. Powered by
                blockchain technology.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
