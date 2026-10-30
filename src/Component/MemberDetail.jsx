import Avatar from "./Avatar";
import { Modal } from "./Modal";
import { getPosition } from "../constants";
import { formatThaiDate } from "../utils/format";
import "./MemberDetail.css";

function MemberDetail({ member, onEdit, onDelete, onClose }) {
  const position = getPosition(member.position);

  const rows = [
    ["รหัสสมาชิก", member.code],
    ["เพศ", member.gender],
    ["อีเมล", member.email || "-"],
    ["เบอร์โทร", member.phone || "-"],
    ["วันที่เริ่มงาน", formatThaiDate(member.startDate)],
  ];

  return (
    <Modal title="รายละเอียดสมาชิก" onClose={onClose}>
      <div className="detail-profile">
        <Avatar member={member} size="xl" />
        <h4>{member.name}</h4>
        <span className={`position-label ${position.key}-label`}>
          {member.position}
        </span>
      </div>

      <dl className="detail-list">
        {rows.map(([label, value]) => (
          <div className="detail-row" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="modal-actions">
        <button
          type="button"
          className="detail-delete"
          onClick={() => onDelete(member.id)}
        >
          ลบ
        </button>
        <button type="button" className="cancel-button" onClick={onClose}>
          ปิด
        </button>
        <button
          type="button"
          className="save-button"
          onClick={() => onEdit(member.id)}
        >
          แก้ไขข้อมูล
        </button>
      </div>
    </Modal>
  );
}

export default MemberDetail;
