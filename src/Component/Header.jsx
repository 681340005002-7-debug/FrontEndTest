import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <span className="header-logo">MY</span>
          <div>
            <h1>My React Dashboard</h1>
            <p>Welcome to my React Website</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
