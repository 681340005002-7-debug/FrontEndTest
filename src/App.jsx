import { useCallback, useEffect, useState } from "react";
import "./App.css";

import Header from "./Component/Header";
import PersonList from "./Component/Personlist";
import Toast from "./Component/Toast";
import { POSITIONS } from "./constants";
import { loadMembers, nextCode, saveMembers, uid } from "./utils/members";

function App() {
  const [activeMenu, setActiveMenu] = useState("home");
  const [members, setMembers] = useState(loadMembers);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // ปิดข้อความแจ้งเตือนอัตโนมัติ
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  // บันทึกข้อมูลเมื่อมีการเปลี่ยนแปลง (แจ้งเตือนถ้าพื้นที่จัดเก็บเต็ม)
  useEffect(() => {
    if (!saveMembers(members)) {
      notify("บันทึกข้อมูลไม่สำเร็จ พื้นที่จัดเก็บของเบราว์เซอร์อาจเต็ม ลองลบรูปโปรไฟล์บางรูป", "error");
    }
  }, [members, notify]);

  const addMember = (data) => {
    const id = uid();
    setMembers((old) => [...old, { ...data, id, code: nextCode(old) }]);
    notify(`เพิ่ม “${data.name}” เรียบร้อยแล้ว`);
  };

  const updateMember = (id, data) => {
    setMembers((old) => old.map((m) => (m.id === id ? { ...m, ...data } : m)));
    notify(`บันทึกข้อมูลของ “${data.name}” แล้ว`);
  };

  const deleteMember = (id) => {
    const removed = members.find((m) => m.id === id);
    setMembers((old) => old.filter((m) => m.id !== id));
    if (removed) notify(`ลบ “${removed.name}” แล้ว`);
  };

  const countPosition = (position) =>
    members.filter((item) => item.position === position).length;

  const handleNavigation = (menu, sectionId) => {
    setActiveMenu(menu);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const navItems = [
    { menu: "home", sectionId: "home", icon: "⌂", label: "หน้าหลัก" },
    { menu: "members", sectionId: "members", icon: "♙", label: "สมาชิก" },
    { menu: "overview", sectionId: "overview", icon: "◷", label: "ภาพรวม" },
  ];

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <section className="content-welcome" id="home">
          <span className="welcome-badge">MY DASHBOARD</span>
          <h2>ภาพรวมข้อมูลบุคลากร</h2>
          <p>ระบบจัดการและตรวจสอบข้อมูลสมาชิกในองค์กร</p>
        </section>

        {/* Dashboard Statistics */}
        <section className="dashboard-grid">
          <article className="stat-card stat-blue">
            <div className="stat-icon">♙</div>
            <div>
              <span>สมาชิกทั้งหมด</span>
              <h3>{members.length}</h3>
              <small>คนในระบบ</small>
            </div>
          </article>

          {POSITIONS.map((p) => (
            <article className={`stat-card ${p.statClass}`} key={p.value}>
              <div className="stat-icon">{p.icon}</div>
              <div>
                <span>{p.value}</span>
                <h3>{countPosition(p.value)}</h3>
                <small>บุคลากร</small>
              </div>
            </article>
          ))}
        </section>

        {/* Position Overview */}
        <section className="overview-card" id="overview">
          <div className="section-title">
            <h3>สัดส่วนบุคลากร</h3>
            <p>แสดงจำนวนสมาชิกแยกตามตำแหน่ง</p>
          </div>

          {POSITIONS.map((p) => {
            const count = countPosition(p.value);
            const percent = members.length ? (count / members.length) * 100 : 0;

            return (
              <div className="chart-row" key={p.value}>
                <div className="chart-label">
                  <span>{p.value}</span>
                  <strong>
                    {count} คน ({Math.round(percent)}%)
                  </strong>
                </div>
                <div className="chart-track">
                  <div
                    className={`chart-bar ${p.key}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* Member Management */}
        <PersonList
          members={members}
          onAdd={addMember}
          onUpdate={updateMember}
          onDelete={deleteMember}
        />
      </main>

      <Toast toast={toast} />

      <nav className="bottom-navigation" aria-label="เมนูหลัก">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.menu}
            className={`nav-item ${activeMenu === item.menu ? "active" : ""}`}
            onClick={() => handleNavigation(item.menu, item.sectionId)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
