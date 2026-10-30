
import React, { useState } from "react";
import "./App.css";

import Header from "./Component/Header";
import PersonList from "./Component/Personlist";

function App() {
  const [activeMenu, setActiveMenu] = useState("home");

  const handleNavigation = (menu, sectionId) => {
    setActiveMenu(menu);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <div className="content-welcome">
          <span className="welcome-badge">MY DASHBOARD</span>
          <h2>ภาพรวมข้อมูลของเรา</h2>
          <p>จัดการและตรวจสอบข้อมูลสมาชิกของบริษัท</p>
        </div>

        <PersonList />
      </main>

      <nav className="bottom-navigation">
        <button
          className={`nav-item ${activeMenu === "home" ? "active" : ""}`}
          onClick={() => handleNavigation("home", "home")}
        >
          <span className="nav-icon">⌂</span>
          <span>หน้าหลัก</span>
        </button>

        <button
          className={`nav-item ${activeMenu === "members" ? "active" : ""}`}
          onClick={() => handleNavigation("members", "members")}
        >
          <span className="nav-icon">♙</span>
          <span>สมาชิก</span>
        </button>

        <button
          className={`nav-item ${activeMenu === "age" ? "active" : ""}`}
          onClick={() => handleNavigation("age", "age-box")}
        >
          <span className="nav-icon">◷</span>
          <span>ข้อมูลอายุ</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
