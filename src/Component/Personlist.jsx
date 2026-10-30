
import React, { useState } from "react";
import "./Personlist.css";
import dev from "../assets/Dev.svg";
import marketing from "../assets/Marketing.svg";
import sales from "../assets/sales.svg";

function PersonList() {
  const [data] = useState([
    { id: 1, name: "yaowapa", gender: "หญิง", position: "IT Dev" },
    { id: 2, name: "cholada", gender: "หญิง", position: "Marketing" },
    { id: 3, name: "kuntawit", gender: "ชาย", position: "Sales" },
    { id: 4, name: "areeya", gender: "หญิง", position: "IT Dev" },
  ]);

  const [hide, setHide] = useState(false);

  const getPositionImage = (position) => {
    if (position === "IT Dev") return dev;
    if (position === "Marketing") return marketing;
    return sales;
  };

  const getPositionClass = (position) => {
    if (position === "IT Dev") return "dev-label";
    if (position === "Marketing") return "marketing-label";
    return "sales-label";
  };

  return (
    <section className="person-section" id="members">
      <div className="person-heading">
        <div>
          <h2>รายชื่อสมาชิก</h2>
          <p>จัดการและแสดงข้อมูลสมาชิกทั้งหมด</p>
        </div>

        <div className="person-total">
          <span>สมาชิกทั้งหมด</span>
          <strong>{data.length}</strong>
          <span>คน</span>
        </div>
      </div>

      <div className="person-toolbar">
        <div>
          <h3>ข้อมูลสมาชิก</h3>
          <p>รายละเอียดสมาชิกในระบบ</p>
        </div>

        <button
          className="toggle-button"
          onClick={() => setHide(!hide)}
        >
          {hide ? "แสดงข้อมูล" : "ซ่อนข้อมูล"}
        </button>
      </div>

      {!hide ? (
        <>
          {/* ตารางสำหรับคอมพิวเตอร์ */}
          <div className="table-container">
            <table className="person-table">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>สมาชิก</th>
                  <th>รหัสสมาชิก</th>
                  <th>เพศ</th>
                  <th>ตำแหน่ง</th>
                  <th>สถานะ</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={item.id}>
                    <td className="number-cell">{index + 1}</td>

                    <td>
                      <div className="member-info">
                        <img
                          src={getPositionImage(item.position)}
                          alt={item.position}
                        />
                        <span>{item.name}</span>
                      </div>
                    </td>

                    <td>#{String(item.id).padStart(3, "0")}</td>
                    <td>{item.gender}</td>

                    <td>
                      <span className={`position-label ${getPositionClass(item.position)}`}>
                        {item.position}
                      </span>
                    </td>

                    <td>
                      <span className="status-label">
                        <span className="status-dot"></span>
                        กำลังใช้งาน
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* การ์ดสำหรับมือถือ */}
          <div className="mobile-member-list">
            {data.map((item, index) => (
              <article className="mobile-member-card" key={item.id}>
                <div className="mobile-card-top">
                  <div className="member-info">
                    <img
                      src={getPositionImage(item.position)}
                      alt={item.position}
                    />
                    <div>
                      <h4>{item.name}</h4>
                      <span className="mobile-member-id">
                        สมาชิก #{String(item.id).padStart(3, "0")}
                      </span>
                    </div>
                  </div>

                  <span className="status-label">
                    <span className="status-dot"></span>
                    ใช้งาน
                  </span>
                </div>

                <div className="mobile-card-bottom">
                  <span>เพศ: {item.gender}</span>
                  <span className={`position-label ${getPositionClass(item.position)}`}>
                    {item.position}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="hidden-message">
          <p>ซ่อนข้อมูลสมาชิกอยู่</p>
          <span>กดปุ่มแสดงข้อมูลเพื่อดูรายชื่อสมาชิก</span>
        </div>
      )}

      <div className="table-footer">
        <span>แสดงข้อมูล {data.length} รายการ</span>
        <span>ข้อมูลสมาชิกทั้งหมดในระบบ</span>
      </div>
    </section>
  );
}

export default PersonList;
