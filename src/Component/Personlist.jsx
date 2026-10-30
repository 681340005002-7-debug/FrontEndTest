import { useMemo, useState } from "react";
import "./Personlist.css";

import Avatar from "./Avatar";
import MemberForm from "./MemberForm";
import MemberDetail from "./MemberDetail";
import { ConfirmDialog } from "./Modal";
import { ALL, GENDERS, POSITIONS, getPosition } from "../constants";
import { formatThaiDate } from "../utils/format";
import { useMediaQuery } from "../utils/useMediaQuery";

const VIEW_KEY = "myreact_view";
const PAGE_SIZES = [6, 12, 24];

function loadView() {
  try {
    return localStorage.getItem(VIEW_KEY) === "card" ? "card" : "table";
  } catch {
    return "table";
  }
}

function RowActions({ member, onView, onEdit, onDelete }) {
  return (
    <div className="action-buttons">
      <button
        type="button"
        className="view-button"
        onClick={() => onView(member.id)}
        aria-label={`ดูรายละเอียด ${member.name}`}
      >
        ดู
      </button>
      <button
        type="button"
        className="edit-button"
        onClick={() => onEdit(member.id)}
        aria-label={`แก้ไข ${member.name}`}
      >
        แก้ไข
      </button>
      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(member.id)}
        aria-label={`ลบ ${member.name}`}
      >
        ลบ
      </button>
    </div>
  );
}

function PersonList({ members, onAdd, onUpdate, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState(ALL);
  const [filterGender, setFilterGender] = useState(ALL);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [preferredView, setPreferredView] = useState(loadView);
  const [hide, setHide] = useState(false);
  // modal: null | { type: "add" | "edit" | "detail" | "delete", id? }
  const [modal, setModal] = useState(null);

  // มือถือแสดงเป็น Card เสมอ (ตารางกว้างเกินไป)
  const isMobile = useMediaQuery("(max-width: 650px)");
  const view = isMobile ? "card" : preferredView;

  const changeView = (next) => {
    setPreferredView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // ไม่เป็นไร: แค่จำค่าไม่ได้
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members
      .filter((m) => !q || m.name.toLowerCase().includes(q))
      .filter((m) => filterPosition === ALL || m.position === filterPosition)
      .filter((m) => filterGender === ALL || m.gender === filterGender)
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name, "th")
          : b.name.localeCompare(a.name, "th"),
      );
  }, [members, search, filterPosition, filterGender, sortOrder]);

  const hasFilter =
    search.trim() !== "" || filterPosition !== ALL || filterGender !== ALL;

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // clamp หน้าปัจจุบัน: เช่น ลบรายการสุดท้ายของหน้า จะไม่ค้างอยู่หน้าว่าง
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  const clearFilters = () => {
    setSearch("");
    setFilterPosition(ALL);
    setFilterGender(ALL);
    setPage(1);
  };

  const target = modal?.id != null ? members.find((m) => m.id === modal.id) : null;
  const closeModal = () => setModal(null);

  const openView = (id) => setModal({ type: "detail", id });
  const openEdit = (id) => setModal({ type: "edit", id });
  const askDelete = (id) => setModal({ type: "delete", id });

  const handleSubmit = (data) => {
    if (modal?.type === "edit") onUpdate(modal.id, data);
    else onAdd(data);
    closeModal();
  };

  const handleConfirmDelete = () => {
    onDelete(modal.id);
    closeModal();
  };

  const actions = {
    onView: openView,
    onEdit: openEdit,
    onDelete: askDelete,
  };

  const emptyText =
    members.length === 0
      ? "ยังไม่มีสมาชิก กดปุ่ม “เพิ่มสมาชิก” เพื่อเริ่มต้น"
      : "ไม่พบสมาชิกที่ตรงกับเงื่อนไข";

  return (
    <section className="person-section" id="members">
      <div className="person-heading">
        <div>
          <h2>รายชื่อสมาชิก</h2>
          <p>จัดการและตรวจสอบข้อมูลสมาชิกทั้งหมด</p>
        </div>

        <div className="person-total">
          <span>สมาชิกทั้งหมด</span>
          <strong>{members.length}</strong>
          <span>คน</span>
        </div>
      </div>

      <div className="person-toolbar">
        <div>
          <h3>ข้อมูลสมาชิก</h3>
          <p>ค้นหา เพิ่ม แก้ไข และจัดการข้อมูล</p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={() => setModal({ type: "add" })}
        >
          + เพิ่มสมาชิก
        </button>
      </div>

      <div className="filter-toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="ค้นหาชื่อบุคลากร..."
          aria-label="ค้นหาชื่อบุคลากร"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          aria-label="กรองตามตำแหน่ง"
          value={filterPosition}
          onChange={(e) => {
            setFilterPosition(e.target.value);
            setPage(1);
          }}
        >
          <option value={ALL}>ทุกตำแหน่ง</option>
          {POSITIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.value}
            </option>
          ))}
        </select>

        <select
          aria-label="กรองตามเพศ"
          value={filterGender}
          onChange={(e) => {
            setFilterGender(e.target.value);
            setPage(1);
          }}
        >
          <option value={ALL}>ทุกเพศ</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="sort-button"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          aria-label="สลับการเรียงลำดับตามชื่อ"
        >
          {sortOrder === "asc" ? "ชื่อ ก-ฮ ↑" : "ชื่อ ฮ-ก ↓"}
        </button>
      </div>

      <div className="person-toolbar-secondary">
        <div className="result-info" aria-live="polite">
          <span>
            พบ <strong>{filtered.length}</strong> รายการ
            {hasFilter && ` (จากทั้งหมด ${members.length})`}
          </span>
          {hasFilter && (
            <button type="button" className="clear-button" onClick={clearFilters}>
              ล้างตัวกรอง
            </button>
          )}
        </div>

        <div className="view-controls">
          {!isMobile && (
            <div className="view-toggle" role="group" aria-label="รูปแบบการแสดงผล">
              <button
                type="button"
                className={view === "table" ? "active" : ""}
                aria-pressed={view === "table"}
                onClick={() => changeView("table")}
              >
                ☰ ตาราง
              </button>
              <button
                type="button"
                className={view === "card" ? "active" : ""}
                aria-pressed={view === "card"}
                onClick={() => changeView("card")}
              >
                ▦ การ์ด
              </button>
            </div>
          )}

          <select
            className="page-size-select"
            aria-label="จำนวนรายการต่อหน้า"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size} / หน้า
              </option>
            ))}
          </select>

          <button
            type="button"
            className="toggle-button"
            onClick={() => setHide(!hide)}
          >
            {hide ? "แสดงข้อมูล" : "ซ่อนข้อมูล"}
          </button>
        </div>
      </div>

      {hide ? (
        <div className="hidden-message">
          <p>ซ่อนข้อมูลสมาชิกอยู่</p>
          <span>กดปุ่มแสดงข้อมูลเพื่อดูรายชื่อสมาชิก</span>
        </div>
      ) : (
        <>
          {pageItems.length === 0 && <div className="empty-data">{emptyText}</div>}

          {pageItems.length > 0 && view === "table" && (
            <div className="table-container">
              <table className="person-table">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th className="col-member">สมาชิก</th>
                    <th>รหัส</th>
                    <th className="hide-tablet">เพศ</th>
                    <th>ตำแหน่ง</th>
                    <th className="hide-tablet">เริ่มงาน</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((m, index) => {
                    const position = getPosition(m.position);
                    return (
                      <tr key={m.id}>
                        <td className="number-cell">{startIndex + index + 1}</td>
                        <td className="col-member">
                          <div className="member-info">
                            <Avatar member={m} size="sm" />
                            <div className="member-text">
                              <button
                                type="button"
                                className="name-button"
                                onClick={() => openView(m.id)}
                              >
                                {m.name}
                              </button>
                              {m.email && <small>{m.email}</small>}
                            </div>
                          </div>
                        </td>
                        <td>{m.code}</td>
                        <td className="hide-tablet">{m.gender}</td>
                        <td>
                          <span className={`position-label ${position.key}-label`}>
                            {m.position}
                          </span>
                        </td>
                        <td className="hide-tablet">{formatThaiDate(m.startDate)}</td>
                        <td>
                          <RowActions {...actions} member={m} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pageItems.length > 0 && view === "card" && (
            <div className="member-grid">
              {pageItems.map((m) => {
                const position = getPosition(m.position);
                return (
                  <article className="member-card" key={m.id}>
                    <div className={`card-banner ${position.key}-banner`} />
                    <button
                      type="button"
                      className="card-avatar"
                      onClick={() => openView(m.id)}
                      aria-label={`ดูรายละเอียด ${m.name}`}
                    >
                      <Avatar member={m} size="lg" />
                    </button>

                    <div className="card-body">
                      <h4 className="card-name">{m.name}</h4>
                      <span className="card-code">{m.code}</span>
                      <span className={`position-label ${position.key}-label`}>
                        {m.position}
                      </span>

                      <ul className="card-meta">
                        <li>
                          <span>เพศ</span>
                          <strong>{m.gender}</strong>
                        </li>
                        <li>
                          <span>อีเมล</span>
                          <strong title={m.email}>{m.email || "-"}</strong>
                        </li>
                        <li>
                          <span>โทร</span>
                          <strong>{m.phone || "-"}</strong>
                        </li>
                      </ul>
                    </div>

                    <RowActions {...actions} member={m} />
                  </article>
                );
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                ก่อนหน้า
              </button>

              <span>
                หน้า {currentPage} / {totalPages}
                <small>
                  {" "}
                  (แสดง {startIndex + 1}-{startIndex + pageItems.length})
                </small>
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                ถัดไป
              </button>
            </div>
          )}
        </>
      )}

      <div className="table-footer">
        <span>สมาชิกทั้งหมด {members.length} รายการ</span>
        <span>บันทึกข้อมูลอัตโนมัติ</span>
      </div>

      {modal?.type === "add" && (
        <MemberForm members={members} onSubmit={handleSubmit} onClose={closeModal} />
      )}

      {modal?.type === "edit" && target && (
        <MemberForm
          member={target}
          members={members}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}

      {modal?.type === "detail" && target && (
        <MemberDetail
          member={target}
          onEdit={openEdit}
          onDelete={askDelete}
          onClose={closeModal}
        />
      )}

      {modal?.type === "delete" && target && (
        <ConfirmDialog
          title="ลบสมาชิก"
          message={`ต้องการลบ “${target.name}” ใช่หรือไม่? การลบไม่สามารถกู้คืนได้`}
          confirmText="ลบสมาชิก"
          onConfirm={handleConfirmDelete}
          onCancel={closeModal}
        />
      )}
    </section>
  );
}

export default PersonList;
