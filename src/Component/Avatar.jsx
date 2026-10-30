import { getPosition } from "../constants";
import "./Avatar.css";

// แสดงรูปโปรไฟล์ ถ้าไม่มีรูปจะใช้ภาพประจำตำแหน่งแทน
function Avatar({ member, size = "md" }) {
  const position = getPosition(member.position);

  if (member.photo) {
    return (
      <img
        className={`avatar avatar-${size} avatar-photo`}
        src={member.photo}
        alt={`รูปโปรไฟล์ ${member.name || ""}`.trim()}
      />
    );
  }

  return (
    <img
      className={`avatar avatar-${size} avatar-default ${position.key}-bg`}
      src={position.image}
      alt=""
    />
  );
}

export default Avatar;
