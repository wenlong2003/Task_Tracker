import "./Home.css";

function Home() {
  return (
    <>
      <div className="wrapper">
        <div className="box">
          {[...Array(10)].map((_, i) => (
            <div key={i}></div>
          ))}
        </div>
      </div>

      <main className="main-container">
        <div className="content">
          <section className="hero">
            <h1 className="title">Organize Your Life</h1>
            <p className="subtitle">Manage efficiently your tasks, events, or important dates with ease</p>
            <button className="cta-btn">Get Started</button>
          </section>
        </div>

        <div className="section-divider"></div>

        <section className="features">
          <div className="feature-card"><h3>Feature 1</h3><p>Description</p></div>
          <div className="feature-card"><h3>Feature 2</h3><p>Description</p></div>
          <div className="feature-card"><h3>Feature 3</h3><p>Description</p></div>
        </section>
      </main>
    </>
  );
}

export default Home;