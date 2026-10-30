import { GENDERS, POSITIONS, STORAGE_KEY } from "../constants";

export const initialData = [
  { id: 1, code: "EMP-001", name: "yaowapa", gender: "หญิง", position: "IT Dev" },
  { id: 2, code: "EMP-002", name: "cholada", gender: "หญิง", position: "Marketing" },
  { id: 3, code: "EMP-003", name: "kuntawit", gender: "ชาย", position: "Sales" },
  { id: 4, code: "EMP-004", name: "areeya", gender: "หญิง", position: "IT Dev" },
];

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const makeCode = (n) => `EMP-${String(n).padStart(3, "0")}`;

export function nextCode(members) {
  const max = members.reduce((acc, m) => {
    const n = Number(String(m.code ?? "").match(/(\d+)$/)?.[1]);
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 0);
  return makeCode(max + 1);
}

// เติมค่าเริ่มต้นให้ข้อมูลเก่าที่ยังไม่มีฟิลด์ใหม่ (เช่น อีเมล รูป รหัส)
function normalize(m, index) {
  return {
    id: m.id ?? uid(),
    code: m.code || makeCode(index + 1),
    name: String(m.name ?? "").trim(),
    gender: GENDERS.includes(m.gender) ? m.gender : GENDERS[0],
    position: POSITIONS.some((p) => p.value === m.position)
      ? m.position
      : POSITIONS[0].value,
    email: m.email ?? "",
    phone: m.phone ?? "",
    startDate: m.startDate ?? "",
    photo: m.photo ?? "",
  };
}

export function loadMembers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((m) => m && typeof m === "object")
          .map(normalize);
      }
    }
  } catch {
    // ข้อมูลเสียหาย -> ใช้ค่าเริ่มต้น
  }
  return initialData.map(normalize);
}

// คืนค่า true ถ้าบันทึกสำเร็จ
export function saveMembers(members) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    return true;
  } catch {
    return false;
  }
}
