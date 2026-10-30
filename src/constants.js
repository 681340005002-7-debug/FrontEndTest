import dev from "./assets/Dev.svg";
import marketing from "./assets/Marketing.svg";
import sales from "./assets/sales.svg";

// แหล่งข้อมูลตำแหน่งที่เดียว: เพิ่มตำแหน่งใหม่ที่นี่ที่เดียว (พร้อมสีใน CSS ตาม key)
export const POSITIONS = [
  { value: "IT Dev", key: "dev", image: dev, icon: "⌘", statClass: "stat-purple" },
  { value: "Marketing", key: "marketing", image: marketing, icon: "▤", statClass: "stat-orange" },
  { value: "Sales", key: "sales", image: sales, icon: "↗", statClass: "stat-green" },
];

export const GENDERS = ["ชาย", "หญิง"];

export const ALL = "ทั้งหมด";

export const STORAGE_KEY = "myreact_members";

export const getPosition = (value) =>
  POSITIONS.find((p) => p.value === value) ?? POSITIONS[0];
