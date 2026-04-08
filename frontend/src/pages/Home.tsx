import "./Home.css";

function Home() {
  return (
    <div className="home">
      
      <section className="header">
        <h1 className="header-title">Organize Your Life, Effortlessly</h1>
        <p className="header-subtitle">
          Manage tasks, stay focused, and boost productivity with your all-in-one task tracker.
        </p>
        <button className="header-btn">Get Started</button>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Easy Task Management</h3>
          <p>Create, edit, and organize tasks with a simple interface.</p>
        </div>

        <div className="feature-card">
          <h3>Stay Organized</h3>
          <p>Keep track of your daily, weekly, and long-term goals.</p>
        </div>

        <div className="feature-card">
          <h3>Boost Productivity</h3>
          <p>Focus on what matters and get more done efficiently.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;