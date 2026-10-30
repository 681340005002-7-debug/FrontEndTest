
import React, { useState } from "react";
import "./Header.css";

function Header() {
  const [age, setAge] = useState(20);

  return (
    <header className="header" id="home">
      <div className="header-content">
        <div className="header-title">
          <span className="header-logo">MY</span>
          <div>
            <h1>My React Dashboard</h1>
            <p>Welcome to my React Website</p>
          </div>
        </div>

        <div className="age-box" id="age-box">
          <div>
            <span>อายุปัจจุบัน</span>
            <h2>{age} ปี</h2>
          </div>

          <div className="age-buttons">
            <button onClick={() => setAge(age + 1)}>+ เพิ่ม</button>
            <button onClick={() => setAge(age > 0 ? age - 1 : 0)}>
              - ลด
            </button>
            <button onClick={() => setAge(20)}>รีเซ็ต</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
